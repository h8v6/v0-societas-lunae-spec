"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"

interface EpisodeStreamControlsProps {
  streamStatus: string
  youtubeUrl: string
  xUrl: string
  googleMeetUrl: string
  scheduledDate: string
  showStreamUrlInput: boolean
  showScheduleInput: boolean
  onYoutubeUrlChange: (value: string) => void
  onXUrlChange: (value: string) => void
  onGoogleMeetUrlChange: (value: string) => void
  onScheduledDateChange: (value: string) => void
  onStartStream: () => void
  onEndStream: () => void
  onMarkCompleted: () => void
  onSchedule: () => void
  onToggleStreamUrlInput: () => void
  onToggleScheduleInput: () => void
}

export function EpisodeStreamControls({
  streamStatus,
  youtubeUrl,
  xUrl,
  googleMeetUrl,
  scheduledDate,
  showStreamUrlInput,
  showScheduleInput,
  onYoutubeUrlChange,
  onXUrlChange,
  onGoogleMeetUrlChange,
  onScheduledDateChange,
  onStartStream,
  onEndStream,
  onMarkCompleted,
  onSchedule,
  onToggleStreamUrlInput,
  onToggleScheduleInput,
}: EpisodeStreamControlsProps) {
  return (
    <Card className="p-6 bg-muted/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stream Controls</h3>
          <Badge variant={streamStatus === "live" ? "default" : "secondary"}>
            {streamStatus === "scheduled" && "Scheduled"}
            {streamStatus === "live" && "● Live"}
            {streamStatus === "finished" && "Finished"}
            {streamStatus === "completed" && "Completed"}
          </Badge>
        </div>

        {streamStatus === "scheduled" && (
          <div className="space-y-4">
            {!showScheduleInput ? (
              <Button variant="outline" size="sm" onClick={onToggleScheduleInput} className="gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                {scheduledDate ? "Change Schedule" : "Set Schedule"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Scheduled Date & Time</Label>
                <div className="flex gap-2">
                  <Input
                    id="scheduled-date"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => onScheduledDateChange(e.target.value)}
                  />
                  <Button onClick={onSchedule}>Save</Button>
                </div>
              </div>
            )}

            {!showStreamUrlInput ? (
              <Button variant="outline" size="sm" onClick={onToggleStreamUrlInput}>
                {youtubeUrl || xUrl || googleMeetUrl ? "Edit Stream URLs" : "Add Stream URLs"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => onYoutubeUrlChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="x-url">X (Twitter) URL</Label>
                  <Input
                    id="x-url"
                    placeholder="https://x.com/..."
                    value={xUrl}
                    onChange={(e) => onXUrlChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meet-url">Google Meet URL</Label>
                  <Input
                    id="meet-url"
                    placeholder="https://meet.google.com/..."
                    value={googleMeetUrl}
                    onChange={(e) => onGoogleMeetUrlChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            {(youtubeUrl || xUrl || googleMeetUrl) && (
              <div className="flex gap-2">
                {youtubeUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      YouTube
                    </a>
                  </Button>
                )}
                {xUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={xUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="h-3 w-3" />X
                    </a>
                  </Button>
                )}
                {googleMeetUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={googleMeetUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      Meet
                    </a>
                  </Button>
                )}
              </div>
            )}

            <Button onClick={onStartStream} className="w-full">
              Start Stream
            </Button>
          </div>
        )}

        {streamStatus === "live" && (
          <Button onClick={onEndStream} variant="destructive" className="w-full">
            End Stream
          </Button>
        )}

        {streamStatus === "finished" && (
          <Button onClick={onMarkCompleted} className="w-full">
            Mark as Completed
          </Button>
        )}
      </div>
    </Card>
  )
}
