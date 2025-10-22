# Product Requirements Document (PRD)
## Societas Lunae - Community Platform

**Version:** 1.0  
**Last Updated:** October 22, 2025  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Overview
Societas Lunae is a community-driven platform designed for sharing ideas, discussing AI news, managing podcast episodes, and discovering tools. The platform enables collaborative content curation through voting, commenting, and admin-moderated approval workflows.

### 1.2 Current State
The application is in active development with core features implemented:
- Authentication system with role-based access (User, Moderator, Admin)
- Four main content modules: News, Ideas, Episodes, Tools
- Voting and commenting system
- Admin panel with approval workflows
- User profile management with newsletter subscriptions
- Live streaming integration for episodes

### 1.3 Target Users
- **Regular Users**: Community members who consume content, vote, comment, and suggest topics
- **Moderators**: Trusted community members who help manage content and users
- **Admins**: Platform administrators with full control over content, users, and system settings

---

## 2. Module & Route Inventory

### 2.1 Public Routes
| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page with sign-in form | No |
| `/auth` | Authentication page (magic link) | No |

### 2.2 Protected Routes
| Route | Purpose | Access Level |
|-------|---------|--------------|
| `/news` | News board listing | User+ |
| `/news/[id]` | News detail page | User+ |
| `/ideas` | Ideas board listing | User+ |
| `/ideas/[id]` | Idea detail page | User+ |
| `/episodes` | Episodes board listing | User+ |
| `/episodes/[id]` | Episode detail page | User+ |
| `/episodes/[id]/chat` | Live episode chat | User+ |
| `/tools` | Tools board listing | User+ |
| `/tools/[id]` | Tool detail page | User+ |
| `/profile` | User profile & settings | User+ |
| `/admin` | Admin panel | Admin/Moderator |

### 2.3 Component Architecture

#### Core Layout Components
- `app/layout.tsx` - Root layout with AuthProvider and SiteHeader
- `components/site-header.tsx` - Navigation bar with user menu

#### Board Components (List Views)
- `components/news-board.tsx` - News listing with voting
- `components/ideas-board.tsx` - Ideas listing with voting
- `components/episodes-board.tsx` - Episodes listing with likes
- `components/tools-board.tsx` - Tools listing with voting

#### Detail Components
- `components/news-detail.tsx` - News detail with comments, admin linking
- `components/idea-detail.tsx` - Idea detail with comments, status management
- `components/episode-detail.tsx` - Episode detail with topics, stream controls
- `components/tool-detail.tsx` - Tool detail with comments, admin linking

#### Admin Components
- `components/admin-panel.tsx` - Admin dashboard with tabs:
  - Approval (Users, Comments, Episodes, Tools, News)
  - Users (Complete user management)
  - Notifications (Email template management)
  - Log (System activity log)
  - Tools (MD Parser)

#### User Components
- `components/user-profile.tsx` - User profile with tabs:
  - Profile (Personal data form)
  - Notifications (Newsletter subscriptions)

#### Specialized Components
- `components/episode-chat-window.tsx` - Live chat for streaming episodes

---

## 3. Data Model

### 3.1 TypeScript Interfaces

