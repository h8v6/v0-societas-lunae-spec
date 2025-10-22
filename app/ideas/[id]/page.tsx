import { IdeaDetail } from "@/components/idea-detail"

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <IdeaDetail ideaId={params.id} />
    </div>
  )
}
