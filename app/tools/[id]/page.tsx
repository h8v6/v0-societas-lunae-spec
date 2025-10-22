import { ToolDetail } from "@/components/tool-detail"

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  return <ToolDetail toolId={params.id} />
}
