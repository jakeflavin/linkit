import { useRef, useState } from 'react'
import { Button, Spinner } from './buttons.styled'
import { Chip, ChipRow } from './chips.styled'
import { Tile } from './Thumb.styled'
import {
  Field,
  FieldError,
  FieldLabel,
  Form,
  FormActions,
  Input,
  Preview,
  PreviewNote,
  PreviewSpinner,
  Stub,
} from './SubmitCard.styled'
import { Loader2, Plus } from 'lucide-react'
import { CATEGORIES, CATEGORY_IDS } from '@/data/categories.ts'
import { normalizeUrl, validateDraft, type DraftErrors } from '@/lib/url.ts'
import { fetchPreview } from '@/lib/preview.ts'
import { Thumb } from './Thumb.tsx'
import { domainOf } from '@/lib/url.ts'
import type { LinkDraft } from '@/lib/types.ts'

interface SubmitCardProps {
  onSubmit: (draft: LinkDraft) => Promise<void>
  disabled: boolean
}

/** Long enough that the unfurl is not fired off on every keystroke. */
const LOOKUP_DELAY_MS = 600

/** The compose box at the top of the feed — Reddit's "Create post" row. */
export function SubmitCard({ onSubmit, disabled }: SubmitCardProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<DraftErrors>({})
  const [sending, setSending] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [looking, setLooking] = useState(false)

  const timer = useRef<number | undefined>(undefined)
  /** Guards against a slow lookup landing after a newer one. */
  const lookupFor = useRef('')

  const reset = () => {
    window.clearTimeout(timer.current)
    lookupFor.current = ''
    setUrl('')
    setTitle('')
    setCategory('')
    setErrors({})
    setImage(null)
    setLooking(false)
    setOpen(false)
  }

  /**
   * Looks the URL up shortly after typing stops, to fill in the image and —
   * only if the title is still untouched — the title.
   */
  const scheduleLookup = (value: string) => {
    window.clearTimeout(timer.current)
    setImage(null)

    const normalized = normalizeUrl(value)
    if (!normalized) {
      setLooking(false)
      return
    }

    setLooking(true)
    timer.current = window.setTimeout(async () => {
      lookupFor.current = normalized
      const preview = await fetchPreview(normalized)
      if (lookupFor.current !== normalized) return

      setLooking(false)
      setImage(preview.image)
      // Never overwrite what the poster has typed.
      if (preview.title) setTitle((current) => (current.trim() ? current : preview.title!))
    }, LOOKUP_DELAY_MS)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    const found = validateDraft(url, title, category, CATEGORY_IDS)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    try {
      await onSubmit({ url, title, category, image })
      reset()
    } catch (cause) {
      setErrors({ url: cause instanceof Error ? cause.message : 'That did not post.' })
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <Stub type="button" onClick={() => setOpen(true)} disabled={disabled}>
        <Plus size={18} strokeWidth={2} />
        Post a cool link
      </Stub>
    )
  }

  return (
    <Form onSubmit={submit} noValidate>
      <Field as="label">
        <FieldLabel as="span">Link</FieldLabel>
        <Input
          $bad={Boolean(errors.url)}
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setErrors((previous) => ({ ...previous, url: undefined }))
            scheduleLookup(event.target.value)
          }}
          placeholder="https://example.com/something-good"
          autoFocus
        />
        {errors.url && <FieldError>{errors.url}</FieldError>}
      </Field>

      {(looking || image) && (
        <Preview>
          {looking ? (
            <Tile $fallback>
              <PreviewSpinner as={Loader2} size={20} strokeWidth={2} />
            </Tile>
          ) : (
            <Thumb image={image} domain={domainOf(normalizeUrl(url) ?? '')} mode="compact" />
          )}
          <PreviewNote>
            {looking ? 'Looking up the page…' : 'Preview image found'}
          </PreviewNote>
        </Preview>
      )}

      <Field as="label">
        <FieldLabel as="span">Title</FieldLabel>
        <Input
          $bad={Boolean(errors.title)}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What is it, in a line?"
        />
        {errors.title && <FieldError>{errors.title}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Community</FieldLabel>
        <ChipRow>
          {CATEGORIES.map((option) => (
            <Chip
              key={option.id}
              type="button"
              $on={category === option.id}
              style={{ '--pill': option.color } as React.CSSProperties}
              aria-pressed={category === option.id}
              onClick={() => setCategory(option.id)}
            >
              l/{option.label}
            </Chip>
          ))}
        </ChipRow>
        {errors.category && <FieldError>{errors.category}</FieldError>}
      </Field>

      <FormActions>
        <Button type="button" $ghost onClick={reset}>
          Cancel
        </Button>
        <Button type="submit" $primary disabled={sending}>
          {sending && <Spinner as={Loader2} size={16} strokeWidth={2.5} />}
          {sending ? 'Posting' : 'Post'}
        </Button>
      </FormActions>
    </Form>
  )
}
