import styled, { keyframes } from 'styled-components'
import { surface } from '@/styles/surface'

export const Panel = styled.div`
  ${surface}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 48px 24px;
  color: var(--dim);
  text-align: center;
`

export const NoticeTitle = styled.p`
  margin: 0;
  font-family: var(--font-head);
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
`

export const NoticeHint = styled.p`
  margin: 0;
  font-size: var(--font-meta);
`

const pulse = keyframes`
  50% { opacity: 0.55; }
`

export const Skeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

/** Staggered so the four bars read as loading rather than as one flashing block. */
export const SkeletonRow = styled.div`
  height: 92px;
  border-radius: var(--radius);
  background: var(--skeleton);
  animation: ${pulse} 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.15s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
  &:nth-child(4) {
    animation-delay: 0.45s;
  }
`

/** The connection warning above the feed. */
export const Banner = styled.p`
  margin: 0;
  padding: 10px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--up);
  background: color-mix(in srgb, var(--up) 10%, var(--surface));
  font-size: var(--font-meta);
`
