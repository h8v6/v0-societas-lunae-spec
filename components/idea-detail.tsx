"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowUp, ArrowLeft, MessageSquare, Calendar, User, Plus, Lightbulb } from "lucide-react"
import Link from "next/link"

const mockIdea = {
  id: "1",
  title: "AI Email Writer for Sales Teams",
  description:
    "Automated email composition tool that generates personalized sales emails using AI, with templates for cold outreach, follow-ups, and nurture sequences. The tool analyzes recipient data and company information to create contextually relevant messages that improve response rates. Includes A/B testing, scheduling, and integration with popular CRMs like HubSpot and Salesforce.",
  author: "Sarah Chen",
  votes: 42,
  status: "in-progress",
  category: "Productivity",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-02-10"),
}

const mockFeatures = [
  {
    id: "f1",
    title: "Email Template Library",
    description:
      "Pre-built templates for different sales scenarios: cold outreach, follow-ups, meeting requests, and proposal emails",
    author: "Marcus Johnson",
    votes: 18,
    createdAt: new Date("2024-01-17"),
  },
  {
    id: "f2",
    title: "Tone Customization",
    description:
      "Adjust email tone from formal to casual, with industry-specific language options (tech, finance, healthcare, etc.)",
    author: "Emma Rodriguez",
    votes: 15,
    createdAt: new Date("2024-01-19"),
  },
  {
    id: "f3",
    title: "CRM Integration",
    description:
      "Two-way sync with HubSpot, Salesforce, and Pipedrive to pull contact data and log sent emails automatically",
    author: "David Kim",
    votes: 12,
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "f4",
    title: "Response Rate Analytics",
    description: "Track open rates, reply rates, and conversion metrics to optimize email performance over time",
    author: "Lisa Anderson",
    votes: 10,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "f5",
    title: "Multi-language Support",
    description: "Generate emails in 20+ languages with culturally appropriate greetings and sign-offs",
    author: "Alex Turner",
    votes: 8,
    createdAt: new Date("2024-01-28"),
  },
]

const mockComments = [
  {
    id: "1",
    author: "Marcus Johnson",
    content:
      "This would save our sales team hours every week! Currently spending 2-3 hours daily just writing personalized emails. Would love to see LinkedIn integration to pull prospect info automatically.",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "2",
    author: "Emma Rodriguez",
    content:
      "Great concept! One concern: how do we ensure the AI doesn't sound too robotic? Personalization is key in sales. Maybe add a feature to inject custom variables like recent company news or mutual connections?",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    author: "David Kim",
    content:
      "We've been using a similar tool and it increased our response rate by 40%. The key is having good templates and the ability to fine-tune the output. Definitely need A/B testing built in.",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    author: "Nina Patel",
    content:
      "Would this work for cold email campaigns or just one-off messages? We send 500+ emails per week and need bulk generation with personalization at scale.",
    createdAt: new Date("2024-01-23"),
  },
  {
    id: "5",
    author: "Alex Turner",
    content:
      "Love this idea! Please make sure it has good spam filter avoidance. Too many AI tools generate emails that end up in spam. Maybe include a spam score checker before sending?",
    createdAt: new Date("2024-01-26"),
  },
]

interface IdeaDetailProps {
  ideaId: string
}

export function IdeaDetail({ ideaId }: IdeaDetailProps) {
  const [isVoted, setIsVoted] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(mockComments)
  const [features, setFeatures] = useState(mockFeatures)
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set())
  const [showAddFeature, setShowAddFeature] = useState(false)
  const [newFeatureTitle, setNewFeatureTitle] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")

  const displayVotes = mockIdea.votes + (isVoted ? 1 : 0)

  const handleVote = () => {
    setIsVoted(!isVoted)
  }

  const handleFeatureVote = (featureId: string) => {
    setVotedFeatures((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(featureId)) {
        newSet.delete(featureId)
      } else {
        newSet.add(featureId)
      }
      return newSet
    })
  }

  const handleSubmitFeature = () => {
    if (newFeatureTitle.trim() && newFeatureDescription.trim()) {
      const feature = {
        id: `f${features.length + 1}`,
        title: newFeatureTitle,
        description: newFeatureDescription,
        author: "You",
        votes: 0,
        createdAt: new Date(),
      }
      setFeatures([...features, feature])
      setNewFeatureTitle("")
      setNewFeatureDescription("")
      setShowAddFeature(false)
    }
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: String(comments.length + 1),
        author: "You",
        content: newComment,
        createdAt: new Date(),
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link href="/ideas">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ideas
        </Button>
      </Link>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Idea Header */}
        <Card className="p-6">
          <div className="flex gap-6">
            {/* Vote Button */}
            <button
              onClick={handleVote}
              className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] border-2 transition-colors ${
                isVoted
                  ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                  : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
              }`}
            >
              <ArrowUp className="h-6 w-6" />
              <span className="text-lg font-bold">{displayVotes}</span>
            </button>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl font-bold">{mockIdea.title}</h1>
                <Badge className={getStatusColor(mockIdea.status)}>{mockIdea.status.replace("-", " ")}</Badge>
              </div>

              <p className="text-lg text-foreground leading-relaxed mb-4">{mockIdea.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>by {mockIdea.author}</span>
                </div>
                <span>•</span>
                <Badge variant="outline">{mockIdea.category}</Badge>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {mockIdea.createdAt.toLocaleDateString("en-US", {
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

        {/* Features Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Features ({features.length})</h2>
            </div>
            <Button onClick={() => setShowAddFeature(!showAddFeature)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          {/* Add Feature Form */}
          {showAddFeature && (
            <div className="mb-6 p-4 border border-border bg-card/50">
              <Input
                placeholder="Feature title..."
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className="mb-3"
              />
              <Textarea
                placeholder="Describe the feature..."
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
                className="mb-3 min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitFeature}
                  disabled={!newFeatureTitle.trim() || !newFeatureDescription.trim()}
                >
                  Submit Feature
                </Button>
                <Button variant="ghost" onClick={() => setShowAddFeature(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="space-y-3">
            {features.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No features yet. Be the first to suggest one!</p>
            ) : (
              features.map((feature) => {
                const isFeatureVoted = votedFeatures.has(feature.id)
                const displayFeatureVotes = feature.votes + (isFeatureVoted ? 1 : 0)

                return (
                  <div
                    key={feature.id}
                    className="flex gap-4 p-4 border border-border hover:border-primary/50 transition-colors"
                  >
                    {/* Vote Button */}
                    <button
                      onClick={() => handleFeatureVote(feature.id)}
                      className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] border-2 transition-colors ${
                        isFeatureVoted
                          ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
                          : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
                      }`}
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span className="text-sm font-bold">{displayFeatureVotes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>by {feature.author}</span>
                        <span>•</span>
                        <span>
                          {feature.createdAt.toLocaleDateString("en-US", {
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
            <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
          </div>

          {/* Comment Form */}
          <div className="mb-6">
            <Textarea
              placeholder="Share your thoughts on this idea..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3 min-h-[100px]"
            />
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
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
      </div>
    </div>
  )
}
