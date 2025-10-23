"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { CommentCard } from "@/components/shared/comment-card"

interface Comment {
  id: string
  author: string
  content: string
  createdAt: Date
}

interface EpisodeCommentsSectionProps {
  comments: Comment[]
  onAddComment: (content: string) => void
  username?: string
}

export function EpisodeCommentsSection({ comments, onAddComment, username }: EpisodeCommentsSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="h-4 w-4" />
          Post Comment
        </Button>
      </div>
    </Card>
  )
}
