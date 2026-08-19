import styled from 'styled-components'
import { surface } from '@/styles/surface'
import { spinning } from '@/styles/spin'
import { Glyph } from './Thumb.styled'

/** The closed state: a single row that looks like the field it becomes. */
export const Stub = styled.button`
  ${surface}
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--dim);
  text-align: left;
  font-size: 15px;

  &:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--text);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const Form = styled.form`
  ${surface}
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
`

export const Field = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
`

export const FieldLabel = styled.legend`
  font-size: var(--font-meta);
  font-weight: 600;
  color: var(--dim);
  padding: 0;
`

export const Input = styled.input<{ $bad?: boolean }>`
  height: 38px;
  padding: 0 12px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  outline: none;

  &:focus {
    border-color: var(--accent);
    background: var(--surface);
  }

  ${(props) => props.$bad && 'border-color: var(--up);'}

  /* iOS zooms any input under 16px on focus. */
  @media (max-width: 640px) {
    font-size: 16px;
  }
`

export const FieldError = styled.span`
  font-size: var(--font-meta);
  color: var(--up);
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const PreviewNote = styled.span`
  font-size: var(--font-meta);
  color: var(--dim);
`

/** The tile's glyph while a link is being looked up: dimmed, and turning. */
export const PreviewSpinner = styled(Glyph)`
  ${spinning}
`
