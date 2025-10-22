"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Bell,
  ScrollText,
  Edit2,
  Save,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  ThumbsUp,
} from "lucide-react"
import type { News } from "@/lib/news-data"

const mockIdeas = [
  {
    id: "1",
    title: "AI-Powered Email Assistant",
    description: "Smart email management with AI-driven responses and scheduling",
    author: "Sarah Chen",
    votes: 42,
    status: "pending",
    createdAt: "2025-10-15",
  },
  {
    id: "2",
    title: "Micro SaaS Analytics Dashboard",
    description: "Simple analytics for small businesses",
    author: "Mike Johnson",
    votes: 38,
    status: "approved",
    createdAt: "2025-10-16",
  },
]

const mockComments = [
  {
    id: "c1",
    ideaTitle: "AI-Powered Email Assistant",
    content: "This would be incredibly useful for managing my inbox!",
    author: "John Doe",
    status: "pending",
    createdAt: "2025-10-16",
  },
  {
    id: "c2",
    ideaTitle: "Micro SaaS Analytics Dashboard",
    content: "Love the simplicity of this idea.",
    author: "Jane Smith",
    status: "approved",
    createdAt: "2025-10-17",
  },
]

const mockUsers = [
  {
    id: "u1",
    username: "johndoe",
    email: "john@example.com",
    bio: "Software developer passionate about micro SaaS",
    contributionNote: "I want to help build tools that solve real problems for small businesses",
    phone: "+1234567890",
    linkedIn: "https://linkedin.com/in/johndoe",
    status: "pending",
    createdAt: "2025-10-18",
  },
  {
    id: "u2",
    username: "janesmith",
    email: "jane@example.com",
    bio: "Product designer with 5 years experience",
    contributionNote: "I can help with UI/UX design and user research",
    status: "approved",
    createdAt: "2025-10-19",
  },
]

const mockToolsData = [
  {
    id: "t1",
    title: "Figma",
    description: "Collaborative interface design tool",
    url: "https://figma.com",
    categories: ["Design", "Collaboration"],
    author: "Admin",
    votes: 156,
    status: "approved",
    createdAt: "2025-10-10",
  },
  {
    id: "t2",
    title: "Notion",
    description: "All-in-one workspace for notes and docs",
    url: "https://notion.so",
    categories: ["Productivity", "Documentation"],
    author: "Sarah Chen",
    votes: 89,
    status: "pending",
    createdAt: "2025-10-20",
  },
]

const initialMockNews: News[] = [
  {
    id: "n1",
    title: "Major Study Exposes AI Misinformation",
    description:
      "A landmark study by the European Broadcasting Union and 22 public broadcasters found that popular AI assistants such as ChatGPT and Copilot misrepresent factual news nearly half the time.",
    references: [
      {
        number: "1",
        url: "https://www.dw.com/en/ai-chatbots-misrepresent-news-almost-half-the-time-says-major-new-study/a-74392921",
      },
    ],
    status: "approved",
    createdAt: "2025-10-22",
    votes: 24,
    author: "AI News Team",
  },
  {
    id: "n2",
    title: "Ethical Concerns in AI and Mental Health",
    description:
      "A Brown University study revealed that many AI chatbots systematically violate ethical standards when providing mental health support.",
    references: [
      {
        number: "3",
        url: "https://www.brown.edu/news/2025-10-21/ai-mental-health-ethics",
      },
    ],
    status: "pending",
    createdAt: "2025-10-22",
    votes: 18,
    author: "AI News Team",
  },
]

