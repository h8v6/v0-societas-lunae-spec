"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Search, ChevronDown, Plus, X } from "lucide-react"
import Link from "next/link"

export const mockIdeas = [
  {
    id: "1",
    title: "AI Email Writer for Sales Teams",
    description:
      "Automated email composition tool that generates personalized sales emails using AI, with templates for cold outreach, follow-ups, and nurture sequences",
    author: "Sarah Chen",
    votes: 42,
    status: "in-progress",
    category: "Productivity",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Invoice Generator for Freelancers",
    description:
      "Simple invoicing tool with automatic payment reminders, expense tracking, and client management. Perfect for solo entrepreneurs and small agencies",
    author: "Marcus Johnson",
    votes: 38,
    status: "planned",
    category: "Finance",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Social Media Scheduler with AI Captions",
    description:
      "Schedule posts across multiple platforms with AI-generated captions and hashtags. Includes analytics and best time to post recommendations",
    author: "Emma Rodriguez",
    votes: 35,
    status: "planned",
    category: "Marketing",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    title: "Customer Feedback Widget",
    description:
      "Embeddable widget for collecting user feedback, feature requests, and bug reports. Includes voting system and roadmap display",
    author: "David Kim",
    votes: 29,
    status: "completed",
    category: "Product",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    title: "Time Tracking for Remote Teams",
    description:
      "Lightweight time tracking with project categorization, team reports, and invoice generation. No screenshots or invasive monitoring",
    author: "Lisa Anderson",
    votes: 27,
    status: "in-progress",
    category: "Productivity",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    title: "Landing Page Builder for Makers",
    description:
      "No-code landing page builder optimized for indie hackers. Pre-built sections, A/B testing, and email capture forms included",
    author: "Alex Turner",
    votes: 23,
    status: "planned",
    category: "Marketing",
    createdAt: new Date("2024-02-08"),
  },
  {
    id: "7",
    title: "Subscription Analytics Dashboard",
    description:
      "Track MRR, churn, LTV, and other SaaS metrics in one place. Integrates with Stripe, Paddle, and other payment providers",
    author: "Nina Patel",
    votes: 19,
    status: "planned",
    category: "Analytics",
    createdAt: new Date("2024-02-12"),
  },
]

type SortOption = "votes" | "recent" | "oldest"
type FilterStatus = "all" | "planned" | "in-progress" | "completed"

export function IdeasBoard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("votes")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set())

  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [newIdeaTitle, setNewIdeaTitle] = useState("")
  const [newIdeaDescription, setNewIdeaDescription] = useState("")
  const [newIdeaType, setNewIdeaType] = useState("")
  const [urls, setUrls] = useState<string[]>([""])

  const handleVote = (ideaId: string) => {
    setVotedIdeas((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId)
      } else {
        newSet.add(ideaId)
      }
      return newSet
    })
  }

  const handleSubmitIdea = () => {
    const validUrls = urls.filter((url) => url.trim() !== "")
    console.log("[v0] New idea submitted:", { newIdeaTitle, newIdeaDescription, newIdeaType, urls: validUrls })
    // Reset form
    setNewIdeaTitle("")
    setNewIdeaDescription("")
    setNewIdeaType("")
    setUrls([""])
    setIsFormExpanded(false)
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

  // Filter and sort ideas
  const filteredIdeas = mockIdeas
    .filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || idea.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes
      if (sortBy === "recent") return b.createdAt.getTime() - a.createdAt.getTime()
      if (sortBy === "oldest") return a.createdAt.getTime() - b.createdAt.getTime()
      return 0
    })

  const inProgressIdeas = filteredIdeas.filter((idea) => idea.status === "in-progress")
  const plannedIdeas = filteredIdeas.filter((idea) => idea.status === "planned")
  const completedIdeas = filteredIdeas.filter((idea) => idea.status === "completed")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-[var(--status-planned)] text-white"
      case "in-progress":
        return "bg-[var(--status-progress)] text-black"
      case "completed":
        return "bg-[var(--status-complete)] text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderIdeaCard = (idea: (typeof mockIdeas)[0]) => {
    const isVoted = votedIdeas.has(idea.id)
    const displayVotes = idea.votes + (isVoted ? 1 : 0)

    return (
      <Card key={idea.id} className="p-6 hover:border-primary/50 transition-colors">
        <div className="flex gap-4">
          {/* Vote Button */}
          <button
            onClick={() => handleVote(idea.id)}
            className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] border-2 transition-colors ${
              isVoted
                ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
            }`}
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-sm font-bold">{displayVotes}</span>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <Link href={`/ideas/${idea.id}`} className="hover:text-primary transition-colors">
                <h3 className="text-xl font-semibold">{idea.title}</h3>
              </Link>
              <Badge className={getStatusColor(idea.status)}>{idea.status.replace("-", " ")}</Badge>
            </div>

            <p className="text-muted-foreground mb-3">{idea.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>by {idea.author}</span>
              <span>•</span>
              <Badge variant="outline">{idea.category}</Badge>
              <span>•</span>
              <span>
                {idea.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
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

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {filteredIdeas.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No ideas found. Try adjusting your filters or be the first to submit one!
            </p>
          </Card>
        )}

        {inProgressIdeas.map(renderIdeaCard)}

        <Card className="border-dashed border-2 bg-muted/30">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Add New Idea</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isFormExpanded ? "rotate-180" : ""}`} />
            </CardTitle>
          </CardHeader>
          {isFormExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter idea title..."
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your idea..."
                  value={newIdeaDescription}
                  onChange={(e) => setNewIdeaDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={newIdeaType} onValueChange={setNewIdeaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
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
                onClick={handleSubmitIdea}
                disabled={!newIdeaTitle || !newIdeaDescription || !newIdeaType}
                className="w-full"
              >
                Submit Idea
              </Button>
            </CardContent>
          )}
        </Card>

        {plannedIdeas.map(renderIdeaCard)}
        {completedIdeas.map(renderIdeaCard)}
      </div>
    </div>
  )
}
