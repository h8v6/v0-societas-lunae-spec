"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  Send,
  ExternalLink,
  ThumbsUp,
  Pin,
  Smile,
  Flame,
  Lightbulb,
  CheckCircle2,
  Target,
  ArrowUp,
  MessageSquare,
  Plus,
  User,
  LinkIcon,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { episodesData } from "@/lib/episodes-data"
import { mockNews } from "@/lib/news-data"
import { mockIdeas } from "@/components/ideas-board"
import { mockToolsData } from "@/components/tools-board"

const mockChatMessages = [
  {
    id: "1",
    username: "Sarah Chen",
    message: "Great episode! Really helpful insights on validation",
    timestamp: new Date("2024-02-15T14:23:00"),
    upvotes: 5,
    reactions: [
      { icon: "thumbs-up", count: 3 },
      { icon: "flame", count: 2 },
    ],
    isPinned: false,
    upvotedBy: [],
  },
  {
    id: "2",
    username: "Marcus Johnson",
    message: "Can you share more about the tech stack you used?",
    timestamp: new Date("2024-02-15T14:25:00"),
    upvotes: 12,
    reactions: [{ icon: "lightbulb", count: 4 }],
    isPinned: true,
    upvotedBy: [],
  },
  {
    id: "3",
    username: "Emma Rodriguez",
    message: "The part about pricing was super valuable",
    timestamp: new Date("2024-02-15T14:28:00"),
    upvotes: 8,
    reactions: [
      { icon: "check-circle", count: 5 },
      { icon: "target", count: 2 },
    ],
    isPinned: false,
    upvotedBy: [],
  },
]

const mockSuggestedEpisode = {
  id: "s4",
  description:
    "Explore strategies for building and growing a micro SaaS from scratch. Topics include finding profitable niches, validating ideas quickly, choosing the right tech stack, and scaling to first customers. We'll discuss common pitfalls, pricing strategies, and how to compete with larger players.",
  referenceUrls: [
    "https://example.com/micro-saas-guide",
    "https://example.com/validation-framework",
    "https://example.com/pricing-strategies",
  ],
  author: "Alex Turner",
  votes: 24,
  status: "suggested",
  createdAt: new Date("2024-02-20"),
}

const mockTopics = [
  {
    id: "t1",
    title: "Finding Your Niche",
    description: "How to identify underserved markets and validate demand before building",
    author: "Sarah Chen",
    votes: 12,
    createdAt: new Date("2024-02-21"),
    isCovered: false,
    urls: [],
  },
  {
    id: "t2",
    title: "MVP Development Timeline",
    description: "Realistic timelines for building and launching your first version",
    author: "Marcus Johnson",
    votes: 8,
    createdAt: new Date("2024-02-22"),
    isCovered: true,
    urls: ["https://example.com/mvp-guide"],
  },
  {
    id: "t3",
    title: "Pricing Psychology",
    description: "How to price your micro SaaS for maximum conversion and retention",
    author: "Emma Rodriguez",
    votes: 15,
    createdAt: new Date("2024-02-23"),
    isCovered: false,
    urls: [],
  },
]

const mockEpisodeComments = [
  {
    id: "c1",
    author: "David Kim",
    content:
      "This would be incredibly valuable! I'm currently in the ideation phase and would love to hear real examples of successful micro SaaS validation.",
    createdAt: new Date("2024-02-21"),
  },
  {
    id: "c2",
    author: "Lisa Anderson",
    content:
      "Please include a segment on solo founder challenges vs having a co-founder. That's a big decision point for many of us.",
    createdAt: new Date("2024-02-22"),
  },
]

const reactionIcons = {
  "thumbs-up": ThumbsUp,
  flame: Flame,
  lightbulb: Lightbulb,
  "check-circle": CheckCircle2,
  target: Target,
  heart: Heart,
}

const quickReactions = [
  { id: "thumbs-up", label: "Thumbs Up" },
  { id: "flame", label: "Fire" },
  { id: "lightbulb", label: "Idea" },
  { id: "check-circle", label: "Perfect" },
  { id: "target", label: "On Point" },
  { id: "heart", label: "Love" },
]

// Assuming Episode type is defined elsewhere, like in "@/lib/episodes-data"
// interface Episode {
//   id: string;
//   title: string;
//   description: string;
//   status: "suggested" | "completed" | "planned";
//   isLiveStream?: boolean;
//   streamStatus?: "scheduled" | "live" | "finished" | "completed";
//   youtubeUrl?: string;
//   xUrl?: string;
//   googleMeetUrl?: string;
//   scheduledDate?: Date;
//   date: Date;
//   duration?: string;
//   host?: string;
//   likes?: number;
//   votes?: number;
//   urls?: string[];
// }

