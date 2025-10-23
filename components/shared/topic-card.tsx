"use client"

import { ArrowUp, CheckCircle2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TopicCardProps {
  topic: {
    id: string
    title: string
    description: string
    author: string
    votes: number
    createdAt: Date
    isCovered: boolean
    urls?: string[]
  }
  isVoted: boolean
  isAdmin: boolean
  onVote: (topicId: string) => void
  onToggleCovered: (topicId: string) => void
}

export function TopicCard({ topic, isVoted, isAdmin, onVote, onToggleCovered }: TopicCardProps) {
  const displayVotes = topic.votes + (isVoted ? 1 : 0)

  return (
    <div
      className={`flex gap-4 p-4 border transition-colors ${
        topic.isCovered ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-primary/50"
      }`}
    >
      {/* Vote Button */}
      <button
        onClick={() => onVote(topic.id)}
        className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] border-2 transition-colors ${
          isVoted
            ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
            : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
        <span className="text-sm font-bold">{displayVotes}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-semibold ${topic.isCovered ? "line-through text-muted-foreground" : ""}`}>
            {topic.title}
          </h3>
          <div className="flex items-center gap-2">
            {topic.isCovered && (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Covered
              </Badge>
            )}
            {isAdmin && (
              <button
                onClick={() => onToggleCovered(topic.id)}
                className="text-xs px-2 py-1 border border-border hover:bg-muted transition-colors"
                title={topic.isCovered ? "Mark as not covered" : "Mark as covered"}
              >
                {topic.isCovered ? "Unmark" : "Mark Covered"}
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>

        {topic.urls && topic.urls.length > 0 && (
          <div className="mb-2 space-y-1">
            {topic.urls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                {url}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>by {topic.author}</span>
          <span>•</span>
          <span>
            {topic.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
