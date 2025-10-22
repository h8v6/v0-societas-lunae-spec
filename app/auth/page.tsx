"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    setIsLoading(true)

    // Simulate sending magic link email
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)

      // For demo: auto sign in after 2 seconds
      setTimeout(() => {
        signIn(email)
        router.push("/news")
      }, 2000)
    }, 1500)
  }

  if (emailSent) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="mb-2 font-mono text-2xl font-bold">Check your email</h1>
            <p className="mb-6 text-muted-foreground">
              We've sent a magic link to <span className="font-semibold text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to sign in. The link will expire in 15 minutes.
            </p>
            <Alert className="mt-6 border-primary/50 bg-primary/5">
              <p className="text-xs text-muted-foreground">
                Demo mode: You'll be signed in automatically in a moment...
              </p>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Societas Lunae</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          A community-driven platform for sharing ideas, discussing episodes, discovering tools, and staying updated
          with the latest news in our ecosystem.
        </p>
      </div>

      <Card className="border-2 mb-8">
        <CardContent className="p-8">
          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <p className="text-sm text-destructive">{error}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-4 border-t-2 border-border pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm leading-tight text-muted-foreground cursor-pointer">
                  I agree to the Terms of Service
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="privacy" className="text-sm leading-tight text-muted-foreground cursor-pointer">
                  I agree to the Privacy Policy and consent to the processing of my personal data
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending magic link..." : "Send magic link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo tip: Use admin@example.com for admin access
          </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="terms" className="border-2 border-border bg-card px-6">
          <AccordionTrigger className="text-base font-semibold">Terms of Service</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-4">
            <p>
              <strong>1. Acceptance of Terms</strong>
              <br />
              By accessing and using Societas Lunae, you accept and agree to be bound by the terms and provision of this
              agreement.
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
              You retain all rights to any content you submit, post or display on or through the service. By submitting
              content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, and display such
              content.
            </p>
            <p>
              <strong>4. Community Guidelines</strong>
              <br />
              Users must maintain respectful discourse, avoid spam or malicious content, and respect intellectual
              property rights of others.
            </p>
            <p>
              <strong>5. Termination</strong>
              <br />
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy" className="border-2 border-border bg-card px-6">
          <AccordionTrigger className="text-base font-semibold">Privacy Policy</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-4">
            <p>
              <strong>1. Information We Collect</strong>
              <br />
              We collect information you provide directly to us, including your email address, username, and any content
              you create or share on the platform.
            </p>
            <p>
              <strong>2. How We Use Your Information</strong>
              <br />
              We use the information we collect to provide, maintain, and improve our services, to communicate with you,
              and to monitor and analyze trends and usage.
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
              You have the right to access, update, or delete your personal information at any time. You may also object
              to processing of your personal data or request data portability.
            </p>
            <p>
              <strong>6. Cookies</strong>
              <br />
              We use cookies and similar tracking technologies to track activity on our service and hold certain
              information to improve and analyze our service.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
