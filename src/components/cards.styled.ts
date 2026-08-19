import styled from 'styled-components'
import { surface } from '@/styles/surface'

/** The plain raised panel the sidebar's three sections are built from. */
export const Card = styled.section`
  ${surface}
  padding: 12px 16px 16px;
  font-size: var(--font-body);
`

export const CardTitle = styled.h2`
  font-size: var(--font-meta);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--dim);
  margin-bottom: 10px;
`
