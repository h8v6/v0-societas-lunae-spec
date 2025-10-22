import { EpisodeChatWindow } from "@/components/episode-chat-window"

export default function EpisodeChatPage({ params }: { params: { id: string } }) {
  return <EpisodeChatWindow episodeId={params.id} />
}
