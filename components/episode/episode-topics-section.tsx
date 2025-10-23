"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, LinkIcon } from "lucide-react"
import { TopicCard } from "@/components/shared/topic-card"

interface Topic {
  id: string
  title: string
  description: string
  author: string
  votes: number
  createdAt: Date
  isCovered: boolean
  urls: string[]
  linkedIdeaId?: string
  linkedToolId?: string
  linkedNewsId?: string
}

interface EpisodeTopicsSectionProps {
  topics: Topic[]
  votedTopics: Set<string>
  isCompleted: boolean
  isAdmin: boolean
  onTopicVote: (topicId: string) => void
  onToggleCovered: (topicId: string) => void
  onAddTopic: (topic: Omit<Topic, "id" | "createdAt">) => void
  onLinkIdeas: () => void
  onLinkTools: () => void
  onLinkNews: () => void
  username?: string
}

export function EpisodeTopicsSection({
  topics,
  votedTopics,
  isCompleted,
  isAdmin,
  onTopicVote,
  onToggleCovered,
  onAddTopic,
  onLinkIdeas,
  onLinkTools,
  onLinkNews,
  username,
}: EpisodeTopicsSectionProps) {
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTopicDescription, setNewTopicDescription] = useState("")
  const [newTopicUrls, setNewTopicUrls] = useState<string[]>([""])

  const handleSubmitTopic = () => {
    if (newTopicTitle.trim() && newTopicDescription.trim()) {
      onAddTopic({
        title: newTopicTitle,
        description: newTopicDescription,
        author: username || "You",
        votes: 0,
        isCovered: false,
        urls: newTopicUrls.filter((url) => url.trim() !== ""),
      })
      setNewTopicTitle("")
      setNewTopicDescription("")
      setNewTopicUrls([""])
      setShowAddTopic(false)
    }
  }

  const handleAddUrl = () => {
    setNewTopicUrls([...newTopicUrls, ""])
  }

  const handleRemoveUrl = (index: number) => {
    setNewTopicUrls(newTopicUrls.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...newTopicUrls]
    updated[index] = value
    setNewTopicUrls(updated)
  }

  const sortedTopics = [...topics].sort((a, b) => {
    if (a.isCovered !== b.isCovered) return a.isCovered ? 1 : -1
    return b.votes - a.votes
  })

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Topics to Cover ({topics.length})</h2>
        <div className="flex gap-2">
          {isAdmin && !isCompleted && (
            <>
              <Button variant="outline" size="sm" onClick={onLinkIdeas} className="gap-2 bg-transparent">
                <LinkIcon className="h-4 w-4" />
                Link Idea
              </Button>
              <Button variant="outline" size="sm" onClick={onLinkTools} className="gap-2 bg-transparent">
                <LinkIcon className="h-4 w-4" />
                Link Tool
              </Button>
              <Button variant="outline" size="sm" onClick={onLinkNews} className="gap-2 bg-transparent">
                <LinkIcon className="h-4 w-4" />
                Link News
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sortedTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isVoted={votedTopics.has(topic.id)}
            isAdmin={isAdmin}
            onVote={() => onTopicVote(topic.id)}
            onToggleCovered={() => onToggleCovered(topic.id)}
          />
        ))}
      </div>

      {!isCompleted && (
        <>
          {!showAddTopic ? (
            <Button variant="outline" onClick={() => setShowAddTopic(true)} className="w-full mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Suggest Topic
            </Button>
          ) : (
            <Card className="p-4 mt-4 border-dashed border-2 bg-muted/30">
              <div className="space-y-4">
                <Input
                  placeholder="Topic title"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Describe what should be covered..."
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  rows={3}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference URLs (optional)</label>
                  {newTopicUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                      />
                      {newTopicUrls.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => handleRemoveUrl(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddUrl} className="gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add URL
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitTopic}>Submit Topic</Button>
                  <Button variant="outline" onClick={() => setShowAddTopic(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </Card>
  )
}
