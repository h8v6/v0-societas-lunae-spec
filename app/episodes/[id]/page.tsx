import { EpisodeDetail } from "@/components/episode-detail"

export default function EpisodeDetailPage({ params }: { params: { id: string } }) {
  return <EpisodeDetail episodeId={params.id} />
}
