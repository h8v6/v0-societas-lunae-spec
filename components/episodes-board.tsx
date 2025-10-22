"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Calendar, Clock, Plus, X, ArrowUp, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { episodesData } from "@/lib/episodes-data"

const initialEpisodes = episodesData

export function EpisodesBoard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [likedEpisodes, setLikedEpisodes] = useState<Set<string>>(new Set())
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [newEpisodeTitle, setNewEpisodeTitle] = useState("")
  const [newEpisodeDescription, setNewEpisodeDescription] = useState("")
  const [urls, setUrls] = useState<string[]>([""])
  const [episodes, setEpisodes] = useState(initialEpisodes)

  const handleLike = (episodeId: string) => {
    setLikedEpisodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId)
      } else {
        newSet.add(episodeId)
      }
      return newSet
    })
  }

  const addUrlField = () => {
    setUrls([...urls, ""])
  }

  const removeUrlField = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleSubmitSuggestion = () => {
    const validUrls = urls.filter((url) => url.trim() !== "")
    const newEpisode = {
      id: `s${Date.now()}`,
      title: newEpisodeTitle,
      description: newEpisodeDescription,
      date: new Date(),
      duration: null,
      likes: 0,
      status: "suggested" as const,
      host: null,
      urls: validUrls,
    }
    setEpisodes([newEpisode, ...episodes])
    setNewEpisodeTitle("")
    setNewEpisodeDescription("")
    setUrls([""])
    setIsFormExpanded(false)
  }

  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedEpisodes = [...filteredEpisodes].sort((a, b) => {
    if (a.status === "suggested" && b.status !== "suggested") return -1
    if (a.status !== "suggested" && b.status === "suggested") return 1
    if (a.status === "suggested" && b.status === "suggested") {
      return b.likes - a.likes
    }
    return b.date.getTime() - a.date.getTime()
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        <Card className="border-dashed border-2 bg-muted/30">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Suggest Episode Topic</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isFormExpanded ? "rotate-180" : ""}`} />
            </CardTitle>
          </CardHeader>
          {isFormExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Episode title..."
                  value={newEpisodeTitle}
                  onChange={(e) => setNewEpisodeTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="What would you like to hear about in this episode?"
                  value={newEpisodeDescription}
                  onChange={(e) => setNewEpisodeDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Reference URLs (optional)</label>
                  <Button type="button" variant="ghost" size="sm" onClick={addUrlField}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add URL
                  </Button>
                </div>
                <div className="space-y-2">
                  {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        className="flex-1"
                      />
                      {urls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUrlField(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmitSuggestion}
                disabled={!newEpisodeTitle || !newEpisodeDescription}
                className="w-full"
              >
                Submit Suggestion
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Episode Cards */}
        {sortedEpisodes.map((episode) => {
          const isLiked = likedEpisodes.has(episode.id)
          const displayLikes = episode.likes + (isLiked ? 1 : 0)
          const isSuggested = episode.status === "suggested"

          return (
            <Card
              key={episode.id}
              className={
                isSuggested
                  ? "p-6 hover:border-primary/50 transition-colors"
                  : "overflow-hidden hover:border-primary/50 transition-colors"
              }
            >
              {isSuggested ? (
                <div className="flex gap-4">
                  {/* Vote Button on Left */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleLike(episode.id)
                    }}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] border-2 transition-colors ${
                      isLiked
                        ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                        : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                    }`}
                  >
                    <ArrowUp className="h-5 w-5" />
                    <span className="text-sm font-bold">{displayLikes}</span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Link href={`/episodes/${episode.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-semibold">{episode.title}</h3>
                      </Link>
                      <Badge className="bg-[var(--vote-up)] text-white flex-shrink-0">suggested</Badge>
                    </div>

                    <p className="text-muted-foreground mb-3">{episode.description}</p>

                    {episode.urls && episode.urls.length > 0 && (
                      <div className="mb-3 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Reference URLs:</p>
                        {episode.urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block text-xs text-primary hover:underline truncate"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>by {episode.host || "Community"}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {episode.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0 bg-muted" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Link href={`/episodes/${episode.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-semibold">{episode.title}</h3>
                      </Link>
                      <Badge className="bg-[var(--status-complete)] text-white flex-shrink-0">{episode.status}</Badge>
                    </div>

                    <p className="text-muted-foreground mb-3 line-clamp-2">{episode.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {episode.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{episode.duration}</span>
                      </div>
                      <span>•</span>
                      <span>by {episode.host}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleLike(episode.id)
                    }}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] border-2 transition-colors ${
                      isLiked
                        ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                        : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm font-bold">{displayLikes}</span>
                  </button>
                </div>
              )}
            </Card>
          )
        })}

        {sortedEpisodes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No episodes found. Try adjusting your search!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
