"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

export default function HomePage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/news")
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && termsAccepted && privacyAccepted) {
      signIn(email)
    }
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Societas Lunae</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            A community-driven platform for sharing ideas, discussing topics, and collaborating on innovative projects.
            Join us to contribute your thoughts and help shape the future of our community.
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email to receive a magic link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the Terms and Conditions
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="privacy"
                    checked={privacyAccepted}
                    onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the Privacy Policy
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!email || !termsAccepted || !privacyAccepted}>
                Send Magic Link
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Accordions */}
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="terms" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">Terms and Conditions</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-4">
              <p>
                <strong>1. Acceptance of Terms</strong>
                <br />
                By accessing and using Societas Lunae, you accept and agree to be bound by the terms and provision of
                this agreement.
              </p>
              <p>
                <strong>2. Use License</strong>
                <br />
                Permission is granted to temporarily access the materials on Societas Lunae for personal, non-commercial
                transitory viewing only.
              </p>
              <p>
                <strong>3. User Content</strong>
                <br />
                You retain all rights to any content you submit, post or display on or through the service. By
                submitting content, you grant us a worldwide, non-exclusive license to use, copy, and display such
                content.
              </p>
              <p>
                <strong>4. Prohibited Uses</strong>
                <br />
                You may not use the service for any illegal or unauthorized purpose. You must not transmit any worms or
                viruses or any code of a destructive nature.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">Privacy Policy</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-4">
              <p>
                <strong>1. Information We Collect</strong>
                <br />
                We collect information you provide directly to us, such as your email address when you sign up for our
                service.
              </p>
              <p>
                <strong>2. How We Use Your Information</strong>
                <br />
                We use the information we collect to provide, maintain, and improve our services, to communicate with
                you, and to monitor and analyze trends and usage.
              </p>
              <p>
                <strong>3. Information Sharing</strong>
                <br />
                We do not share your personal information with third parties except as described in this policy or with
                your consent.
              </p>
              <p>
                <strong>4. Data Security</strong>
                <br />
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and
                unauthorized access.
              </p>
              <p>
                <strong>5. Your Rights</strong>
                <br />
                You have the right to access, update, or delete your personal information at any time by contacting us.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
