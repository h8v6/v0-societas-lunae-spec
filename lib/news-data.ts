export interface NewsReference {
  number: string
  url: string
}

export interface News {
  id: string
  title: string
  description: string
  references: NewsReference[]
  status: "pending" | "approved" | "rejected"
  createdAt: string
  votes: number
  author: string
  category: string
}

// Mock data - will be replaced with parsed Markdown
export const mockNews: News[] = [
  {
    id: "n1",
    title: "Major Study Exposes AI Misinformation",
    description:
      "A landmark study by the European Broadcasting Union and 22 public broadcasters found that popular AI assistants such as ChatGPT and Copilot misrepresent factual news nearly half the time. Researchers concluded that these models often blur fact and opinion, leading to significant distortions in news interpretation worldwide.",
    references: [
      {
        number: "1",
        url: "https://www.dw.com/en/ai-chatbots-misrepresent-news-almost-half-the-time-says-major-new-study/a-74392921",
      },
      {
        number: "2",
        url: "https://www.reuters.com/business/media-telecom/ai-assistants-make-widespread-errors-about-news-new-research-shows-2025-10-21/",
      },
    ],
    status: "approved",
    createdAt: "2025-10-22",
    votes: 24,
    author: "AI News Team",
    category: "AI Research",
  },
  {
    id: "n2",
    title: "Ethical Concerns in AI and Mental Health",
    description:
      "A Brown University study being presented at the AAAI/ACM Conference on Artificial Intelligence, Ethics, and Society revealed that many AI chatbots systematically violate ethical standards when providing mental health support. The research found inconsistent adherence to professional mental health guidelines, raising potential safety and liability concerns.",
    references: [
      {
        number: "3",
        url: "https://www.brown.edu/news/2025-10-21/ai-mental-health-ethics",
      },
    ],
    status: "approved",
    createdAt: "2025-10-22",
    votes: 18,
    author: "AI News Team",
    category: "AI Ethics",
  },
  {
    id: "n3",
    title: "AI Chatbots and the Loneliness Epidemic",
    description:
      "New data from Australia linked the widespread use of AI chatbots to the nation's growing loneliness epidemic. Researchers discovered that an increasing number of individuals are turning to conversational AI for companionship instead of human interaction, prompting calls for ethical design interventions.",
    references: [
      {
        number: "4",
        url: "https://www.abc.net.au/news/2025-10-22/naus_chatbotsdatanr_2210/105919558",
      },
      {
        number: "5",
        url: "https://www.abc.net.au/news/2025-10-22/ai-relationship-study/105917858",
      },
    ],
    status: "pending",
    createdAt: "2025-10-22",
    votes: 15,
    author: "AI News Team",
    category: "AI Society",
  },
]
