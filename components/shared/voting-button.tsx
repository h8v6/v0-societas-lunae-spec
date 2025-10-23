"use client"

import { ArrowUp, Heart } from "lucide-react"

interface VotingButtonProps {
  votes: number
  isVoted: boolean
  onVote: () => void
  size?: "sm" | "md" | "lg"
  icon?: "arrow" | "heart"
}

export function VotingButton({ votes, isVoted, onVote, size = "md", icon = "arrow" }: VotingButtonProps) {
  const sizeClasses = {
    sm: "min-w-[50px] h-[50px]",
    md: "min-w-[60px] h-[60px]",
    lg: "min-w-[80px] h-[80px]",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-lg",
  }

  const IconComponent = icon === "heart" ? Heart : ArrowUp

  return (
    <button
      onClick={onVote}
      className={`flex flex-col items-center justify-center ${sizeClasses[size]} border-2 transition-colors ${
        isVoted
          ? "bg-[var(--vote-active)] border-[var(--vote-active)] text-white"
          : "border-border hover:border-[var(--vote-up)] hover:bg-[var(--vote-up)]/10"
      }`}
    >
      <IconComponent className={`${iconSizes[size]} ${isVoted && icon === "heart" ? "fill-current" : ""}`} />
      <span className={`${textSizes[size]} font-bold`}>{votes}</span>
    </button>
  )
}
