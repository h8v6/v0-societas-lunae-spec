"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Search, ExternalLink, X, ChevronDown } from "lucide-react"

export const mockToolsData = [
  {
    id: "1",
    title: "Figma",
    description: "Collaborative interface design tool with real-time collaboration, prototyping, and design systems",
    url: "https://figma.com",
    author: "Sarah Chen",
    votes: 45,
    categories: ["Design", "Collaboration"],
    status: "approved",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Stripe",
    description: "Payment processing platform for online businesses with APIs for subscriptions, invoicing, and more",
    url: "https://stripe.com",
    author: "Marcus Johnson",
    votes: 42,
    categories: ["Finance", "API"],
    status: "approved",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "Vercel",
    description: "Platform for frontend developers with instant deployments, serverless functions, and edge network",
    url: "https://vercel.com",
    author: "Emma Rodriguez",
    votes: 38,
    categories: ["Hosting", "Development"],
    status: "approved",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    title: "Supabase",
    description:
      "Open source Firebase alternative with PostgreSQL database, authentication, and real-time subscriptions",
    url: "https://supabase.com",
    author: "David Kim",
    votes: 35,
    categories: ["Database", "Backend"],
    status: "approved",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    title: "Notion",
    description: "All-in-one workspace for notes, docs, wikis, and project management with powerful databases",
    url: "https://notion.so",
    author: "Lisa Anderson",
    votes: 33,
    categories: ["Productivity", "Collaboration"],
    status: "approved",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapidly building custom user interfaces",
    url: "https://tailwindcss.com",
    author: "John Doe",
    votes: 0,
    categories: ["Design", "Development"],
    status: "pending",
    createdAt: new Date("2024-02-10"),
  },
]

const allCategories = [
  "Design",
  "Development",
  "Finance",
  "Productivity",
  "Marketing",
  "Database",
  "API",
  "Hosting",
  "Backend",
  "Collaboration",
]

type SortOption = "votes" | "recent" | "oldest"

export function ToolsBoard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("votes")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [votedTools, setVotedTools] = useState<Set<string>>(new Set())

  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [newToolTitle, setNewToolTitle] = useState("")
  const [newToolDescription, setNewToolDescription] = useState("")
  const [newToolUrl, setNewToolUrl] = useState("")
  const [newToolCategories, setNewToolCategories] = useState<string[]>([])

  const handleVote = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setVotedTools((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(toolId)) {
        newSet.delete(toolId)
      } else {
        newSet.add(toolId)
      }
      return newSet
    })
  }

  const handleSubmitTool = () => {
    console.log("[v0] New tool submitted:", {
      newToolTitle,
      newToolDescription,
      newToolUrl,
      newToolCategories,
      status: "pending",
    })
    // Reset form
    setNewToolTitle("")
    setNewToolDescription("")
    setNewToolUrl("")
    setNewToolCategories([])
    setIsFormExpanded(false)
  }

  const toggleCategory = (category: string) => {
    setNewToolCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  // Filter and sort tools
  const filteredTools = mockToolsData
    .filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "all" || tool.categories.includes(filterCategory)
      const isApproved = tool.status === "approved"
      return matchesSearch && matchesCategory && isApproved
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes
      if (sortBy === "recent") return b.createdAt.getTime() - a.createdAt.getTime()
      if (sortBy === "oldest") return a.createdAt.getTime() - b.createdAt.getTime()
      return 0
    })

  const renderToolCard = (tool: (typeof mockToolsData)[0]) => {
    const isVoted = votedTools.has(tool.id)
    const displayVotes = tool.votes + (isVoted ? 1 : 0)

    return (
      <Card
        key={tool.id}
        className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => router.push(`/tools/${tool.id}`)}
      >
        <div className="flex gap-4">
          {/* Vote Button */}
          <button
            onClick={(e) => handleVote(tool.id, e)}
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
              <h3 className="text-xl font-semibold">{tool.title}</h3>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-muted-foreground mb-3">{tool.description}</p>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              {tool.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>by {tool.author}</span>
              <span>•</span>
              <span>
                {tool.createdAt.toLocaleDateString("en-US", {
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
            placeholder="Search tools..."
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

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        {filteredTools.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No tools found. Try adjusting your filters or be the first to submit one!
            </p>
          </Card>
        )}

        <Card className="border-dashed border-2 bg-muted/30">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Add New Tool</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isFormExpanded ? "rotate-180" : ""}`} />
            </CardTitle>
          </CardHeader>
          {isFormExpanded && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter tool name..."
                  value={newToolTitle}
                  onChange={(e) => setNewToolTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the tool..."
                  value={newToolDescription}
                  onChange={(e) => setNewToolDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  placeholder="https://example.com"
                  value={newToolUrl}
                  onChange={(e) => setNewToolUrl(e.target.value)}
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={newToolCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      {newToolCategories.includes(category) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmitTool}
                disabled={!newToolTitle || !newToolDescription || !newToolUrl || newToolCategories.length === 0}
                className="w-full"
              >
                Submit Tool
              </Button>
            </CardContent>
          )}
        </Card>

        {filteredTools.map(renderToolCard)}
      </div>
    </div>
  )
}
