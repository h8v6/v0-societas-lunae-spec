"use client"

import { ThumbsUp, Pin, Smile, Heart, Flame, Lightbulb, CheckCircle2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

const reactionIcons = {
  "thumbs-up": ThumbsUp,
  flame: Flame,
  lightbulb: Lightbulb,
  "check-circle": CheckCircle2,
  target: Target,
  heart: Heart,
}

const quickReactions = [
  { id: "thumbs-up", label: "Thumbs Up" },
  { id: "flame", label: "Fire" },
  { id: "lightbulb", label: "Idea" },
  { id: "check-circle", label: "Perfect" },
  { id: "target", label: "On Point" },
  { id: "heart", label: "Love" },
]

interface ChatMessageProps {
  message: {
    id: string
    username: string
    message: string
    timestamp: Date
    upvotes: number
    reactions: Array<{ icon: string; count: number }>
    isPinned: boolean
    upvotedBy: string[]
  }
  currentUserId?: string
  isAdmin: boolean
  showReactions: string | null
  onUpvote: (messageId: string) => void
  onReaction: (messageId: string, iconId: string) => void
  onPin: (messageId: string) => void
  onToggleReactions: (messageId: string | null) => void
}

export function ChatMessage({
  message,
  currentUserId,
  isAdmin,
  showReactions,
  onUpvote,
  onReaction,
  onPin,
  onToggleReactions,
}: ChatMessageProps) {
  const hasUpvoted = currentUserId ? message.upvotedBy.includes(currentUserId) : false

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-xs text-muted-foreground">{message.username}</span>
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          {message.timestamp.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="text-base leading-relaxed">{message.message}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {message.reactions.map((reaction, idx) => {
          const IconComponent = reactionIcons[reaction.icon as keyof typeof reactionIcons]
          return (
            <button
              key={idx}
              className="text-sm px-2 py-1 bg-muted hover:bg-muted/80 border border-border flex items-center gap-1.5"
              onClick={() => onReaction(message.id, reaction.icon)}
            >
              {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
              <span className="text-xs text-muted-foreground">{reaction.count}</span>
            </button>
          )
        })}

        <div className="flex items-center gap-1">
          {currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote(message.id)}
              className={`h-7 px-2 gap-1 ${hasUpvoted ? "text-primary" : ""}`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span className="text-xs">{message.upvotes}</span>
            </Button>
          )}

          {currentUserId && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleReactions(showReactions === message.id ? null : message.id)}
                className="h-7 px-2"
              >
                <Smile className="h-3 w-3" />
              </Button>
              {showReactions === message.id && (
                <div className="absolute bottom-full mb-1 left-0 bg-background border border-border p-2 flex gap-1 shadow-lg z-10">
                  {quickReactions.map((reaction) => {
                    const IconComponent = reactionIcons[reaction.id as keyof typeof reactionIcons]
                    return (
                      <button
                        key={reaction.id}
                        onClick={() => {
                          onReaction(message.id, reaction.id)
                          onToggleReactions(null)
                        }}
                        className="p-1.5 hover:bg-muted transition-colors"
                        title={reaction.label}
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPin(message.id)}
              className="h-7 px-2 text-primary"
              title="Pin message"
            >
              <Pin className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