const mockAllUsers = [
  {
    id: "u1",
    username: "johndoe",
    email: "john@example.com",
    role: "user",
    status: "approved",
    createdAt: "2025-10-18",
    lastLogin: "2025-10-22",
    totalVotes: 24,
    totalComments: 12,
    bio: "Software developer passionate about micro SaaS",
    phone: "+1234567890",
    linkedIn: "https://linkedin.com/in/johndoe",
    contributionNote: "I want to help build tools that solve real problems for small businesses",
    subscriptions: {
      monthlyNews: true,
      weeklyNews: false,
      streamNotifications: true,
      communityDigest: true,
    },
  },
  {
    id: "u2",
    username: "janesmith",
    email: "jane@example.com",
    role: "user",
    status: "approved",
    createdAt: "2025-10-19",
    lastLogin: "2025-10-21",
    totalVotes: 18,
    totalComments: 8,
    bio: "Product designer with 5 years experience",
    phone: "+9876543210",
    linkedIn: "https://linkedin.com/in/janesmith",
    contributionNote: "I can help with UI/UX design and user research",
    subscriptions: {
      monthlyNews: true,
      weeklyNews: true,
      streamNotifications: false,
      communityDigest: true,
    },
  },
  {
    id: "u3",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "approved",
    createdAt: "2025-10-01",
    lastLogin: "2025-10-22",
    totalVotes: 156,
    totalComments: 89,
    bio: "Platform administrator",
    subscriptions: {
      monthlyNews: true,
      weeklyNews: true,
      streamNotifications: true,
      communityDigest: true,
    },
  },
  {
    id: "u4",
    username: "moderator",
    email: "moderator@example.com",
    role: "moderator",
    status: "approved",
    createdAt: "2025-10-05",
    lastLogin: "2025-10-22",
    totalVotes: 67,
    totalComments: 34,
    bio: "Community moderator",
    subscriptions: {
      monthlyNews: true,
      weeklyNews: true,
      streamNotifications: true,
      communityDigest: false,
    },
  },
]

const mockNotificationTemplates = [
  {
    id: "nt1",
    name: "Welcome Email",
    subject: "Welcome to Societas Lunae!",
    body: "Hi {{username}},\n\nWelcome to our community! We're excited to have you here.\n\nBest regards,\nThe Societas Lunae Team",
    trigger: "user_registration",
  },
  {
    id: "nt2",
    name: "Monthly AI News",
    subject: "Your Monthly AI News Digest",
    body: "Hi {{username}},\n\nHere's your monthly roundup of AI news:\n\n{{news_content}}\n\nStay informed!\nThe Societas Lunae Team",
    trigger: "monthly_newsletter",
  },
  {
    id: "nt3",
    name: "Weekly AI News",
    subject: "Weekly AI Updates",
    body: "Hi {{username}},\n\nThis week in AI:\n\n{{news_content}}\n\nSee you next week!\nThe Societas Lunae Team",
    trigger: "weekly_newsletter",
  },
  {
    id: "nt4",
    name: "Stream Starting",
    subject: "We're Live Now!",
    body: "Hi {{username}},\n\nWe're starting a new episode: {{episode_title}}\n\nJoin us now: {{stream_url}}\n\nSee you there!\nThe Societas Lunae Team",
    trigger: "stream_start",
  },
]

const mockActivityLog = [
  {
    id: "log1",
    timestamp: "2025-10-22 14:32:15",
    type: "user_login",
    user: "johndoe",
    action: "User logged in",
    details: "IP: 192.168.1.1",
  },
  {
    id: "log2",
    timestamp: "2025-10-22 14:28:03",
    type: "email_sent",
    user: "system",
    action: "Weekly newsletter sent",
    details: "Recipients: 156 users",
  },
  {
    id: "log3",
    timestamp: "2025-10-22 14:15:42",
    type: "episode_created",
    user: "admin",
    action: "New episode created",
    details: "Episode #42: AI Ethics Discussion",
  },
  {
    id: "log4",
    timestamp: "2025-10-22 13:45:21",
    type: "user_approved",
    user: "moderator",
    action: "User approved",
    details: "Approved user: janesmith",
  },
  {
    id: "log5",
    timestamp: "2025-10-22 13:30:18",
    type: "stream_started",
    user: "admin",
    action: "Stream started",
    details: "Episode #41: Building Micro SaaS",
  },
  {
    id: "log6",
    timestamp: "2025-10-22 12:15:33",
    type: "email_sent",
    user: "system",
    action: "Stream notification sent",
    details: "Recipients: 89 users",
  },
]

