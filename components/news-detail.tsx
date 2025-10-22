"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowUp, ExternalLink, MessageSquare } from "lucide-react"
import { mockNews } from "@/lib/news-data"
import { useAuth } from "@/lib/auth-context"

interface Comment {
  id: string
  author: string
  content: string
  date: string
}

export function NewsDetail({ newsId }: { newsId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "moderator"

  const news = mockNews.find((n) => n.id === newsId)

  const [hasVoted, setHasVoted] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alex Thompson",
      content: "This is concerning. We need better fact-checking mechanisms in AI systems.",
      date: "Oct 22, 2024",
    },
  ])

  if (!news) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>News not found</p>
      </div>
    )
  }

  const handlePostComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          author: user?.name || "Anonymous",
          content: newComment,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ])
      setNewComment("")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/news")} className="mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to News
      </Button>

      {/* News Header */}
      <Card className="p-6 mb-6">
        <div className="flex gap-6">
          {/* Vote Button */}
          <button
            onClick={() => setHasVoted(!hasVoted)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] rounded-lg border-2 transition-colors ${
              hasVoted ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <ArrowUp className="size-6" />
            <span className="text-lg font-semibold mt-1">{news.votes + (hasVoted ? 1 : 0)}</span>
          </button>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold">{news.title}</h1>
              {isAdmin && (
                <Badge
                  variant={
                    news.status === "approved" ? "default" : news.status === "pending" ? "secondary" : "destructive"
                  }
                >
                  {news.status}
                </Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-4">{news.description}</p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>by {news.author}</span>
              <span>•</span>
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{news.references.length} references</span>
            </div>

            {/* References */}
            {news.references.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">References:</h3>
                {news.references.map((ref) => (
                  <a
                    key={ref.number}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-primary hover:underline"
                  >
                    <span className="font-mono">[{ref.number}]</span>
                    <ExternalLink className="size-3 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{ref.url}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="size-6" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts on this news..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3 min-h-[100px]"
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
                <span className="text-sm text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
