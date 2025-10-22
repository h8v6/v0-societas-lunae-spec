"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ExternalLink, Search, Plus, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockNews } from "@/lib/news-data"
import { useAuth } from "@/lib/auth-context"

type SortOption = "votes" | "recent" | "oldest"
type DateFilter = "today" | "week" | "month"

export function NewsBoard() {
  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "moderator"

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("votes")
  const [dateFilter, setDateFilter] = useState<DateFilter>("week")
  const [votedNews, setVotedNews] = useState<Set<string>>(new Set())
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [newNewsTitle, setNewNewsTitle] = useState("")
  const [newNewsDescription, setNewNewsDescription] = useState("")
  const [urls, setUrls] = useState<string[]>([""])
  const [news, setNews] = useState(mockNews)

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
    const references = validUrls.map((url, idx) => ({
      number: `${idx + 1}`,
      url: url,
    }))

    const newNews = {
      id: `n${Date.now()}`,
      title: newNewsTitle,
      description: newNewsDescription,
      references: references,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      votes: 0,
      author: user?.username || "Anonymous",
      category: "AI Technology",
    }

    setNews([newNews, ...news])
    setNewNewsTitle("")
    setNewNewsDescription("")
    setUrls([""])
    setIsFormExpanded(false)
  }

  const getDateFilterRange = (filter: DateFilter) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (filter) {
      case "today":
        return today.getTime()
      case "week":
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return weekAgo.getTime()
      case "month":
        const monthAgo = new Date(today)
        monthAgo.setDate(monthAgo.getDate() - 30)
        return monthAgo.getTime()
    }
  }

  const filteredNews = news
    .filter((newsItem) => {
      if (!isAdmin && newsItem.status !== "approved") return false

      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.description.toLowerCase().includes(searchQuery.toLowerCase())

      const newsDate = new Date(newsItem.createdAt).getTime()
      const filterDate = getDateFilterRange(dateFilter)
      const matchesDate = newsDate >= filterDate

      return matchesSearch && matchesDate
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes
      if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return 0
    })

  const handleVote = (newsId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setVotedNews((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(newsId)) {
        newSet.delete(newsId)
      } else {
        newSet.add(newsId)
      }
      return newSet
    })
  }

  const handleCardClick = (newsId: string) => {
    router.push(`/news/${newsId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">Most Votes</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Card className="border-dashed border-2 bg-muted/30">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Suggest News</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isFormExpanded ? "rotate-180" : ""}`} />
            </CardTitle>
          </CardHeader>
          {isFormExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="News title..."
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="What's the news about?"
                  value={newNewsDescription}
                  onChange={(e) => setNewNewsDescription(e.target.value)}
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
                disabled={!newNewsTitle || !newNewsDescription}
                className="w-full"
              >
                Submit Suggestion
              </Button>
            </CardContent>
          )}
        </Card>

        {filteredNews.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No news found. Try adjusting your filters or check back later!</p>
          </Card>
        )}

        {filteredNews.map((newsItem) => (
          <Card
            key={newsItem.id}
            className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleCardClick(newsItem.id)}
          >
            <div className="flex gap-4">
              <button
                onClick={(e) => handleVote(newsItem.id, e)}
                className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] border-2 transition-colors ${
                  votedNews.has(newsItem.id)
                    ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                    : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                }`}
              >
                <ArrowUp className="h-5 w-5" />
                <span className="text-sm font-bold">{newsItem.votes + (votedNews.has(newsItem.id) ? 1 : 0)}</span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-semibold hover:text-primary transition-colors">{newsItem.title}</h3>
                  {isAdmin && (
                    <Badge
                      variant={
                        newsItem.status === "approved"
                          ? "default"
                          : newsItem.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {newsItem.status}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-3">{newsItem.description}</p>

                {newsItem.references.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {newsItem.references.slice(0, 2).map((ref) => (
                      <a
                        key={ref.number}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        <span className="truncate">
                          [{ref.number}] {new URL(ref.url).hostname}
                        </span>
                      </a>
                    ))}
                    {newsItem.references.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{newsItem.references.length - 2} more references
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>by {newsItem.author}</span>
                  <span>•</span>
                  <span>{new Date(newsItem.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{newsItem.references.length} references</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
