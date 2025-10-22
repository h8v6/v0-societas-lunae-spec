"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUp, ExternalLink, MessageSquare } from "lucide-react"

const mockTool = {
  id: "1",
  title: "Figma",
  description: "Collaborative interface design tool with real-time collaboration, prototyping, and design systems",
  url: "https://figma.com",
  author: "Sarah Chen",
  votes: 45,
  categories: ["Design", "Collaboration"],
  createdAt: new Date("2024-01-15"),
}

const mockComments = [
  {
    id: "1",
    author: "David Kim",
    content: "Best design tool I've ever used. The collaboration features are game-changing!",
    createdAt: new Date("2024-02-21"),
  },
  {
    id: "2",
    author: "Lisa Anderson",
    content: "Love the component system and auto-layout. Makes responsive design so much easier.",
    createdAt: new Date("2024-02-22"),
  },
]

export function ToolDetail({ toolId }: { toolId: string }) {
  const router = useRouter()
  const [isVoted, setIsVoted] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(mockComments)

  const displayVotes = mockTool.votes + (isVoted ? 1 : 0)

  const handlePostComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: String(comments.length + 1),
      author: "Current User",
      content: newComment,
      createdAt: new Date(),
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tools
      </Button>

      {/* Tool Header */}
      <Card className="p-6 mb-6">
        <div className="flex gap-6">
          {/* Vote Button */}
          <button
            onClick={() => setIsVoted(!isVoted)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] border-2 transition-colors ${
              isVoted
                ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
            }`}
          >
            <ArrowUp className="h-6 w-6" />
            <span className="text-lg font-bold">{displayVotes}</span>
          </button>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold">{mockTool.title}</h1>
              <a
                href={mockTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                Visit Tool
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <p className="text-lg text-muted-foreground mb-4">{mockTool.description}</p>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              {mockTool.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Added by {mockTool.author}</span>
              <span>•</span>
              <span>
                {mockTool.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
        </div>

        {/* Comment Form */}
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts on this tool..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="mb-3"
          />
          <Button onClick={handlePostComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-2 border-border pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-muted-foreground">
                  {comment.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