#### User
\`\`\`typescript
interface User {
  id: string
  email: string
  username: string
  role: "user" | "admin" | "moderator"
  bio?: string
  phone?: string
  linkedin?: string
  contributionNote?: string
  joinedDate: Date
  lastLogin: Date
  status: "pending" | "approved" | "suspended"
  votes: number
  comments: number
  suggestions: number
  newsletters: {
    monthlyAI: boolean
    weeklyAI: boolean
    streamNotifications: boolean
    communityDigest: boolean
  }
}
\`\`\`

#### News
\`\`\`typescript
interface NewsReference {
  number: string
  url: string
}

interface News {
  id: string
  title: string
  description: string
  references: NewsReference[]
  status: "pending" | "approved" | "rejected"
  createdAt: string
  votes: number
  author: string
  category: string
  comments: Comment[]
  linkedIdeas?: string[]
  linkedTools?: string[]
  linkedEpisodes?: string[]
}
\`\`\`

#### Idea
\`\`\`typescript
interface Idea {
  id: string
  title: string
  description: string
  status: "planned" | "in-progress" | "completed" | "archived"
  createdAt: string
  votes: number
  author: string
  category: string
  comments: Comment[]
  linkedNews?: string[]
  linkedTools?: string[]
  linkedEpisodes?: string[]
}
\`\`\`

#### Episode
\`\`\`typescript
interface Episode {
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
  topics: Topic[]
  comments: Comment[]
  linkedIdeas?: string[]
  linkedTools?: string[]
  linkedNews?: string[]
}

interface Topic {
  id: string
  title: string
  description: string
  votes: number
  status: "suggested" | "covered"
  author: string
  createdAt: string
}
\`\`\`

#### Tool
\`\`\`typescript
interface Tool {
  id: string
  title: string
  description: string
  url: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  votes: number
  author: string
  category: string
  pricing: "free" | "freemium" | "paid"
  comments: Comment[]
  linkedIdeas?: string[]
  linkedNews?: string[]
  linkedEpisodes?: string[]
}
\`\`\`

#### Comment
\`\`\`typescript
interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  votes: number
  status: "pending" | "approved" | "rejected"
  replies?: Comment[]
}
\`\`\`

#### Activity Log
\`\`\`typescript
interface ActivityLog {
  id: string
  type: "user_login" | "email_sent" | "episode_added" | "user_approved" | "stream_started" | "content_approved" | "content_rejected"
  user: string
  action: string
  timestamp: Date
  details: string
}
\`\`\`

#### Notification Template
\`\`\`typescript
interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: "welcome" | "monthly_ai" | "weekly_ai" | "stream_starting"
  lastEdited: Date
}
\`\`\`

### 3.2 Entity Relationship Diagram (ERD)

\`\`\`
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ email       │
│ username    │
│ role        │
│ ...         │
└──────┬──────┘
       │
       │ creates
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   News   │   │   Idea   │   │ Episode  │   │   Tool   │   │ Comment  │
├──────────┤   ├──────────┤   ├──────────┤   ├──────────┤   ├──────────┤
│ id       │   │ id       │   │ id       │   │ id       │   │ id       │
│ title    │   │ title    │   │ title    │   │ title    │   │ content  │
│ votes    │   │ votes    │   │ likes    │   │ votes    │   │ votes    │
│ status   │   │ status   │   │ status   │   │ status   │   │ status   │
│ ...      │   │ ...      │   │ ...      │   │ ...      │   │ ...      │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘   └──────────┘
     │              │              │              │
     └──────────────┴──────────────┴──────────────┘
                    │
                    │ cross-references (many-to-many)
                    │
              ┌─────────────┐
              │  Linkages   │
              ├─────────────┤
              │ News ↔ Idea │
              │ News ↔ Tool │
              │ News ↔ Ep.  │
              │ Idea ↔ Tool │
              │ Idea ↔ Ep.  │
              │ Tool ↔ Ep.  │
              └─────────────┘

┌──────────────┐
│    Topic     │
├──────────────┤
│ id           │
│ episodeId    │◄─── belongs to Episode
│ title        │
│ votes        │
│ status       │
└──────────────┘
\`\`\`

---

## 4. API Contracts & Endpoints

### 4.1 Current Implementation
The application currently uses **client-side state management** with mock data stored in TypeScript files. No backend API exists yet.

### 4.2 Planned API Endpoints

#### Authentication
\`\`\`
POST   /api/auth/magic-link     - Send magic link email
GET    /api/auth/verify         - Verify magic link token
POST   /api/auth/signout        - Sign out user
\`\`\`

#### Users
\`\`\`
GET    /api/users               - List all users (admin)
GET    /api/users/:id           - Get user details
PATCH  /api/users/:id           - Update user profile
PATCH  /api/users/:id/role      - Change user role (admin)
DELETE /api/users/:id           - Delete user (admin)
POST   /api/users/:id/suspend   - Suspend user (admin)
\`\`\`

#### News
\`\`\`
GET    /api/news                - List news (with filters)
GET    /api/news/:id            - Get news detail
POST   /api/news                - Create news (user)
PATCH  /api/news/:id            - Update news (admin)
DELETE /api/news/:id            - Delete news (admin)
POST   /api/news/:id/vote       - Vote on news
POST   /api/news/:id/approve    - Approve news (admin)
POST   /api/news/:id/reject     - Reject news (admin)
POST   /api/news/:id/link       - Link to idea/tool/episode (admin)
\`\`\`

#### Ideas
\`\`\`
GET    /api/ideas               - List ideas (with filters)
GET    /api/ideas/:id           - Get idea detail
POST   /api/ideas               - Create idea (user)
PATCH  /api/ideas/:id           - Update idea (admin)
DELETE /api/ideas/:id           - Delete idea (admin)
POST   /api/ideas/:id/vote      - Vote on idea
PATCH  /api/ideas/:id/status    - Change status (admin)
POST   /api/ideas/:id/link      - Link to news/tool/episode (admin)
\`\`\`

#### Episodes
\`\`\`
GET    /api/episodes            - List episodes (with filters)
GET    /api/episodes/:id        - Get episode detail
POST   /api/episodes            - Create episode (admin)
PATCH  /api/episodes/:id        - Update episode (admin)
DELETE /api/episodes/:id        - Delete episode (admin)
POST   /api/episodes/:id/like   - Like episode
POST   /api/episodes/:id/topics - Suggest topic (user, only if not completed)
PATCH  /api/episodes/:id/topics/:topicId/covered - Mark topic as covered (admin)
POST   /api/episodes/:id/stream/start - Start stream (admin)
POST   /api/episodes/:id/stream/end   - End stream (admin)
POST   /api/episodes/:id/link   - Link to idea/tool/news (admin)
\`\`\`

#### Tools
\`\`\`
GET    /api/tools               - List tools (with filters)
GET    /api/tools/:id           - Get tool detail
POST   /api/tools               - Suggest tool (user)
PATCH  /api/tools/:id           - Update tool (admin)
DELETE /api/tools/:id           - Delete tool (admin)
POST   /api/tools/:id/vote      - Vote on tool
POST   /api/tools/:id/approve   - Approve tool (admin)
POST   /api/tools/:id/reject    - Reject tool (admin)
POST   /api/tools/:id/link      - Link to idea/news/episode (admin)
\`\`\`

#### Comments
\`\`\`
GET    /api/comments            - List comments (with filters)
POST   /api/:type/:id/comments  - Add comment to news/idea/episode/tool
PATCH  /api/comments/:id        - Update comment (author)
DELETE /api/comments/:id        - Delete comment (author/admin)
POST   /api/comments/:id/vote   - Vote on comment
POST   /api/comments/:id/approve - Approve comment (admin)
POST   /api/comments/:id/reject  - Reject comment (admin)
\`\`\`

#### Admin
\`\`\`
GET    /api/admin/stats         - Get platform statistics
GET    /api/admin/logs          - Get activity logs
GET    /api/admin/notifications - Get notification templates
PATCH  /api/admin/notifications/:id - Update template (admin)
POST   /api/admin/notifications/send - Send notification (admin)
\`\`\`

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow
1. User enters email on landing page
2. System sends magic link to email
3. User clicks link, gets authenticated
4. Session stored in localStorage (mock) / JWT token (production)
5. User redirected to `/news` page

### 5.2 Role-Based Access Control (RBAC)

#### User Permissions
- View all approved content
- Vote on content
- Comment on content
- Suggest topics for episodes (only if not completed)
- Suggest new tools
- Create ideas
- Edit own profile
- Subscribe to newsletters

#### Moderator Permissions
- All User permissions
- Approve/reject pending content
- Approve/reject comments
- Approve/reject users
- Mark episode topics as covered
- Control stream (start/end)
- Link content across modules

#### Admin Permissions
- All Moderator permissions
- Manage users (change roles, suspend, delete)
- Edit notification templates
- View activity logs
- Access admin panel
- Delete any content
- Full system control

### 5.3 GDPR Compliance

#### Data Collection
- Email address (required for authentication)
- Username (required)
- Optional profile data (bio, phone, LinkedIn, contribution note)
- Activity data (votes, comments, suggestions)
- Newsletter preferences

#### User Rights
- **Right to Access**: Users can view their profile data
- **Right to Rectification**: Users can edit their profile
- **Right to Erasure**: Users can request account deletion (admin action)
- **Right to Data Portability**: Export user data (planned)
- **Right to Object**: Unsubscribe from newsletters

#### Consent Management
- Terms & Conditions acceptance required at sign-up
- Privacy Policy acceptance required at sign-up
- Newsletter subscriptions opt-in (not pre-checked)
- Clear consent checkboxes on landing page

#### Data Storage
- Currently: localStorage (mock implementation)
- Planned: Encrypted database with secure backend
- Session management with secure tokens
- No third-party data sharing

---

## 6. UX Flows

### 6.1 User Onboarding Flow
\`\`\`
Landing Page (/)
  ↓
Enter Email + Accept Terms/Privacy
  ↓
Receive Magic Link (email)
  ↓
Click Magic Link
  ↓
Authenticated → Redirect to /news
  ↓
Browse Content (News/Ideas/Episodes/Tools)
\`\`\`

### 6.2 Content Interaction Flow (User)
\`\`\`
Browse Board (/news, /ideas, /episodes, /tools)
  ↓
Click Item → Detail Page
  ↓
Actions Available:
  - Vote/Like
  - Add Comment
  - Suggest Topic (episodes only, if not completed)
  - View Linked Content
\`\`\`

### 6.3 Content Suggestion Flow (User)
\`\`\`
Navigate to Board
  ↓
Scroll to "Suggest" Form (bottom)
  ↓
Fill Form (title, description, references/urls)
  ↓
Submit → Status: "Pending"
  ↓
Admin Reviews in Admin Panel
  ↓
Approved → Visible to All Users
Rejected → Hidden
\`\`\`

### 6.4 Episode Streaming Flow (Admin)
\`\`\`
Admin Panel → Episodes Tab
  ↓
Select Episode → Edit Details
  ↓
Set Stream URLs (YouTube, X, Google Meet)
  ↓
Set Scheduled Date
  ↓
Episode Detail Page → Stream Controls Visible (Admin Only)
  ↓
Click "Start Stream" → Status: "Live"
  ↓
Users See Live Badge + Chat Window
  ↓
Click "End Stream" → Status: "Finished"
  ↓
Mark Episode as "Completed"
  ↓
Topic Suggestions Disabled
\`\`\`

### 6.5 Admin Approval Flow
\`\`\`
Admin Panel → Approval Tab
  ↓
Select Category (Users/Comments/Episodes/Tools/News)
  ↓
View Pending Items
  ↓
Expand Item → Review Details
  ↓
Actions:
  - Approve → Status: "Approved" (visible to users)
  - Reject → Status: "Rejected" (hidden)
  - Delete → Permanently removed
\`\`\`

### 6.6 Content Linking Flow (Admin)
\`\`\`
Detail Page (News/Idea/Episode/Tool)
  ↓
Admin Sees "Link Idea/Tool/News" Buttons
  ↓
Click Button → Dialog Opens
  ↓
Search & Select Item to Link
  ↓
Confirm → Cross-reference Created
  ↓
Linked Items Visible in "Related Content" Section
\`\`\`

### 6.7 User Profile Management Flow
\`\`\`
Click Username in Header
  ↓
Redirect to /profile
  ↓
Two Tabs:
  1. Profile Tab
     - Edit: Username, Email, Bio, Phone, LinkedIn, Contribution Note
     - Save Changes
  2. Notifications Tab
     - Toggle: Monthly AI News
     - Toggle: Weekly AI News
     - Toggle: Stream Notifications
     - Toggle: Community Digest
     - Save Preferences
\`\`\`

---

## 7. Tests & Quality Assessment

### 7.1 Current Test Coverage
**Status**: No automated tests implemented yet

### 7.2 Recommended Test Strategy

#### Unit Tests
- Component rendering tests (React Testing Library)
- Utility function tests (lib/utils.ts)
- Data model validation tests
- Auth context tests

#### Integration Tests
- User authentication flow
- Voting and commenting functionality
- Admin approval workflows
- Content linking between modules
- Newsletter subscription management

#### E2E Tests (Playwright)
- Complete user onboarding journey
- Content creation and approval flow
- Episode streaming workflow
- Admin panel operations
- Cross-module content linking

#### Accessibility Tests
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

### 7.3 Quality Metrics
- **Code Coverage Target**: 80%+
- **Performance**: Lighthouse score 90+
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: OWASP Top 10 compliance

---

## 8. Prioritized Backlog

### 8.1 P0 - Critical (Must Have)
1. **Backend API Implementation**
   - Replace mock data with real database
   - Implement authentication with magic links
   - Create RESTful API endpoints for all modules

2. **Database Setup**
   - Choose database (PostgreSQL recommended)
   - Design schema based on data models
   - Set up migrations

3. **Production Authentication**
   - Replace localStorage with secure JWT tokens
   - Implement magic link email service
   - Add session management

4. **GDPR Compliance**
   - Implement data export functionality
   - Add account deletion workflow
   - Create privacy dashboard

### 8.2 P1 - High Priority (Should Have)
1. **Real-time Features**
   - WebSocket integration for live chat
   - Real-time vote updates
   - Live stream status updates

2. **Email Notifications**
   - Welcome email on sign-up
   - Newsletter system (monthly/weekly AI news)
   - Stream starting notifications
   - Comment reply notifications

3. **Search & Filtering**
   - Full-text search across all modules
   - Advanced filtering (category, status, date)
   - Sort options (votes, date, popularity)

4. **User Activity Dashboard**
   - Personal activity history
   - Contribution statistics
   - Badges/achievements system

### 8.3 P2 - Medium Priority (Nice to Have)
1. **Rich Text Editor**
   - Markdown support for comments
   - Image uploads
   - Code syntax highlighting

2. **Analytics Dashboard**
   - Platform usage statistics
   - Content performance metrics
   - User engagement analytics

3. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode

4. **Social Features**
   - User profiles with activity feed
   - Follow other users
   - Direct messaging

### 8.4 P3 - Low Priority (Future)
1. **AI Integration**
   - Content moderation with AI
   - Automatic topic suggestions
   - Smart content recommendations

2. **Internationalization**
   - Multi-language support
   - Localized content

3. **API for Third-party Integrations**
   - Public API with rate limiting
   - Webhooks for events
   - OAuth integration

---

## 9. Risks & Assumptions

### 9.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Mock data in production | High | Implement backend API before launch |
| localStorage security | High | Replace with secure JWT tokens |
| No real-time updates | Medium | Implement WebSocket for live features |
| No test coverage | High | Add comprehensive test suite |
| Single point of failure | Medium | Implement error boundaries and fallbacks |

### 9.2 Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user adoption | High | Marketing strategy, community building |
| Content moderation overhead | Medium | Implement AI-assisted moderation |
| Spam and abuse | Medium | Rate limiting, CAPTCHA, reputation system |
| GDPR non-compliance | High | Legal review, privacy audit |

### 9.3 Assumptions
1. Users have reliable internet connection for streaming
2. Email delivery is reliable for magic links
3. Community will self-moderate with admin oversight
4. Content volume will remain manageable for manual approval
5. Users prefer magic link auth over password-based auth

---

## 10. Open Questions

### 10.1 Technical Questions
1. **Database Choice**: PostgreSQL vs MongoDB vs Supabase?
2. **Hosting**: Vercel + Supabase vs AWS vs self-hosted?
3. **Real-time**: WebSocket vs Server-Sent Events vs polling?
4. **File Storage**: Where to store user uploads (avatars, images)?
5. **Email Service**: SendGrid vs Resend vs AWS SES?
6. **Search**: Implement own search vs Algolia vs Elasticsearch?

### 10.2 Product Questions
1. **Monetization**: Free forever vs freemium vs paid tiers?
2. **Content Ownership**: Who owns user-generated content?
3. **Moderation Policy**: What content is allowed/prohibited?
4. **User Reputation**: Should we implement karma/reputation system?
5. **Episode Format**: Live-only vs recorded vs hybrid?
6. **Content Archival**: How long to keep old episodes/content?

### 10.3 UX Questions
1. **Onboarding**: Should we have a tutorial/walkthrough?
2. **Notifications**: In-app vs email vs both?
3. **Mobile Experience**: Responsive web vs native app?
4. **Accessibility**: What WCAG level to target (A, AA, AAA)?
5. **Dark Mode**: Dark-only vs light/dark toggle?

### 10.4 Legal Questions
1. **Terms of Service**: Need legal review?
2. **Privacy Policy**: GDPR + CCPA compliant?
3. **Content Licensing**: What license for user content?
4. **Liability**: Who is responsible for user-generated content?
5. **Data Retention**: How long to keep user data after deletion request?

---

## 11. Appendix

### 11.1 Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: React Context API (auth), local state
- **Data Storage**: Mock data in TypeScript files (temporary)
- **Deployment**: Vercel (planned)
- **Analytics**: Vercel Analytics

### 11.2 Design System
- **Color Palette**: Dark theme with vibrant accents (purple-blue primary)
- **Typography**: Geist Sans (body), Geist Mono (code)
- **Spacing**: Tailwind default scale (4px base)
- **Border Radius**: 0 (square corners for pixel aesthetic)
- **Icons**: Lucide React icons

### 11.3 Key Dependencies
\`\`\`json
{
  "next": "^15.x",
  "react": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "@radix-ui/*": "latest",
  "lucide-react": "latest"
}
\`\`\`

### 11.4 File Structure
\`\`\`
societas-lunae/
├── app/
│   ├── (auth)/
│   │   ├── page.tsx              # Landing page
│   │   └── auth/page.tsx         # Auth page
│   ├── (protected)/
│   │   ├── news/
│   │   │   ├── page.tsx          # News board
│   │   │   └── [id]/page.tsx    # News detail
│   │   ├── ideas/
│   │   │   ├── page.tsx          # Ideas board
│   │   │   └── [id]/page.tsx    # Idea detail
│   │   ├── episodes/
│   │   │   ├── page.tsx          # Episodes board
│   │   │   ├── [id]/page.tsx    # Episode detail
│   │   │   └── [id]/chat/page.tsx # Episode chat
│   │   ├── tools/
│   │   │   ├── page.tsx          # Tools board
│   │   │   └── [id]/page.tsx    # Tool detail
│   │   ├── profile/page.tsx      # User profile
│   │   └── admin/page.tsx        # Admin panel
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── *-board.tsx               # Board components
│   ├── *-detail.tsx              # Detail components
│   ├── admin-panel.tsx           # Admin panel
│   ├── user-profile.tsx          # User profile
│   └── site-header.tsx           # Navigation
├── lib/
│   ├── auth-context.tsx          # Auth provider
│   ├── *-data.ts                 # Mock data files
│   └── utils.ts                  # Utility functions
└── docs/
    └── PRD.md                    # This document
\`\`\`

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-22 | Initial PRD created with complete system documentation |

---

**Document Owner**: Development Team  
**Stakeholders**: Product, Engineering, Design, Legal  
**Next Review Date**: 2025-11-01
