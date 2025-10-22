import { NewsDetail } from "@/components/news-detail"

export default function NewsDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <NewsDetail newsId={params.id} />
}
