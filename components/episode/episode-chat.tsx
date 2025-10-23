"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ExternalLink } from "lucide-react"
import { ChatMessage } from "@/components/shared/chat-message"

interface ChatMessageType {
  id: string
  username: string
  message: string
  timestamp: Date
  upvotes: number
  reactions: { icon: string; count: number }[]
  isPinned: boolean
  upvotedBy: string[]
}

interface EpisodeChatProps {
  messages: ChatMessageType[]
  streamStatus: string
  isCompleted: boolean
  isAdmin: boolean
  userId?: string
  onSendMessage: (message: string) => void
  onPin: (messageId: string) => void
  onReaction: (messageId: string, iconId: string) => void
  onUpvote: (messageId: string) => void
  onOpenChatWindow: () => void
}

export function EpisodeChat({
  messages,
  streamStatus,
  isCompleted,
  isAdmin,
  userId,
  onSendMessage,
  onPin,
  onReaction,
  onUpvote,
  onOpenChatWindow,
}: EpisodeChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const pinnedMessages = messages.filter((msg) => msg.isPinned)
  const regularMessages = messages.filter((msg) => !msg.isPinned)

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isCompleted ? "Archived Chat" : "Live Chat"}</h2>
        <Button variant="outline" size="sm" onClick={onOpenChatWindow} className="gap-2 bg-transparent">
          <ExternalLink className="h-4 w-4" />
          Pop Out
        </Button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto mb-4">
        {pinnedMessages.length > 0 && (
          <div className="space-y-2 pb-4 border-b">
            {pinnedMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isAdmin={isAdmin}
                userId={userId}
                onPin={onPin}
                onReaction={onReaction}
                onUpvote={onUpvote}
              />
            ))}
          </div>
        )}

        {regularMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isAdmin={isAdmin}
            userId={userId}
            onPin={onPin}
            onReaction={onReaction}
            onUpvote={onUpvote}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {streamStatus === "live" && !isCompleted && (
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="text-center text-sm text-muted-foreground py-4 bg-muted/30 rounded">
          Chat is archived. No new messages can be sent.
        </div>
      )}
    </Card>
  )
}