export function EpisodeDetail({ episodeId }: { episodeId: string }) {
  const { user } = useAuth()
  const episode = episodesData.find((ep) => ep.id === episodeId)
  const [isLiked, setIsLiked] = useState(false)
  const [topics, setTopics] = useState(mockTopics)
  const [votedTopics, setVotedTopics] = useState<Set<string>>(new Set())
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTopicDescription, setNewTopicDescription] = useState("")
  const [newTopicUrls, setNewTopicUrls] = useState<string[]>([""])
  const [episodeComments, setEpisodeComments] = useState(mockEpisodeComments)
  const [newEpisodeComment, setNewEpisodeComment] = useState("")
  const [chatMessages, setChatMessages] = useState(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // state for Ideas modal
  const [showLinkIdeas, setShowLinkIdeas] = useState(false)
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(new Set())
  const [linkedIdeaIds, setLinkedIdeaIds] = useState<Set<string>>(new Set())
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState("all")
  const [ideaSearchQuery, setIdeaSearchQuery] = useState("") // Added search state for ideas modal

  // state for Tools modal
  const [showLinkTools, setShowLinkTools] = useState(false)
  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(new Set())
  const [linkedToolIds, setLinkedToolIds] = useState<Set<string>>(new Set())
  const [toolCategoryFilter, setToolCategoryFilter] = useState("all")
  const [toolSearchQuery, setToolSearchQuery] = useState("") // Added search state for tools modal

  const [showLinkNews, setShowLinkNews] = useState(false)
  const [selectedNewsIds, setSelectedNewsIds] = useState<Set<string>>(new Set())
  const [linkedNewsIds, setLinkedNewsIds] = useState<Set<string>>(new Set())
  const [newsTimeFilter, setNewsTimeFilter] = useState<"today" | "week" | "month">("week")
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("all")
  const [newsSearchQuery, setNewsSearchQuery] = useState("") // Added search state for news modal
  const [streamStatus, setStreamStatus] = useState(episode?.streamStatus || "scheduled")
  const [youtubeUrl, setYoutubeUrl] = useState(episode?.youtubeUrl || "")
  const [xUrl, setXUrl] = useState(episode?.xUrl || "")
  const [googleMeetUrl, setGoogleMeetUrl] = useState(episode?.googleMeetUrl || "")
  const [showStreamUrlInput, setShowStreamUrlInput] = useState(false)
  const [scheduledDate, setScheduledDate] = useState(
    episode?.scheduledDate ? episode.scheduledDate.toISOString().slice(0, 16) : "",
  )
  const [showScheduleInput, setShowScheduleInput] = useState(false)

  const isSuggested = episode?.status === "suggested"
  const isCompleted = episode?.status === "completed"
  const isLiveStream = episode?.isLiveStream || false
  const displayLikes = (isSuggested ? episode?.votes : episode?.likes) + (isLiked ? 1 : 0)
  const isAdmin = user?.role === "admin" || user?.role === "moderator"

  const pinnedMessages = chatMessages.filter((msg) => msg.isPinned)
  const regularMessages = chatMessages.filter((msg) => !msg.isPinned)

  const showChat = isLiveStream && (streamStatus === "live" || isCompleted)

  const handleOpenLinkIdeas = () => {
    console.log("[v0] Link Idea button clicked")
    console.log("[v0] mockIdeas:", mockIdeas)
    setShowLinkIdeas(true)
  }

  const handleOpenLinkTools = () => {
    console.log("[v0] Link Tool button clicked")
    console.log("[v0] mockToolsData:", mockToolsData)
    setShowLinkTools(true)
  }

  const handleOpenLinkNews = () => {
    console.log("[v0] Link News button clicked")
    console.log("[v0] mockNews:", mockNews)
    setShowLinkNews(true)
  }

  const handleTopicVote = (topicId: string) => {
    setVotedTopics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  const handleAddTopicUrl = () => {
    setNewTopicUrls([...newTopicUrls, ""])
  }

  const handleRemoveTopicUrl = (index: number) => {
    setNewTopicUrls(newTopicUrls.filter((_, i) => i !== index))
  }

  const handleTopicUrlChange = (index: number, value: string) => {
    const updated = [...newTopicUrls]
    updated[index] = value
    setNewTopicUrls(updated)
  }

  const handleSubmitTopic = () => {
    if (newTopicTitle.trim() && newTopicDescription.trim()) {
      const topic = {
        id: `t${topics.length + 1}`,
        title: newTopicTitle,
        description: newTopicDescription,
        author: user?.username || "You",
        votes: 0,
        createdAt: new Date(),
        isCovered: false,
        urls: newTopicUrls.filter((url) => url.trim() !== ""),
      }
      setTopics([...topics, topic])
      setNewTopicTitle("")
      setNewTopicDescription("")
      setNewTopicUrls([""])
      setShowAddTopic(false)
    }
  }

  const handleToggleCovered = (topicId: string) => {
    setTopics((prev) => prev.map((topic) => (topic.id === topicId ? { ...topic, isCovered: !topic.isCovered } : topic)))
  }

  const handleSubmitEpisodeComment = () => {
    if (newEpisodeComment.trim()) {
      const comment = {
        id: `c${episodeComments.length + 1}`,
        author: user?.username || "You",
        content: newEpisodeComment,
        createdAt: new Date(),
      }
      setEpisodeComments([...episodeComments, comment])
      setNewEpisodeComment("")
    }
  }

  const openChatWindow = () => {
    const width = 400
    const height = 600
    const left = window.screen.width - width - 20
    const top = 100
    window.open(
      `/episodes/${episodeId}/chat`,
      "Episode Chat",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message = {
      id: Date.now().toString(),
      username: user.username,
      message: newMessage,
      timestamp: new Date(),
      upvotes: 0,
      reactions: [],
      isPinned: false,
      upvotedBy: [],
    }

    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handlePin = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isPinned: !msg.isPinned,
          }
        }
        return msg
      }),
    )
  }

  const handleReaction = (messageId: string, iconId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.icon === iconId)
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) => (r.icon === iconId ? { ...r, count: r.count + 1 } : r)),
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { icon: iconId, count: 1 }],
            }
          }
        }
        return msg
      }),
    )
  }

  const handleUpvote = (messageId: string) => {
    if (!user) return

    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const alreadyUpvoted = msg.upvotedBy.includes(user.id)
          return {
            ...msg,
            upvotes: alreadyUpvoted ? msg.upvotes : msg.upvotes + 1,
            upvotedBy: alreadyUpvoted ? msg.upvotedBy : [...msg.upvotedBy, user.id],
          }
        }
        return msg
      }),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Ideas filtering and linking functions
  const getFilteredIdeas = () => {
    return mockIdeas.filter((idea) => {
      const matchesCategory = ideaCategoryFilter === "all" || idea.category === ideaCategoryFilter
      const matchesSearch =
        ideaSearchQuery === "" ||
        idea.title.toLowerCase().includes(ideaSearchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(ideaSearchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }

  const handleLinkIdeas = () => {
    const ideasToLink = mockIdeas.filter((idea) => selectedIdeaIds.has(idea.id) && !linkedIdeaIds.has(idea.id))

    const newTopics = ideasToLink.map((idea) => ({
      id: `t-idea-${idea.id}`,
      title: idea.title,
      description: idea.description,
      author: "Linked from Ideas",
      votes: idea.votes,
      createdAt: new Date(),
      linkedIdeaId: idea.id,
      isCovered: false,
      urls: [],
    }))

    setTopics([...topics, ...newTopics])
    setLinkedIdeaIds((prev) => new Set([...prev, ...ideasToLink.map((i) => i.id)]))
    setSelectedIdeaIds(new Set())
    setShowLinkIdeas(false)
  }

  const handleToggleIdeaSelection = (ideaId: string) => {
    setSelectedIdeaIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId)
      } else {
        newSet.add(ideaId)
      }
      return newSet
    })
  }

  const handleToggleAllIdeas = () => {
    const filteredIdeas = getFilteredIdeas()
    const allSelected = filteredIdeas.every((idea) => selectedIdeaIds.has(idea.id) || linkedIdeaIds.has(idea.id))

    if (allSelected) {
      setSelectedIdeaIds(new Set())
    } else {
      const newSelected = new Set(selectedIdeaIds)
      filteredIdeas.forEach((idea) => {
        if (!linkedIdeaIds.has(idea.id)) {
          newSelected.add(idea.id)
        }
      })
      setSelectedIdeaIds(newSelected)
    }
  }

  // Tools filtering and linking functions
  const getFilteredTools = () => {
    return mockToolsData.filter((tool) => {
      const matchesCategory = toolCategoryFilter === "all" || tool.categories.includes(toolCategoryFilter)
      const matchesSearch =
        toolSearchQuery === "" ||
        tool.title.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }

  const handleLinkTools = () => {
    const toolsToLink = mockToolsData.filter((tool) => selectedToolIds.has(tool.id) && !linkedToolIds.has(tool.id))

    const newTopics = toolsToLink.map((tool) => ({
      id: `t-tool-${tool.id}`,
      title: tool.title,
      description: tool.description,
      author: "Linked from Tools",
      votes: tool.votes,
      createdAt: new Date(),
      linkedToolId: tool.id,
      isCovered: false,
      urls: [tool.url],
    }))

    setTopics([...topics, ...newTopics])
    setLinkedToolIds((prev) => new Set([...prev, ...toolsToLink.map((t) => t.id)]))
    setSelectedToolIds(new Set())
    setShowLinkTools(false)
  }

  const handleToggleToolSelection = (toolId: string) => {
    setSelectedToolIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(toolId)) {
        newSet.delete(toolId)
      } else {
        newSet.add(toolId)
      }
      return newSet
    })
  }

  const handleToggleAllTools = () => {
    const filteredTools = getFilteredTools()
    const allSelected = filteredTools.every((tool) => selectedToolIds.has(tool.id) || linkedToolIds.has(tool.id))

    if (allSelected) {
      setSelectedToolIds(new Set())
    } else {
      const newSelected = new Set(selectedToolIds)
      filteredTools.forEach((tool) => {
        if (!linkedToolIds.has(tool.id)) {
          newSelected.add(tool.id)
        }
      })
      setSelectedToolIds(newSelected)
    }
  }

  const handleLinkNews = () => {
    const newsToLink = mockNews.filter((news) => selectedNewsIds.has(news.id) && !linkedNewsIds.has(news.id))

    const newTopics = newsToLink.map((news) => ({
      id: `t-news-${news.id}`,
      title: news.title,
      description: news.description,
      author: "Linked from News",
      votes: news.votes,
      createdAt: new Date(),
      linkedNewsId: news.id,
      isCovered: false,
      urls: news.references.map((ref) => ref.url),
    }))

    setTopics([...topics, ...newTopics])
    setLinkedNewsIds((prev) => new Set([...prev, ...newTopics.map((n) => n.id)]))
    setSelectedNewsIds(new Set())
    setShowLinkNews(false)
  }

  const handleToggleNewsSelection = (newsId: string) => {
    setSelectedNewsIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(newsId)) {
        newSet.delete(newsId)
      } else {
        newSet.add(newsId)
      }
      return newSet
    })
  }

  const handleToggleAllNews = () => {
    const filteredNews = getFilteredNews()
    const allSelected = filteredNews.every((news) => selectedNewsIds.has(news.id) || linkedNewsIds.has(news.id))

    if (allSelected) {
      // Deselect all
      setSelectedNewsIds(new Set())
    } else {
      // Select all that aren't already linked
      const selectableIds = filteredNews.filter((news) => !linkedNewsIds.has(news.id)).map((news) => news.id)
      setSelectedNewsIds(new Set(selectableIds))
    }
  }

  const getFilteredNews = () => {
    let filtered = mockNews.filter((news) => news.status === "approved")

    if (newsCategoryFilter !== "all") {
      filtered = filtered.filter((news) => news.category === newsCategoryFilter)
    }

    // Added search filtering
    if (newsSearchQuery !== "") {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
          news.description.toLowerCase().includes(newsSearchQuery.toLowerCase()),
      )
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (newsTimeFilter === "today") {
      filtered = filtered.filter((news) => {
        const newsDate = new Date(news.createdAt)
        const newsDay = new Date(newsDate.getFullYear(), newsDate.getMonth(), newsDate.getDate())
        return newsDay.getTime() === today.getTime()
      })
    } else if (newsTimeFilter === "week") {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      filtered = filtered.filter((news) => new Date(news.createdAt) >= weekAgo)
    } else if (newsTimeFilter === "month") {
      const monthAgo = new Date(today)
      monthAgo.setDate(monthAgo.getDate() - 30)
      filtered = filtered.filter((news) => new Date(news.createdAt) >= monthAgo)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const handleStartStream = () => {
    if (!youtubeUrl.trim() && streamStatus === "scheduled") {
      setShowStreamUrlInput(true)
      return
    }
    setStreamStatus("live")
    setShowStreamUrlInput(false)
  }

  const handleEndStream = () => {
    setStreamStatus("finished")
  }

  const handleMarkCompleted = () => {
    setStreamStatus("completed")
  }

  const handleSchedule = () => {
    if (scheduledDate) {
      console.log("[v0] Episode scheduled for:", scheduledDate)
      setShowScheduleInput(false)
    }
  }

  useEffect(() => {
    if (!isSuggested) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, isSuggested])

  if (!episode) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Episodes
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Episode not found</p>
        </Card>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Episodes
        </Link>

        <div className="space-y-6">
          <div className="relative w-full h-64 bg-muted border border-border"></div>

          {/* Completed Episode Header */}
          <Card className="p-6">
            <div className="flex gap-6">
              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] border-2 transition-colors ${
                  isLiked
                    ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                    : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                }`}
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-lg font-bold">{displayLikes}</span>
              </button>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl font-bold">{episode.title}</h1>
                  <Badge className="bg-[var(--status-complete)] text-white">{episode.status}</Badge>
                </div>

                <p className="text-lg text-foreground leading-relaxed mb-4">{episode.description}</p>

                {(episode.youtubeUrl || episode.xUrl) && (
                  <div className="mb-4 space-y-2">
                    {episode.youtubeUrl && (
                      <a
                        href={episode.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch on YouTube
                      </a>
                    )}
                    {episode.xUrl && (
                      <a
                        href={episode.xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-semibold ml-4"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch on X
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Hosted by {episode.host || "Community"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {episode.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {episode.duration && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{episode.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Topics Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Topics Covered ({topics.length})</h2>
              </div>
              {user && (
                <Button onClick={() => setShowAddTopic(!showAddTopic)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Suggest Topic
                </Button>
              )}
            </div>

            {/* Add Topic Form */}
            {showAddTopic && (
              <div className="mb-6 p-4 border border-border bg-card/50">
                <Input
                  placeholder="Topic title..."
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="mb-3"
                />
                <Textarea
                  placeholder="Describe what was covered..."
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="mb-3 min-h-[80px]"
                />

                <div className="mb-3 space-y-2">
                  <label className="text-sm font-medium">Reference URLs (optional)</label>
                  {newTopicUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com/resource"
                        value={url}
                        onChange={(e) => handleTopicUrlChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {newTopicUrls.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveTopicUrl(index)} className="px-3">
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddTopicUrl} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitTopic} disabled={!newTopicTitle.trim() || !newTopicDescription.trim()}>
                    Submit Topic
                  </Button>
                  <Button variant="ghost" onClick={() => setShowAddTopic(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Topics List */}
            <div className="space-y-3">
              {topics.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No topics yet. Be the first to suggest one!</p>
              ) : (
                [...topics]
                  .sort((a, b) => {
                    const aVotes = a.votes + (votedTopics.has(a.id) ? 1 : 0)
                    const bVotes = b.votes + (votedTopics.has(b.id) ? 1 : 0)
                    return bVotes - aVotes
                  })
                  .map((topic) => {
                    const isTopicVoted = votedTopics.has(topic.id)
                    const displayTopicVotes = topic.votes + (isTopicVoted ? 1 : 0)

                    return (
                      <div
                        key={topic.id}
                        className={`flex gap-4 p-4 border transition-colors ${
                          topic.isCovered
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {/* Vote Button */}
                        <button
                          onClick={() => handleTopicVote(topic.id)}
                          className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] border-2 transition-colors ${
                            isTopicVoted
                              ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                              : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                          }`}
                        >
                          <ArrowUp className="h-4 w-4" />
                          <span className="text-sm font-bold">{displayTopicVotes}</span>
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3
                              className={`font-semibold ${topic.isCovered ? "line-through text-muted-foreground" : ""}`}
                            >
                              {topic.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {topic.isCovered && (
                                <Badge className="bg-green-500 text-white flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Covered
                                </Badge>
                              )}
                              {isAdmin && (
                                <button
                                  onClick={() => handleToggleCovered(topic.id)}
                                  className="text-xs px-2 py-1 border border-border hover:bg-muted transition-colors"
                                  title={topic.isCovered ? "Mark as not covered" : "Mark as covered"}
                                >
                                  {topic.isCovered ? "Unmark" : "Mark Covered"}
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>

                          {topic.urls && topic.urls.length > 0 && (
                            <div className="mb-2 space-y-1">
                              {topic.urls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  {url}
                                </a>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>by {topic.author}</span>
                            <span>•</span>
                            <span>
                              {topic.createdAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Comments ({episodeComments.length})</h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts on this episode..."
                  value={newEpisodeComment}
                  onChange={(e) => setNewEpisodeComment(e.target.value)}
                  className="mb-3 min-h-[100px]"
                />
                <Button onClick={handleSubmitEpisodeComment} disabled={!newEpisodeComment.trim()}>
                  Post Comment
                </Button>
              </div>
            ) : (
              <div className="mb-6 text-center py-4 text-muted-foreground">
                <Link href="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to comment
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {episodeComments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                episodeComments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-border pl-4 py-2">
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
                ))
              )}
            </div>
          </Card>

          {/* Archived Chat Section */}
          {showChat && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Archived Chat</h2>
                  <Badge className="bg-muted text-muted-foreground">Read Only</Badge>
                </div>
              </div>

              {pinnedMessages.length > 0 && (
                <div className="mb-4 space-y-3 border border-border p-4 bg-muted/30">
                  {pinnedMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2 bg-background/50 p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <Pin className="h-3 w-3 text-primary" />
                          <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed">{msg.message}</p>
                      {/* Display reactions */}
                      {msg.reactions.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {msg.reactions.map((reaction, idx) => {
                            const IconComponent = reactionIcons[reaction.icon as keyof typeof reactionIcons]
                            return (
                              <div
                                key={idx}
                                className="text-sm px-2 py-1 bg-muted border border-border flex items-center gap-1.5"
                              >
                                {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                                <span className="text-xs text-muted-foreground">{reaction.count}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto border border-border p-4 bg-muted/20">
                {regularMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {msg.timestamp.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed">{msg.message}</p>

                    {/* Display reactions and upvotes (read-only) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.reactions.map((reaction, idx) => {
                        const IconComponent = reactionIcons[reaction.icon as keyof typeof reactionIcons]
                        return (
                          <div
                            key={idx}
                            className="text-sm px-2 py-1 bg-muted border border-border flex items-center gap-1.5"
                          >
                            {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                            <span className="text-xs text-muted-foreground">{reaction.count}</span>
                          </div>
                        )
                      })}
                      {msg.upvotes > 0 && (
                        <div className="text-sm px-2 py-1 bg-muted border border-border flex items-center gap-1.5">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span className="text-xs text-muted-foreground">{msg.upvotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center py-2 text-sm text-muted-foreground">
                This chat is archived and read-only
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (isSuggested) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Episodes
        </Link>

        <div className="space-y-6">
          {/* Suggested Episode Header */}
          <Card className="p-6">
            <div className="flex gap-6">
              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] border-2 transition-colors ${
                  isLiked
                    ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                    : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                }`}
              >
                <ArrowUp className="h-6 w-6" />
                <span className="text-lg font-bold">{displayLikes}</span>
              </button>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl font-bold">{episode.title}</h1>
                  <div className="flex gap-2">
                    <Badge className="bg-[var(--status-planned)] text-white">{episode.status}</Badge>
                    {isAdmin && isLiveStream && scheduledDate && (
                      <Badge className="bg-yellow-500 text-white">Scheduled</Badge>
                    )}
                    {isAdmin && isLiveStream && (
                      <>
                        {streamStatus === "live" && (
                          <Badge className="bg-red-500 text-white animate-pulse">● LIVE</Badge>
                        )}
                        {streamStatus === "finished" && <Badge className="bg-gray-500 text-white">Finished</Badge>}
                        {streamStatus === "completed" && <Badge className="bg-green-600 text-white">Completed</Badge>}
                      </>
                    )}
                  </div>
                </div>

                {isAdmin && isLiveStream && scheduledDate && (
                  <div className="mb-3 text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Scheduled for:{" "}
                      {new Date(scheduledDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(scheduledDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                <p className="text-lg text-foreground leading-relaxed mb-4">{episode.description}</p>

                {(youtubeUrl ||
                  xUrl ||
                  (googleMeetUrl && streamStatus !== "finished" && streamStatus !== "completed")) && (
                  <div className="mb-4 space-y-2">
                    {youtubeUrl && (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline font-semibold"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch on YouTube
                      </a>
                    )}
                    {xUrl && (
                      <a
                        href={xUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline font-semibold"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Follow on X
                      </a>
                    )}
                    {googleMeetUrl && streamStatus !== "finished" && streamStatus !== "completed" && (
                      <a
                        href={googleMeetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:underline font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Join Google Meet
                      </a>
                    )}
                  </div>
                )}

                {episode.urls && episode.urls.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Reference URLs:</h3>
                    <div className="space-y-1">
                      {episode.urls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>by {episode.host || "Community"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {episode.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stream Controls */}
          {isAdmin && isLiveStream && (
            <Card className="p-4 bg-muted/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Stream Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      {streamStatus === "scheduled" && !scheduledDate && "Schedule the episode and provide stream URL."}
                      {streamStatus === "scheduled" &&
                        scheduledDate &&
                        "Episode is scheduled. Provide stream URL and start when ready."}
                      {streamStatus === "live" && "Stream is live! Users can see the chat."}
                      {streamStatus === "finished" && "Stream has finished. Mark as completed when ready."}
                      {streamStatus === "completed" && "Stream is completed and archived."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {streamStatus === "scheduled" && (
                      <>
                        <Button onClick={() => setShowScheduleInput(!showScheduleInput)} variant="outline">
                          {scheduledDate ? "Reschedule" : "Schedule"}
                        </Button>
                        <Button onClick={handleStartStream} className="bg-red-500 hover:bg-red-600">
                          Start Stream
                        </Button>
                      </>
                    )}
                    {streamStatus === "live" && (
                      <Button onClick={handleEndStream} variant="destructive">
                        End Stream
                      </Button>
                    )}
                    {streamStatus === "finished" && (
                      <Button onClick={handleMarkCompleted} className="bg-green-600 hover:bg-green-700">
                        Mark as Completed
                      </Button>
                    )}
                    {streamStatus === "completed" && (
                      <Button onClick={() => setStreamStatus("scheduled")} variant="outline">
                        Reset to Scheduled
                      </Button>
                    )}
                  </div>
                </div>

                {showScheduleInput && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Schedule Date & Time</label>
                    <div className="flex gap-2">
                      <Input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSchedule} disabled={!scheduledDate}>
                        Save Schedule
                      </Button>
                      <Button variant="outline" onClick={() => setShowScheduleInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {(streamStatus === "scheduled" || showStreamUrlInput) && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        YouTube URL <span className="text-red-500">*</span> (required to start)
                      </label>
                      <Input
                        placeholder="https://youtube.com/live/..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">X.com URL (optional)</label>
                      <Input
                        placeholder="https://x.com/..."
                        value={xUrl}
                        onChange={(e) => setXUrl(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Google Meet URL (optional)</label>
                      <Input
                        placeholder="https://meet.google.com/..."
                        value={googleMeetUrl}
                        onChange={(e) => setGoogleMeetUrl(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    {showStreamUrlInput && (
                      <Button variant="outline" onClick={() => setShowStreamUrlInput(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                )}

                {(streamStatus === "live" || streamStatus === "finished") && (
                  <div className="space-y-2 text-sm">
                    {youtubeUrl && (
                      <div>
                        <span className="text-muted-foreground">YouTube: </span>
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {youtubeUrl}
                        </a>
                      </div>
                    )}
                    {xUrl && (
                      <div>
                        <span className="text-muted-foreground">X.com: </span>
                        <a
                          href={xUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {xUrl}
                        </a>
                      </div>
                    )}
                    {googleMeetUrl && streamStatus !== "completed" && (
                      <div>
                        <span className="text-muted-foreground">Google Meet: </span>
                        <a
                          href={googleMeetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {googleMeetUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {streamStatus === "completed" && (
                  <div className="space-y-2 text-sm">
                    {youtubeUrl && (
                      <div>
                        <span className="text-muted-foreground">YouTube: </span>
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {youtubeUrl}
                        </a>
                      </div>
                    )}
                    {xUrl && (
                      <div>
                        <span className="text-muted-foreground">X.com: </span>
                        <a
                          href={xUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {xUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Topics Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Topics to Cover ({topics.length})</h2>
              </div>
              <div className="flex gap-2">
                {isAdmin && !isCompleted && (
                  <>
                    <Button onClick={handleOpenLinkIdeas} size="sm" variant="outline">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link Idea
                    </Button>
                    <Button onClick={handleOpenLinkTools} size="sm" variant="outline">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link Tool
                    </Button>
                    <Button onClick={handleOpenLinkNews} size="sm" variant="outline">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link News
                    </Button>
                  </>
                )}
                {user && !isCompleted && (
                  <Button onClick={() => setShowAddTopic(!showAddTopic)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Suggest Topic
                  </Button>
                )}
              </div>
            </div>

            {/* Add Topic Form */}
            {showAddTopic && (
              <div className="mb-6 p-4 border border-border bg-card/50">
                <Input
                  placeholder="Topic title..."
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="mb-3"
                />
                <Textarea
                  placeholder="Describe what should be covered..."
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="mb-3 min-h-[80px]"
                />

                <div className="mb-3 space-y-2">
                  <label className="text-sm font-medium">Reference URLs (optional)</label>
                  {newTopicUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com/resource"
                        value={url}
                        onChange={(e) => handleTopicUrlChange(index, e.target.value)}
                        className="flex-1"
                      />
                      {newTopicUrls.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveTopicUrl(index)} className="px-3">
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddTopicUrl} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitTopic} disabled={!newTopicTitle.trim() || !newTopicDescription.trim()}>
                    Submit Topic
                  </Button>
                  <Button variant="ghost" onClick={() => setShowAddTopic(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Topics List */}
            <div className="space-y-3">
              {topics.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No topics yet. Be the first to suggest one!</p>
              ) : (
                [...topics]
                  .sort((a, b) => {
                    const aVotes = a.votes + (votedTopics.has(a.id) ? 1 : 0)
                    const bVotes = b.votes + (votedTopics.has(b.id) ? 1 : 0)
                    return bVotes - aVotes
                  })
                  .map((topic) => {
                    const isTopicVoted = votedTopics.has(topic.id)
                    const displayTopicVotes = topic.votes + (isTopicVoted ? 1 : 0)

                    return (
                      <div
                        key={topic.id}
                        className={`flex gap-4 p-4 border transition-colors ${
                          topic.isCovered
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {/* Vote Button */}
                        <button
                          onClick={() => handleTopicVote(topic.id)}
                          className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] border-2 transition-colors ${
                            isTopicVoted
                              ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                              : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                          }`}
                        >
                          <ArrowUp className="h-4 w-4" />
                          <span className="text-sm font-bold">{displayTopicVotes}</span>
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3
                              className={`font-semibold ${topic.isCovered ? "line-through text-muted-foreground" : ""}`}
                            >
                              {topic.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {topic.isCovered && (
                                <Badge className="bg-green-500 text-white flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Covered
                                </Badge>
                              )}
                              {isAdmin && (
                                <button
                                  onClick={() => handleToggleCovered(topic.id)}
                                  className="text-xs px-2 py-1 border border-border hover:bg-muted transition-colors"
                                  title={topic.isCovered ? "Mark as not covered" : "Mark as covered"}
                                >
                                  {topic.isCovered ? "Unmark" : "Mark Covered"}
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>

                          {topic.urls && topic.urls.length > 0 && (
                            <div className="mb-2 space-y-1">
                              {topic.urls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  {url}
                                </a>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>by {topic.author}</span>
                            <span>•</span>
                            <span>
                              {topic.createdAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Comments ({episodeComments.length})</h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts on this episode suggestion..."
                  value={newEpisodeComment}
                  onChange={(e) => setNewEpisodeComment(e.target.value)}
                  className="mb-3 min-h-[100px]"
                />
                <Button onClick={handleSubmitEpisodeComment} disabled={!newEpisodeComment.trim()}>
                  Post Comment
                </Button>
              </div>
            ) : (
              <div className="mb-6 text-center py-4 text-muted-foreground">
                <Link href="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to comment
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {episodeComments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                episodeComments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-border pl-4 py-2">
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
                ))
              )}
            </div>
          </Card>

          {/* Chat Section */}
          {showChat && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Live Chat</h2>
                  {streamStatus === "live" && <Badge className="bg-red-500 text-white">● LIVE</Badge>}
                  {isAdmin && streamStatus !== "live" && (
                    <Badge className="bg-muted text-muted-foreground">Admin Preview</Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={openChatWindow}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new window
                </Button>
              </div>

              {pinnedMessages.length > 0 && (
                <div className="mb-4 space-y-3 border border-border p-4 bg-muted/30">
                  {pinnedMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2 bg-background/50 p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <Pin className="h-3 w-3 text-primary" />
                          <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {isAdmin && (
                          <Button variant="ghost" size="sm" onClick={() => handlePin(msg.id)} className="h-6 px-2">
                            Unpin
                          </Button>
                        )}
                      </div>
                      <p className="text-base leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto border border-border p-4 bg-muted/20">
                {regularMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {msg.timestamp.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed">{msg.message}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.reactions.map((reaction, idx) => {
                        const IconComponent = reactionIcons[reaction.icon as keyof typeof reactionIcons]
                        return (
                          <button
                            key={idx}
                            className="text-sm px-2 py-1 bg-muted hover:bg-muted/80 border border-border flex items-center gap-1.5"
                            onClick={() => handleReaction(msg.id, reaction.icon)}
                          >
                            {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                            <span className="text-xs text-muted-foreground">{reaction.count}</span>
                          </button>
                        )
                      })}

                      <div className="flex items-center gap-1">
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpvote(msg.id)}
                            className={`h-7 px-2 gap-1 ${msg.upvotedBy.includes(user.id) ? "text-primary" : ""}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">{msg.upvotes}</span>
                          </Button>
                        )}

                        {user && (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                              className="h-7 px-2"
                            >
                              <Smile className="h-3 w-3" />
                            </Button>
                            {showReactions === msg.id && (
                              <div className="absolute bottom-full mb-1 left-0 bg-background border border-border p-2 flex gap-1 shadow-lg z-10">
                                {quickReactions.map((reaction) => {
                                  const IconComponent = reactionIcons[reaction.id as keyof typeof reactionIcons]
                                  return (
                                    <button
                                      key={reaction.id}
                                      onClick={() => {
                                        handleReaction(msg.id, reaction.id)
                                        setShowReactions(null)
                                      }}
                                      className="p-1.5 hover:bg-muted transition-colors"
                                      title={reaction.label}
                                    >
                                      {IconComponent && <IconComponent className="h-4 w-4" />}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePin(msg.id)}
                            className="h-7 px-2 text-primary"
                            title="Pin message"
                          >
                            <Pin className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {user ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Link href="/auth" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to join the chat
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Link News Dialog */}
        <Dialog open={showLinkNews} onOpenChange={setShowLinkNews}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Link News to Episode</DialogTitle>
              <DialogDescription>
                Select news items to add as topics for this episode. You can select multiple items.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news by title or description..."
                  value={newsSearchQuery}
                  onChange={(e) => setNewsSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="text-sm text-muted-foreground">
                  {selectedNewsIds.size} of {getFilteredNews().filter((n) => !linkedNewsIds.has(n.id)).length} selected
                </div>
                <div className="flex items-center gap-2">
                  <Select value={newsCategoryFilter} onValueChange={setNewsCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="AI Research">AI Research</SelectItem>
                      <SelectItem value="AI Ethics">AI Ethics</SelectItem>
                      <SelectItem value="AI Society">AI Society</SelectItem>
                      <SelectItem value="AI Technology">AI Technology</SelectItem>
                      <SelectItem value="AI Policy">AI Policy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={newsTimeFilter}
                    onValueChange={(value: "today" | "week" | "month") => setNewsTimeFilter(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={handleToggleAllNews} className="shrink-0">
                    {getFilteredNews().every((news) => selectedNewsIds.has(news.id) || linkedNewsIds.has(news.id))
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>

              {/* News List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {getFilteredNews().length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No news items found for the selected filters.
                  </p>
                ) : (
                  getFilteredNews().map((news) => {
                    const isLinked = linkedNewsIds.has(news.id)
                    const isSelected = selectedNewsIds.has(news.id)

                    return (
                      <div
                        key={news.id}
                        className={`flex items-start gap-3 p-4 border transition-colors ${
                          isLinked
                            ? "border-green-500/50 bg-green-500/5 opacity-60"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          id={`news-${news.id}`}
                          checked={isSelected}
                          disabled={isLinked}
                          onCheckedChange={() => handleToggleNewsSelection(news.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Label
                              htmlFor={`news-${news.id}`}
                              className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                            >
                              {news.title}
                            </Label>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {news.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{news.votes} votes</span>
                            <span>•</span>
                            <span>
                              {new Date(news.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            {news.references.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{news.references.length} references</span>
                              </>
                            )}
                          </div>
                          {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowLinkNews(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkNews} disabled={selectedNewsIds.size === 0}>
                  Add {selectedNewsIds.size} News {selectedNewsIds.size === 1 ? "Item" : "Items"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link Ideas Dialog */}
        <Dialog open={showLinkIdeas} onOpenChange={setShowLinkIdeas}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Link Ideas to Episode</DialogTitle>
              <DialogDescription>
                Select ideas to add as topics for this episode. You can select multiple items.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas by title or description..."
                  value={ideaSearchQuery}
                  onChange={(e) => setIdeaSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="text-sm text-muted-foreground">
                  {selectedIdeaIds.size} of {getFilteredIdeas().filter((i) => !linkedIdeaIds.has(i.id)).length} selected
                </div>
                <div className="flex items-center gap-2">
                  <Select value={ideaCategoryFilter} onValueChange={setIdeaCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={handleToggleAllIdeas} className="shrink-0">
                    {getFilteredIdeas().every((idea) => selectedIdeaIds.has(idea.id) || linkedIdeaIds.has(idea.id))
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>

              {/* Ideas List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {getFilteredIdeas().length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No ideas found for the selected category.</p>
                ) : (
                  getFilteredIdeas().map((idea) => {
                    const isLinked = linkedIdeaIds.has(idea.id)
                    const isSelected = selectedIdeaIds.has(idea.id)

                    return (
                      <div
                        key={idea.id}
                        className={`flex items-start gap-3 p-4 border transition-colors ${
                          isLinked
                            ? "border-green-500/50 bg-green-500/5 opacity-60"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          id={`idea-${idea.id}`}
                          checked={isSelected}
                          disabled={isLinked}
                          onCheckedChange={() => handleToggleIdeaSelection(idea.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={`idea-${idea.id}`}
                            className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                          >
                            {idea.title}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {idea.category}
                            </Badge>
                            <span>{idea.votes} votes</span>
                            <span>•</span>
                            <span>
                              {new Date(idea.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowLinkIdeas(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkIdeas} disabled={selectedIdeaIds.size === 0}>
                  Add {selectedIdeaIds.size} {selectedIdeaIds.size === 1 ? "Idea" : "Ideas"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link Tools Dialog */}
        <Dialog open={showLinkTools} onOpenChange={setShowLinkTools}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Link Tools to Episode</DialogTitle>
              <DialogDescription>
                Select tools to add as topics for this episode. You can select multiple items.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools by title or description..."
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="text-sm text-muted-foreground">
                  {selectedToolIds.size} of {getFilteredTools().filter((t) => !linkedToolIds.has(t.id)).length} selected
                </div>
                <div className="flex items-center gap-2">
                  <Select value={toolCategoryFilter} onValueChange={setToolCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                      <SelectItem value="Project Management">Project Management</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={handleToggleAllTools} className="shrink-0">
                    {getFilteredTools().every((tool) => selectedToolIds.has(tool.id) || linkedToolIds.has(tool.id))
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              </div>

              {/* Tools List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {getFilteredTools().length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tools found for the selected category.</p>
                ) : (
                  getFilteredTools().map((tool) => {
                    const isLinked = linkedToolIds.has(tool.id)
                    const isSelected = selectedToolIds.has(tool.id)

                    return (
                      <div
                        key={tool.id}
                        className={`flex items-start gap-3 p-4 border transition-colors ${
                          isLinked
                            ? "border-green-500/50 bg-green-500/5 opacity-60"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          id={`tool-${tool.id}`}
                          checked={isSelected}
                          disabled={isLinked}
                          onCheckedChange={() => handleToggleToolSelection(tool.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={`tool-${tool.id}`}
                            className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                          >
                            {tool.title}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {tool.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            {tool.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{tool.votes} votes</span>
                            <span>•</span>
                            <span>
                              {new Date(tool.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowLinkTools(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkTools} disabled={selectedToolIds.size === 0}>
                  Add {selectedToolIds.size} {selectedToolIds.size === 1 ? "Tool" : "Tools"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/episodes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Episodes
      </Link>

      <Card className="overflow-hidden mb-6">
        <div className="relative w-full h-64 bg-muted"></div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{episode.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {episode.date.toLocaleDateString("en-US", {
                      month: "long",
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
                <span>Hosted by {episode.host}</span>
              </div>
            </div>

            <button
              onClick={() => setIsLiked(!isLiked)}
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

          <div className="flex gap-2 mb-4">
            <Badge className="bg-[var(--status-complete)] text-white">{episode.status}</Badge>
            {isLiveStream && streamStatus === "live" && (
              <Badge className="bg-red-500 text-white animate-pulse">● LIVE</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{episode.description}</p>
        </div>
      </Card>

      {isAdmin && isLiveStream && (
        <Card className="p-4 bg-muted/50 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Stream Controls</h3>
              <p className="text-sm text-muted-foreground">
                {streamStatus === "scheduled" && "Stream is scheduled. Start when ready."}
                {streamStatus === "live" && "Stream is live! Users can see the chat."}
                {streamStatus === "ended" && "Stream has ended. Chat is archived."}
                {streamStatus === "finished" && "Stream has finished. Mark as completed when ready."}
                {streamStatus === "completed" && "Stream is completed and archived."}
              </p>
            </div>
            <div className="flex gap-2">
              {streamStatus === "scheduled" && (
                <Button onClick={handleStartStream} className="bg-red-500 hover:bg-red-600">
                  Start Stream
                </Button>
              )}
              {streamStatus === "live" && (
                <Button onClick={handleEndStream} variant="destructive">
                  End Stream
                </Button>
              )}
              {streamStatus === "finished" && (
                <Button onClick={handleMarkCompleted} className="bg-green-600 hover:bg-green-700">
                  Mark as Completed
                </Button>
              )}
              {streamStatus === "completed" && (
                <Button onClick={() => setStreamStatus("scheduled")} variant="outline">
                  Reset to Scheduled
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Chat Section */}
      {showChat && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Live Chat</h2>
              {streamStatus === "live" && <Badge className="bg-red-500 text-white">● LIVE</Badge>}
              {isAdmin && streamStatus !== "live" && (
                <Badge className="bg-muted text-muted-foreground">Admin Preview</Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={openChatWindow}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new window
            </Button>
          </div>

          {pinnedMessages.length > 0 && (
            <div className="mb-4 space-y-3 border border-border p-4 bg-muted/30">
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="space-y-2 bg-background/50 p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <Pin className="h-3 w-3 text-primary" />
                      <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => handlePin(msg.id)} className="h-6 px-2">
                        Unpin
                      </Button>
                    )}
                  </div>
                  <p className="text-base leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto border border-border p-4 bg-muted/20">
            {regularMessages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-xs text-muted-foreground">{msg.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {msg.timestamp.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-base leading-relaxed">{msg.message}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {msg.reactions.map((reaction, idx) => {
                    const IconComponent = reactionIcons[reaction.icon as keyof typeof reactionIcons]
                    return (
                      <button
                        key={idx}
                        className="text-sm px-2 py-1 bg-muted hover:bg-muted/80 border border-border flex items-center gap-1.5"
                        onClick={() => handleReaction(msg.id, reaction.icon)}
                      >
                        {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                        <span className="text-xs text-muted-foreground">{reaction.count}</span>
                      </button>
                    )
                  })}

                  <div className="flex items-center gap-1">
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(msg.id)}
                        className={`h-7 px-2 gap-1 ${msg.upvotedBy.includes(user.id) ? "text-primary" : ""}`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs">{msg.upvotes}</span>
                      </Button>
                    )}

                    {user && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                          className="h-7 px-2"
                        >
                          <Smile className="h-3 w-3" />
                        </Button>
                        {showReactions === msg.id && (
                          <div className="absolute bottom-full mb-1 left-0 bg-background border border-border p-2 flex gap-1 shadow-lg z-10">
                            {quickReactions.map((reaction) => {
                              const IconComponent = reactionIcons[reaction.id as keyof typeof reactionIcons]
                              return (
                                <button
                                  key={reaction.id}
                                  onClick={() => {
                                    handleReaction(msg.id, reaction.id)
                                    setShowReactions(null)
                                  }}
                                  className="p-1.5 hover:bg-muted transition-colors"
                                  title={reaction.label}
                                >
                                  {IconComponent && <IconComponent className="h-4 w-4" />}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePin(msg.id)}
                        className="h-7 px-2 text-primary"
                        title="Pin message"
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {user ? (
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Link href="/auth" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to join the chat
            </div>
          )}
        </Card>
      )}

      {/* Link News Dialog */}
      <Dialog open={showLinkNews} onOpenChange={setShowLinkNews}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link News to Episode</DialogTitle>
            <DialogDescription>
              Select news items to add as topics for this episode. You can select multiple items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news by title or description..."
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="text-sm text-muted-foreground">
                {selectedNewsIds.size} of {getFilteredNews().filter((n) => !linkedNewsIds.has(n.id)).length} selected
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={newsTimeFilter}
                  onValueChange={(value: "today" | "week" | "month") => setNewsTimeFilter(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={handleToggleAllNews} className="shrink-0">
                  {getFilteredNews().every((news) => selectedNewsIds.has(news.id) || linkedNewsIds.has(news.id))
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>

            {/* News List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {getFilteredNews().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No news items found for the selected date range.
                </p>
              ) : (
                getFilteredNews().map((news) => {
                  const isLinked = linkedNewsIds.has(news.id)
                  const isSelected = selectedNewsIds.has(news.id)

                  return (
                    <div
                      key={news.id}
                      className={`flex items-start gap-3 p-4 border transition-colors ${
                        isLinked
                          ? "border-green-500/50 bg-green-500/5 opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        id={`news-${news.id}`}
                        checked={isSelected}
                        disabled={isLinked}
                        onCheckedChange={() => handleToggleNewsSelection(news.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`news-${news.id}`}
                          className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                        >
                          {news.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{news.votes} votes</span>
                          <span>•</span>
                          <span>
                            {new Date(news.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {news.references.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{news.references.length} references</span>
                            </>
                          )}
                        </div>
                        {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowLinkNews(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkNews} disabled={selectedNewsIds.size === 0}>
                Add {selectedNewsIds.size} News {selectedNewsIds.size === 1 ? "Item" : "Items"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Ideas Dialog */}
      <Dialog open={showLinkIdeas} onOpenChange={setShowLinkIdeas}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link Ideas to Episode</DialogTitle>
            <DialogDescription>
              Select ideas to add as topics for this episode. You can select multiple items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas by title or description..."
                value={ideaSearchQuery}
                onChange={(e) => setIdeaSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="text-sm text-muted-foreground">
                {selectedIdeaIds.size} of {getFilteredIdeas().filter((i) => !linkedIdeaIds.has(i.id)).length} selected
              </div>
              <div className="flex items-center gap-2">
                <Select value={ideaCategoryFilter} onValueChange={setIdeaCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={handleToggleAllIdeas} className="shrink-0">
                  {getFilteredIdeas().every((idea) => selectedIdeaIds.has(idea.id) || linkedIdeaIds.has(idea.id))
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>

            {/* Ideas List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {getFilteredIdeas().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No ideas found for the selected category.</p>
              ) : (
                getFilteredIdeas().map((idea) => {
                  const isLinked = linkedIdeaIds.has(idea.id)
                  const isSelected = selectedIdeaIds.has(idea.id)

                  return (
                    <div
                      key={idea.id}
                      className={`flex items-start gap-3 p-4 border transition-colors ${
                        isLinked
                          ? "border-green-500/50 bg-green-500/5 opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        id={`idea-${idea.id}`}
                        checked={isSelected}
                        disabled={isLinked}
                        onCheckedChange={() => handleToggleIdeaSelection(idea.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`idea-${idea.id}`}
                          className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                        >
                          {idea.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{idea.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {idea.category}
                          </Badge>
                          <span>{idea.votes} votes</span>
                          <span>•</span>
                          <span>
                            {new Date(idea.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowLinkIdeas(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkIdeas} disabled={selectedIdeaIds.size === 0}>
                Add {selectedIdeaIds.size} {selectedIdeaIds.size === 1 ? "Idea" : "Ideas"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Tools Dialog */}
      <Dialog open={showLinkTools} onOpenChange={setShowLinkTools}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Link Tools to Episode</DialogTitle>
            <DialogDescription>
              Select tools to add as topics for this episode. You can select multiple items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools by title or description..."
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="text-sm text-muted-foreground">
                {selectedToolIds.size} of {getFilteredTools().filter((t) => !linkedToolIds.has(t.id)).length} selected
              </div>
              <div className="flex items-center gap-2">
                <Select value={toolCategoryFilter} onValueChange={setToolCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Project Management">Project Management</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={handleToggleAllTools} className="shrink-0">
                  {getFilteredTools().every((tool) => selectedToolIds.has(tool.id) || linkedToolIds.has(tool.id))
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {getFilteredTools().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tools found for the selected category.</p>
              ) : (
                getFilteredTools().map((tool) => {
                  const isLinked = linkedToolIds.has(tool.id)
                  const isSelected = selectedToolIds.has(tool.id)

                  return (
                    <div
                      key={tool.id}
                      className={`flex items-start gap-3 p-4 border transition-colors ${
                        isLinked
                          ? "border-green-500/50 bg-green-500/5 opacity-60"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        id={`tool-${tool.id}`}
                        checked={isSelected}
                        disabled={isLinked}
                        onCheckedChange={() => handleToggleToolSelection(tool.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`tool-${tool.id}`}
                          className={`font-semibold cursor-pointer ${isLinked ? "text-muted-foreground" : ""}`}
                        >
                          {tool.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tool.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          {tool.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{tool.votes} votes</span>
                          <span>•</span>
                          <span>
                            {new Date(tool.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {isLinked && <Badge className="bg-green-500 text-white mt-2 text-xs">Already Linked</Badge>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowLinkTools(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkTools} disabled={selectedToolIds.size === 0}>
                Add {selectedToolIds.size} {selectedToolIds.size === 1 ? "Tool" : "Tools"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
