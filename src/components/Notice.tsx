import { Inbox } from 'lucide-react'
import {
  Banner as Warning,
  NoticeHint,
  NoticeTitle,
  Panel,
  Skeleton,
  SkeletonRow,
} from './Notice.styled'

/** Empty and loading states for the feed, and the connection warning. */

export function EmptyFeed({ message, hint }: { message: string; hint: string }) {
  return (
    <Panel>
      <Inbox size={30} strokeWidth={1.5} />
      <NoticeTitle>{message}</NoticeTitle>
      <NoticeHint>{hint}</NoticeHint>
    </Panel>
  )
}

export function FeedSkeleton() {
  return (
    <Skeleton aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <SkeletonRow key={index} />
      ))}
    </Skeleton>
  )
}

export function Banner({ children }: { children: React.ReactNode }) {
  return (
    <Warning role="status">{children}</Warning>
  )
}
