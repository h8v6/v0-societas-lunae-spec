"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, User } from "lucide-react"
import { VotingButton } from "@/components/shared/voting-button"

interface EpisodeHeaderProps {
  episode: {
    id: string
    title?: string
    description: string
    status: "suggested" | "completed" | "planned"
    isLiveStream?: boolean
    streamStatus?: "scheduled" | "live" | "finished" | "completed"
    scheduledDate?: Date
    date: Date
    duration?: string
    host?: string
    votes?: number
    likes?: number
    urls?: string[]
  }
  isLiked: boolean
  onToggleLike: () => void
  displayLikes: number
  isSuggested: boolean
}

export function EpisodeHeader({ episode, isLiked, onToggleLike, displayLikes, isSuggested }: EpisodeHeaderProps) {
  const isLiveStream = episode.isLiveStream || false
  const streamStatus = episode.streamStatus || "scheduled"

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <VotingButton
          votes={displayLikes}
          isVoted={isLiked}
          onVote={onToggleLike}
          size="large"
          variant={isSuggested ? "primary" : "secondary"}
        />

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {episode.title && <h1 className="text-3xl font-bold">{episode.title}</h1>}
              <p className="text-muted-foreground leading-relaxed">{episode.description}</p>
            </div>
            <div className="flex gap-2">
              {episode.status === "suggested" && <Badge variant="secondary">Suggested</Badge>}
              {episode.status === "completed" && <Badge className="bg-green-500/10 text-green-500">Completed</Badge>}
              {isLiveStream && streamStatus === "live" && (
                <Badge className="bg-red-500 text-white animate-pulse">● LIVE</Badge>
              )}
              {isLiveStream && streamStatus === "scheduled" && <Badge variant="outline">Scheduled</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {episode.host && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{episode.host}</span>
              </div>
            )}
            {episode.scheduledDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{episode.scheduledDate.toLocaleDateString()}</span>
              </div>
            )}
            {episode.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{episode.duration}</span>
              </div>
            )}
          </div>

          {episode.urls && episode.urls.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reference URLs:</h3>
              <div className="flex flex-wrap gap-2">
                {episode.urls.map((url, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      Link {index + 1}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
