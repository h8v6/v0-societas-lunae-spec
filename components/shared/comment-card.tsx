interface CommentCardProps {
  comment: {
    id: string
    author: string
    content: string
    createdAt: Date
  }
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
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
      <p className="text-foreground leading-relaxed">{comment.content}</p>
    </div>
  )
}
