"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Save } from "lucide-react"

export function UserProfile() {
  const { user } = useAuth()

  // Profile data state
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedIn, setLinkedIn] = useState("")
  const [contributionNote, setContributionNote] = useState("")

  // Newsletter subscriptions state
  const [monthlyAINews, setMonthlyAINews] = useState(false)
  const [weeklyAINews, setWeeklyAINews] = useState(false)
  const [streamingNotifications, setStreamingNotifications] = useState(false)
  const [communityDigest, setCommunityDigest] = useState(false)

  const handleSaveProfile = () => {
    // Mock save - in production this would call an API
    console.log("[v0] Saving profile:", {
      username,
      email,
      bio,
      phone,
      linkedIn,
      contributionNote,
    })
    alert("Profile saved successfully!")
  }

  const handleSaveNotifications = () => {
    // Mock save - in production this would call an API
    console.log("[v0] Saving notifications:", {
      monthlyAINews,
      weeklyAINews,
      streamingNotifications,
      communityDigest,
    })
    alert("Notification preferences saved!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="size-12 bg-primary flex items-center justify-center">
          <User className="size-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="size-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Public Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">This will be visible to other community members</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contribution">How would you like to contribute?</Label>
                <Textarea
                  id="contribution"
                  value={contributionNote}
                  onChange={(e) => setContributionNote(e.target.value)}
                  placeholder="Share your skills and how you'd like to help the community..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Role: {user?.role}</Badge>
                </div>
                <Button onClick={handleSaveProfile}>
                  <Save className="size-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscriptions</CardTitle>
              <CardDescription>Choose which updates you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-border bg-card/50">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Monthly AI News</div>
                    <p className="text-sm text-muted-foreground">
                      Receive a monthly digest of the most important AI news and developments
                    </p>
                  </div>
                  <Switch checked={monthlyAINews} onCheckedChange={setMonthlyAINews} />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-border bg-card/50">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Weekly AI News</div>
                    <p className="text-sm text-muted-foreground">
                      Get weekly updates on AI news, tools, and community highlights
                    </p>
                  </div>
                  <Switch checked={weeklyAINews} onCheckedChange={setWeeklyAINews} />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-border bg-card/50">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Streaming Notifications</div>
                    <p className="text-sm text-muted-foreground">
                      Get notified when we go live with new episodes and discussions
                    </p>
                  </div>
                  <Switch checked={streamingNotifications} onCheckedChange={setStreamingNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-border bg-card/50">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Community Digest</div>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of top ideas, tools, and community discussions
                    </p>
                  </div>
                  <Switch checked={communityDigest} onCheckedChange={setCommunityDigest} />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border">
                <Button onClick={handleSaveNotifications}>
                  <Save className="size-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
