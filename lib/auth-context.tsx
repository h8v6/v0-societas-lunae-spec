"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string
  role: "user" | "admin" | "moderator"
}

interface AuthContextType {
  user: User | null
  signIn: (email: string) => Promise<void>
  signUp: (email: string, username: string, gdprConsent: boolean) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("sl_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string) => {
    // Mock sign in - in production this would send a magic link
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let role: "user" | "admin" | "moderator" = "user"
    if (email === "admin@example.com") {
      role = "admin"
    } else if (email === "moderator@example.com") {
      role = "moderator"
    }

    const mockUser: User = {
      id: "1",
      email,
      username: email.split("@")[0],
      role,
    }

    setUser(mockUser)
    localStorage.setItem("sl_user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const signUp = async (email: string, username: string, gdprConsent: boolean) => {
    if (!gdprConsent) {
      throw new Error("GDPR consent required")
    }

    // Mock sign up - in production this would send a magic link
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let role: "user" | "admin" | "moderator" = "user"
    if (email === "admin@example.com") {
      role = "admin"
    } else if (email === "moderator@example.com") {
      role = "moderator"
    }

    const mockUser: User = {
      id: "1",
      email,
      username,
      role,
    }

    setUser(mockUser)
    localStorage.setItem("sl_user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("sl_user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
