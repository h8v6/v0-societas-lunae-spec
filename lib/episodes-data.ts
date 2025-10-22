export interface Episode {
  id: string
  title: string
  description: string
  date: Date
  duration: string | null
  likes: number
  votes?: number
  status: "suggested" | "completed" | "live"
  host: string | null
  urls: string[]
  isLiveStream?: boolean
  streamStatus?: "scheduled" | "live" | "finished" | "completed"
  youtubeUrl?: string | null
  xUrl?: string | null
  googleMeetUrl?: string | null
  scheduledDate?: Date | null
}

export const episodesData: Episode[] = [
  {
    id: "s1",
    title: "Suggested: AI Tools for Solo Developers",
    description:
      "Would love to hear about the best AI tools that can help solo developers be more productive - coding assistants, design tools, automation, etc.",
    date: new Date("2024-10-20"),
    duration: null,
    likes: 45,
    votes: 0,
    status: "suggested",
    host: null,
    urls: ["https://github.com/features/copilot", "https://v0.dev"],
    isLiveStream: true,
    streamStatus: "scheduled",
    youtubeUrl: null,
    xUrl: null,
    googleMeetUrl: null,
    scheduledDate: new Date("2024-10-25T18:00:00"),
  },
  {
    id: "s2",
    title: "Suggested: Building in Public Strategy",
    description:
      "How to effectively build in public without giving away too much? What to share, what to keep private, and how to grow an audience while building.",
    date: new Date("2024-10-18"),
    duration: null,
    likes: 38,
    votes: 0,
    status: "suggested",
    host: null,
    urls: ["https://twitter.com/levelsio"],
    isLiveStream: true,
    streamStatus: "scheduled",
    youtubeUrl: null,
    xUrl: null,
    googleMeetUrl: null,
    scheduledDate: null,
  },
  {
    id: "s3",
    title: "Suggested: SEO for Micro SaaS",
    description:
      "Practical SEO strategies for micro SaaS products with limited time and budget. What actually works in 2024?",
    date: new Date("2024-10-15"),
    duration: null,
    likes: 52,
    votes: 0,
    status: "suggested",
    host: null,
    urls: [],
    isLiveStream: true,
    streamStatus: "scheduled",
    youtubeUrl: null,
    xUrl: null,
    googleMeetUrl: null,
    scheduledDate: null,
  },
  {
    id: "1",
    title: "Building Your First Micro SaaS",
    description:
      "In this episode, we dive deep into the process of building your first micro SaaS product. We discuss how to find and validate ideas, choose the right tech stack, and launch quickly. Our guest shares their journey from idea to $10k MRR in 6 months, including all the mistakes and lessons learned along the way.",
    date: new Date("2024-02-15"),
    duration: "45 min",
    likes: 127,
    votes: 0,
    status: "completed",
    host: "Alex Turner",
    urls: [],
    isLiveStream: true,
    streamStatus: "completed",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    xUrl: "https://x.com/example1",
    googleMeetUrl: null,
    scheduledDate: null,
  },
  {
    id: "2",
    title: "Marketing Strategies for Solo Founders",
    description:
      "How to market your product when you're a one-person team with limited budget and time. We cover content marketing, SEO, social media strategies, and paid advertising approaches that actually work for solo founders.",
    date: new Date("2024-02-08"),
    duration: "52 min",
    likes: 98,
    votes: 0,
    status: "completed",
    host: "Sarah Chen",
    urls: [],
    isLiveStream: false,
    streamStatus: "ended",
    youtubeUrl: null,
    xUrl: null,
    googleMeetUrl: null,
    scheduledDate: null,
  },
  {
    id: "3",
    title: "Pricing Your SaaS Product",
    description:
      "Deep dive into pricing strategies, psychology, and finding the sweet spot for your product. Learn about value-based pricing, tiered pricing models, and how to test different price points without alienating customers.",
    date: new Date("2024-02-01"),
    duration: "38 min",
    likes: 84,
    votes: 0,
    status: "completed",
    host: "Marcus Johnson",
    urls: [],
    isLiveStream: false,
    streamStatus: "ended",
    youtubeUrl: null,
    xUrl: null,
    googleMeetUrl: null,
    scheduledDate: null,
  },
]
