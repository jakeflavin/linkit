import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { CATEGORIES, CATEGORY_IDS } from '../data/categories.ts'
import { validateDraft, type DraftErrors } from '../lib/url.ts'

interface SubmitCardProps {
  onSubmit: (url: string, title: string, category: string) => Promise<void>
  disabled: boolean
}

/** The compose box at the top of the feed — Reddit's "Create post" row. */
export function SubmitCard({ onSubmit, disabled }: SubmitCardProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<DraftErrors>({})
  const [sending, setSending] = useState(false)

  const reset = () => {
    setUrl('')
    setTitle('')
    setCategory('')
    setErrors({})
    setOpen(false)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    const found = validateDraft(url, title, category, CATEGORY_IDS)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    try {
      await onSubmit(url, title, category)
      reset()
    } catch (cause) {
      setErrors({ url: cause instanceof Error ? cause.message : 'That did not post.' })
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="compose-stub"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Plus size={18} strokeWidth={2} />
        Post a cool link
      </button>
    )
  }

  return (
    <form className="compose" onSubmit={submit} noValidate>
      <label className="field">
        <span className="field-label">Link</span>
        <input
          className={`field-input${errors.url ? ' is-bad' : ''}`}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/something-good"
          autoFocus
        />
        {errors.url && <span className="field-error">{errors.url}</span>}
      </label>

      <label className="field">
        <span className="field-label">Title</span>
        <input
          className={`field-input${errors.title ? ' is-bad' : ''}`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What is it, in a line?"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <fieldset className="field">
        <legend className="field-label">Community</legend>
        <div className="chip-row">
          {CATEGORIES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`chip${category === option.id ? ' is-on' : ''}`}
              style={{ '--pill': option.color } as React.CSSProperties}
              aria-pressed={category === option.id}
              onClick={() => setCategory(option.id)}
            >
              l/{option.label}
            </button>
          ))}
        </div>
        {errors.category && <span className="field-error">{errors.category}</span>}
      </fieldset>

      <div className="compose-actions">
        <button type="button" className="btn ghost" onClick={reset}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={sending}>
          {sending && <Loader2 size={16} className="spin" strokeWidth={2.5} />}
          {sending ? 'Posting' : 'Post'}
        </button>
      </div>
    </form>
  )
}
