"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User } from "lucide-react"

export function SiteHeader() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  if (!user) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-4xl flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="size-6 bg-primary" />
            <span className="font-bold text-foreground">Societas Lunae</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/news"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/news") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              News
            </Link>
            <Link
              href="/ideas"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/ideas") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Ideas
            </Link>
            <Link
              href="/episodes"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/episodes") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Episodes
            </Link>
            <Link
              href="/tools"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/tools") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Tools
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            {user.role === "admin" ? (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-1 border border-border bg-card/50 hover:bg-card transition-colors ${
                  pathname?.startsWith("/admin") ? "border-primary" : ""
                }`}
              >
                <User className="size-4" />
                <span className="text-sm">{user.username}</span>
              </Link>
            ) : (
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-3 py-1 border border-border bg-card/50 hover:bg-card transition-colors ${
                  pathname?.startsWith("/profile") ? "border-primary" : ""
                }`}
              >
                <User className="size-4" />
                <span className="text-sm">{user.username}</span>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
