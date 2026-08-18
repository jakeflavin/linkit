import { Inbox } from 'lucide-react'

/** Empty and loading states for the feed, and the connection warning. */

export function EmptyFeed({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="notice">
      <Inbox size={30} strokeWidth={1.5} />
      <p className="notice-title">{message}</p>
      <p className="notice-hint">{hint}</p>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="skeleton" aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="skeleton-row" />
      ))}
    </div>
  )
}

export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <p className="banner" role="status">
      {children}
    </p>
  )
}