export function AdminPanel() {
  const [ideas, setIdeas] = useState(mockIdeas)
  const [comments, setComments] = useState(mockComments)
  const [users, setUsers] = useState(mockUsers)
  const [tools, setTools] = useState(mockToolsData)
  const [news, setNews] = useState(initialMockNews)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [markdownInput, setMarkdownInput] = useState("")
  const [parsedNews, setParsedNews] = useState<News[]>([])

  const [allUsers, setAllUsers] = useState(mockAllUsers)
  const [expandedUserInList, setExpandedUserInList] = useState<string | null>(null)

  const [notificationTemplates, setNotificationTemplates] = useState(mockNotificationTemplates)
  const [activityLog] = useState(mockActivityLog)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [logFilter, setLogFilter] = useState("all")

  // State for editing individual notification templates, moved to top level
  const [templateEdits, setTemplateEdits] = useState<{
    [key: string]: { subject: string; body: string }
  }>({})

  const handleChangeIdeaStatus = (id: string, newStatus: string) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, status: newStatus } : idea)))
  }

  const handleApproveIdea = (id: string) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, status: "approved" } : idea)))
  }

  const handleRejectIdea = (id: string) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, status: "rejected" } : idea)))
  }

  const handleDeleteIdea = (id: string) => {
    setIdeas(ideas.filter((idea) => idea.id !== id))
  }

  const handleApproveComment = (id: string) => {
    setComments(comments.map((comment) => (comment.id === id ? { ...comment, status: "approved" } : comment)))
  }

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id))
  }

  const handleApproveUser = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: "approved" } : user)))
    setExpandedUserId(null)
  }

  const handleRejectUser = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: "rejected" } : user)))
    setExpandedUserId(null)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    setExpandedUserId(null)
  }

  const toggleUserExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId)
  }

  const handleApproveTool = (id: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, status: "approved" } : tool)))
  }

  const handleRejectTool = (id: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, status: "rejected" } : tool)))
  }

  const handleDeleteTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id))
  }

  const handleApproveNews = (id: string) => {
    setNews(news.map((item) => (item.id === id ? { ...item, status: "approved" } : item)))
  }

  const handleRejectNews = (id: string) => {
    setNews(news.map((item) => (item.id === id ? { ...item, status: "rejected" } : item)))
  }

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id))
  }

  const parseMarkdown = () => {
    const lines = markdownInput.split("\n")
    const newsItems: News[] = []
    const footnotes: { [key: string]: string } = {}

    lines.forEach((line) => {
      const footnoteMatch = line.match(/^\[(\^?\d+)\]:\s*(.+)$/)
      if (footnoteMatch) {
        footnotes[footnoteMatch[1].replace("^", "")] = footnoteMatch[2].trim()
      }
    })

    let currentSection: { title: string; description: string; refs: string[] } | null = null

    lines.forEach((line) => {
      if (line.startsWith("### ")) {
        if (currentSection) {
          const references = currentSection.refs
            .map((ref) => ({
              number: ref,
              url: footnotes[ref] || "",
            }))
            .filter((r) => r.url)

          newsItems.push({
            id: `n${newsItems.length + 1}`,
            title: currentSection.title,
            description: currentSection.description.trim(),
            references,
            status: "pending",
            createdAt: new Date().toISOString().split("T")[0],
            votes: 0,
            author: "AI News Team",
          })
        }

        currentSection = {
          title: line.replace("### ", "").trim(),
          description: "",
          refs: [],
        }
      } else if (currentSection && line.trim() && !line.startsWith("#") && !line.match(/^\[(\^?\d+)\]:/)) {
        const refMatches = line.match(/\[(\^?\d+)\]/g)
        if (refMatches) {
          refMatches.forEach((match) => {
            const refNum = match.replace(/[[\]^]/g, "")
            if (!currentSection!.refs.includes(refNum)) {
              currentSection!.refs.push(refNum)
            }
          })
        }

        const cleanLine = line.replace(/\[(\^?\d+)\]/g, "").trim()
        if (cleanLine) {
          currentSection.description += (currentSection.description ? " " : "") + cleanLine
        }
      }
    })

    if (currentSection) {
      const references = currentSection.refs
        .map((ref) => ({
          number: ref,
          url: footnotes[ref] || "",
        }))
        .filter((r) => r.url)

      newsItems.push({
        id: `n${newsItems.length + 1}`,
        title: currentSection.title,
        description: currentSection.description.trim(),
        references,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        votes: 0,
        author: "AI News Team",
      })
    }

    setParsedNews(newsItems)
  }

  const handleImportParsedNews = () => {
    setNews([...news, ...parsedNews])
    setParsedNews([])
    setMarkdownInput("")
  }

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setAllUsers(allUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const toggleUserInList = (userId: string) => {
    setExpandedUserInList(expandedUserInList === userId ? null : userId)
  }

  const handleSaveTemplate = (templateId: string, updates: { subject: string; body: string }) => {
    setNotificationTemplates(
      notificationTemplates.map((template) => (template.id === templateId ? { ...template, ...updates } : template)),
    )
    setEditingTemplate(null)
    // Clear the edits for this template
    const newTemplateEdits = { ...templateEdits }
    delete newTemplateEdits[templateId]
    setTemplateEdits(newTemplateEdits)
  }

  const totalPending =
    ideas.filter((i) => i.status === "pending").length +
    comments.filter((c) => c.status === "pending").length +
    users.filter((u) => u.status === "pending").length +
    tools.filter((t) => t.status === "pending").length +
    news.filter((n) => n.status === "pending").length

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="approval" className="w-full">
        <TabsList>
          <TabsTrigger value="approval">
            Approval
            <Badge variant="secondary" className="ml-2">
              {totalPending}
            </Badge>
          </TabsTrigger>
          {/* Added new tabs to the main navigation */}
          <TabsTrigger value="users">
            <Users className="size-4 mr-1" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="log">
            <ScrollText className="size-4 mr-1" />
            Log
          </TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* Added approval tab content */}
        <TabsContent value="approval" className="mt-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">
                Users
                <Badge variant="secondary" className="ml-2">
                  {users.filter((u) => u.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <Badge variant="secondary" className="ml-2">
                  {comments.filter((c) => c.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="episodes">
                Episodes
                <Badge variant="secondary" className="ml-2">
                  0
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="tools-approval">
                Tools
                <Badge variant="secondary" className="ml-2">
                  {tools.filter((t) => t.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="news">
                News
                <Badge variant="secondary" className="ml-2">
                  {news.filter((n) => n.status === "pending").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <div className="flex flex-col gap-4">
                {users.length === 0 ? (
                  <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  users.map((user) => {
                    const isExpanded = expandedUserId === user.id

                    return (
                      <div key={user.id} className="border-2 border-border bg-card transition-colors">
                        <div
                          onClick={() => toggleUserExpand(user.id)}
                          className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{user.username}</h3>
                              <Badge
                                variant={
                                  user.status === "approved"
                                    ? "default"
                                    : user.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {user.status}
                              </Badge>
                              {isExpanded ? (
                                <ChevronUp className="size-4 ml-auto text-muted-foreground" />
                              ) : (
                                <ChevronDown className="size-4 ml-auto text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{user.email}</span>
                              <span>Registered: {user.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t-2 border-border p-4 bg-accent/20">
                            <div className="flex flex-col gap-4 mb-6">
                              <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                                <span className="text-sm font-medium text-muted-foreground">Public Bio:</span>
                                <span className="text-sm">{user.bio}</span>
                              </div>

                              <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                                <span className="text-sm font-medium text-muted-foreground">Contribution:</span>
                                <span className="text-sm italic text-foreground/90">{user.contributionNote}</span>
                              </div>

                              {user.phone && (
                                <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                                  <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                                  <span className="text-sm">{user.phone}</span>
                                </div>
                              )}

                              {user.linkedIn && (
                                <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                                  <span className="text-sm font-medium text-muted-foreground">LinkedIn:</span>
                                  <a
                                    href={user.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Profile
                                    <ExternalLink className="size-3" />
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 justify-end pt-4 border-t border-border">
                              {user.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleApproveUser(user.id)
                                    }}
                                  >
                                    <Check className="size-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRejectUser(user.id)
                                    }}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="size-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteUser(user.id)
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="flex flex-col gap-4">
                {comments.length === 0 ? (
                  <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No comments found</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-2 border-border bg-card p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">on</span>
                          <span className="font-medium">{comment.ideaTitle}</span>
                          <Badge variant={comment.status === "approved" ? "default" : "secondary"} className="ml-auto">
                            {comment.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {comment.author}</span>
                          <span>{comment.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.status === "pending" && (
                          <Button size="sm" variant="outline" onClick={() => handleApproveComment(comment.id)}>
                            <Check className="size-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="episodes" className="mt-6">
              <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-muted-foreground">Episodes approval coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="tools-approval" className="mt-6">
              <div className="flex flex-col gap-4">
                {tools.length === 0 ? (
                  <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No tools found</p>
                  </div>
                ) : (
                  tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="border-2 border-border bg-card p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{tool.title}</h3>
                          <Badge
                            variant={
                              tool.status === "approved"
                                ? "default"
                                : tool.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {tool.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2 text-foreground/90 leading-relaxed">{tool.description}</p>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tool.url}
                          <ExternalLink className="size-3" />
                        </a>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {tool.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {tool.author}</span>
                          <span>{tool.votes} votes</span>
                          <span>{tool.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tool.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleApproveTool(tool.id)}>
                              <Check className="size-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectTool(tool.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="size-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTool(tool.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <div className="flex flex-col gap-4">
                {news.length === 0 ? (
                  <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No news found</p>
                  </div>
                ) : (
                  news.map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-border bg-card p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge
                            variant={
                              item.status === "approved"
                                ? "default"
                                : item.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2 text-foreground/90 leading-relaxed">{item.description}</p>
                        {item.references.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {item.references.slice(0, 2).map((ref) => (
                              <a
                                key={ref.number}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="size-3" />
                                <span className="truncate">
                                  [{ref.number}] {new URL(ref.url).hostname}
                                </span>
                              </a>
                            ))}
                            {item.references.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{item.references.length - 2} more references
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {item.author}</span>
                          <span>{item.votes} votes</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleApproveNews(item.id)}>
                              <Check className="size-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectNews(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="size-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNews(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="ideas" className="mt-6">
              <div className="flex flex-col gap-4">
                {ideas.length === 0 ? (
                  <div className="border-2 border-dashed border-border bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No ideas found</p>
                  </div>
                ) : (
                  ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="border-2 border-border bg-card p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{idea.title}</h3>
                          <Badge
                            variant={
                              idea.status === "approved"
                                ? "default"
                                : idea.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {idea.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3 text-foreground/90 leading-relaxed">{idea.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {idea.author}</span>
                          <span>{idea.votes} votes</span>
                          <span>{idea.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={idea.status} onValueChange={(value) => handleChangeIdeaStatus(idea.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Users ({allUsers.length})</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              {allUsers.map((user) => {
                const isExpanded = expandedUserInList === user.id

                return (
                  <div key={user.id} className="border-2 border-border bg-card transition-colors">
                    {/* Collapsed summary view */}
                    <div
                      onClick={() => toggleUserInList(user.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.username}</h3>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : user.role === "moderator" ? "secondary" : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                            <Badge variant={user.status === "approved" ? "default" : "secondary"}>{user.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" />
                              {user.email}
                            </span>
                            <span>Joined {user.createdAt}</span>
                            <span>Last login {user.lastLogin}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="size-4 text-muted-foreground" />
                            <span className="font-medium">{user.totalVotes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="size-4 text-muted-foreground" />
                            <span className="font-medium">{user.totalComments}</span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="size-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>

                    {/* Expanded detailed view */}
                    {isExpanded && (
                      <div className="border-t-2 border-border p-6 bg-accent/20">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          {/* Left column - Profile Info */}
                          <div className="flex flex-col gap-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Profile Information
                            </h4>

                            {user.bio && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Bio</Label>
                                <p className="text-sm mt-1">{user.bio}</p>
                              </div>
                            )}

                            {user.contributionNote && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Contribution Note</Label>
                                <p className="text-sm mt-1 italic text-foreground/90">{user.contributionNote}</p>
                              </div>
                            )}

                            {user.phone && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="size-4 text-muted-foreground" />
                                  <span className="text-sm">{user.phone}</span>
                                </div>
                              </div>
                            )}

                            {user.linkedIn && (
                              <div>
                                <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                                <a
                                  href={user.linkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 mt-1 text-sm text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Linkedin className="size-4" />
                                  View Profile
                                  <ExternalLink className="size-3" />
                                </a>
                              </div>
                            )}

                            <div>
                              <Label className="text-xs text-muted-foreground">Change Role</Label>
                              <Select value={user.role} onValueChange={(value) => handleChangeUserRole(user.id, value)}>
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Right column - Subscriptions & Activity */}
                          <div className="flex flex-col gap-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Newsletter Subscriptions
                            </h4>

                            {user.subscriptions && (
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`monthly-${user.id}`} className="text-sm">
                                    Monthly AI News
                                  </Label>
                                  <Switch id={`monthly-${user.id}`} checked={user.subscriptions.monthlyNews} disabled />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`weekly-${user.id}`} className="text-sm">
                                    Weekly AI News
                                  </Label>
                                  <Switch id={`weekly-${user.id}`} checked={user.subscriptions.weeklyNews} disabled />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`stream-${user.id}`} className="text-sm">
                                    Stream Notifications
                                  </Label>
                                  <Switch
                                    id={`stream-${user.id}`}
                                    checked={user.subscriptions.streamNotifications}
                                    disabled
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`digest-${user.id}`} className="text-sm">
                                    Community Digest
                                  </Label>
                                  <Switch
                                    id={`digest-${user.id}`}
                                    checked={user.subscriptions.communityDigest}
                                    disabled
                                  />
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-border">
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                                Activity Stats
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <span className="text-2xl font-bold">{user.totalVotes}</span>
                                  <span className="text-xs text-muted-foreground">Total Votes</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-2xl font-bold">{user.totalComments}</span>
                                  <span className="text-xs text-muted-foreground">Total Comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 justify-end pt-4 border-t border-border">
                          <Button size="sm" variant="outline">
                            Send Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle suspend user
                            }}
                          >
                            Suspend User
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setAllUsers(allUsers.filter((u) => u.id !== user.id))
                              setExpandedUserInList(null)
                            }}
                          >
                            <Trash2 className="size-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Notification Templates</h2>
            {notificationTemplates.map((template) => {
              const isEditing = editingTemplate === template.id
              // Initialize edit state from templateEdits or default to template values
              const editSubject = templateEdits[template.id]?.subject ?? template.subject
              const editBody = templateEdits[template.id]?.body ?? template.body

              const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setTemplateEdits({
                  ...templateEdits,
                  [template.id]: { ...templateEdits[template.id], subject: e.target.value },
                })
              }

              const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTemplateEdits({
                  ...templateEdits,
                  [template.id]: { ...templateEdits[template.id], body: e.target.value },
                })
              }

              return (
                <div key={template.id} className="border-2 border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {template.trigger}
                      </Badge>
                    </div>
                    {!isEditing ? (
                      <Button size="sm" variant="outline" onClick={() => setEditingTemplate(template.id)}>
                        <Edit2 className="size-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveTemplate(template.id, { subject: editSubject, body: editBody })}
                        >
                          <Save className="size-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTemplate(null)
                            // Remove edits for this template if cancelled
                            const newTemplateEdits = { ...templateEdits }
                            delete newTemplateEdits[template.id]
                            setTemplateEdits(newTemplateEdits)
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-4">
                      <div>
                        <Label htmlFor={`subject-${template.id}`}>Subject</Label>
                        <Input
                          id={`subject-${template.id}`}
                          value={editSubject}
                          onChange={handleSubjectChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`body-${template.id}`}>Body</Label>
                        <Textarea
                          id={`body-${template.id}`}
                          value={editBody}
                          onChange={handleBodyChange}
                          className="mt-1 min-h-[200px] font-mono text-sm"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Available variables:{" "}
                        {`{{username}}, {{email}}, {{news_content}}, {{episode_title}}, {{stream_url}}`}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Subject: </span>
                        <span className="text-sm">{template.subject}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Body:</span>
                        <pre className="text-sm mt-1 p-3 bg-accent/30 rounded whitespace-pre-wrap">{template.body}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="log" className="mt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Activity Log</h2>
              <Select value={logFilter} onValueChange={setLogFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="user_login">User Logins</SelectItem>
                  <SelectItem value="email_sent">Emails Sent</SelectItem>
                  <SelectItem value="episode_created">Episodes</SelectItem>
                  <SelectItem value="stream_started">Streams</SelectItem>
                  <SelectItem value="user_approved">User Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-border bg-card">
              <div className="grid grid-cols-[180px_120px_140px_1fr_1fr] gap-4 p-4 border-b-2 border-border bg-accent/50 font-semibold text-sm">
                <div>Timestamp</div>
                <div>Type</div>
                <div>User</div>
                <div>Action</div>
                <div>Details</div>
              </div>
              {activityLog
                .filter((log) => logFilter === "all" || log.type === logFilter)
                .map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-[180px_120px_140px_1fr_1fr] gap-4 p-4 border-b border-border items-center hover:bg-accent/30 transition-colors"
                  >
                    <div className="text-sm font-mono">{log.timestamp}</div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {log.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">{log.user}</div>
                    <div className="text-sm">{log.action}</div>
                    <div className="text-sm text-muted-foreground">{log.details}</div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <Tabs defaultValue="md-parser" className="w-full">
            <TabsList>
              <TabsTrigger value="md-parser">
                <FileText className="size-4 mr-1" />
                MD Parser
              </TabsTrigger>
            </TabsList>

            <TabsContent value="md-parser" className="mt-6">
              <div className="flex flex-col gap-4">
                <div className="border-2 border-border bg-card p-4">
                  <h3 className="font-semibold mb-2">Paste Markdown Content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste Markdown content with ### headings for news sections and [^X] footnotes for references.
                  </p>
                  <Textarea
                    placeholder="# ai news today&#10;&#10;### Major Study Exposes AI Misinformation&#10;&#10;A landmark study...[^1][^2]&#10;&#10;[^1]: https://example.com"
                    value={markdownInput}
                    onChange={(e) => setMarkdownInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm mb-4"
                  />
                  <Button onClick={parseMarkdown} disabled={!markdownInput.trim()}>
                    Parse & Generate News
                  </Button>
                </div>

                {parsedNews.length > 0 && (
                  <div className="border-2 border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Parsed News ({parsedNews.length})</h3>
                      <Button onClick={handleImportParsedNews}>
                        <Check className="size-4 mr-1" />
                        Import All as Pending
                      </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {parsedNews.map((item) => (
                        <div key={item.id} className="border border-border bg-accent/20 p-3">
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="text-xs text-muted-foreground">{item.references.length} references</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
