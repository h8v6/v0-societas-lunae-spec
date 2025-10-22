"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ThumbsUp, Pin, Smile } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  upvotes: number
  reactions: { emoji: string; count: number }[]
  isPinned: boolean
  upvotedBy: string[]
}

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    username: "Sarah Chen",
    message: "Great episode! Really helpful insights on validation",
    timestamp: new Date("2024-02-15T14:23:00"),
    upvotes: 5,
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🔥", count: 2 },
    ],
    isPinned: false,
    upvotedBy: [],
  },
  {
    id: "2",
    username: "Marcus Johnson",
    message: "Can you share more about the tech stack you used?",
    timestamp: new Date("2024-02-15T14:25:00"),
    upvotes: 12,
    reactions: [{ emoji: "💡", count: 4 }],
    isPinned: true,
    upvotedBy: [],
  },
  {
    id: "3",
    username: "Emma Rodriguez",
    message: "The part about pricing was super valuable",
    timestamp: new Date("2024-02-15T14:28:00"),
    upvotes: 8,
    reactions: [
      { emoji: "💯", count: 5 },
      { emoji: "🎯", count: 2 },
    ],
    isPinned: false,
    upvotedBy: [],
  },
]

const quickReactions = ["👍", "🔥", "💡", "💯", "🎯", "❤️"]

export function EpisodeChatWindow({ episodeId }: { episodeId: string }) {
  const { user } = useAuth()
  const [chatMessages, setChatMessages] = useState(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const pinnedMessages = chatMessages.filter((msg) => msg.isPinned)
  const regularMessages = chatMessages.filter((msg) => !msg.isPinned)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: user.username,
      message: newMessage,
      timestamp: new Date(),
      upvotes: 0,
      reactions: [],
      isPinned: false,
      upvotedBy: [],
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleUpvote = (messageId: string) => {
    if (!user) return

    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const hasUpvoted = msg.upvotedBy.includes(user.id)
          return {
            ...msg,
            upvotes: hasUpvoted ? msg.upvotes - 1 : msg.upvotes + 1,
            upvotedBy: hasUpvoted ? msg.upvotedBy.filter((id) => id !== user.id) : [...msg.upvotedBy, user.id],
          }
        }
        return msg
      }),
    )
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1 }],
            }
          }
        }
        return msg
      }),
    )
    setShowReactions(null)
  }

  const handlePin = (messageId: string) => {
    setChatMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg)))
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    console.log("[v0] Chat - User:", user)
    console.log("[v0] Chat - Is Admin:", isAdmin)
  }, [user, isAdmin])

  return (
    <div className="h-screen flex flex-col bg-background">
      {user && (
        <div className="px-4 py-2 border-b border-border bg-muted/20 text-xs text-muted-foreground">
          Logged in as <span className="font-semibold">{user.username}</span>
          {isAdmin && <span className="ml-2 text-primary font-semibold">(Admin)</span>}
        </div>
      )}

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <div className="border-b border-border bg-muted/30 p-4 space-y-3">
          {pinnedMessages.map((msg) => (
            <div key={msg.id} className="space-y-1 bg-background/50 p-3 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <Pin className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => handlePin(msg.id)} className="h-6 px-2">
                    Unpin
                  </Button>
                )}
              </div>
              <p className="text-base leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {regularMessages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
              <span className="text-xs text-muted-foreground">
                {msg.timestamp.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {msg.timestamp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-base leading-relaxed">{msg.message}</p>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Reactions Display */}
              {msg.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  className="text-sm px-2 py-0.5 bg-muted hover:bg-muted/80 border border-border flex items-center gap-1"
                  onClick={() => handleReaction(msg.id, reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-xs text-muted-foreground">{reaction.count}</span>
                </button>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Upvote Button */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvote(msg.id)}
                    className={`h-7 px-2 gap-1 ${msg.upvotedBy.includes(user.id) ? "text-primary" : ""}`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs">{msg.upvotes}</span>
                  </Button>
                )}

                {/* Reaction Picker */}
                {user && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                      className="h-7 px-2"
                    >
                      <Smile className="h-3 w-3" />
                    </Button>
                    {showReactions === msg.id && (
                      <div className="absolute bottom-full mb-1 left-0 bg-background border border-border p-2 flex gap-1 shadow-lg z-10">
                        {quickReactions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="text-lg hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pin Button (Admin Only) */}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePin(msg.id)}
                    className="h-7 px-2 text-primary"
                    title="Pin message"
                  >
                    <Pin className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      {user ? (
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground border-t border-border">
          Sign in to join the chat
        </div>
      )}
    </div>
  )
}
