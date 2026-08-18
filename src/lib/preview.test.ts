import { describe, expect, it } from 'vitest'
import { parsePreview } from './preview.ts'

const EMPTY = { title: null, image: null }

describe('parsePreview', () => {
  it('reads the title and image from a successful unfurl', () => {
    expect(
      parsePreview({
        status: 'success',
        data: { title: 'Excalidraw', image: { url: 'https://excalidraw.com/og.png' } },
      })
    ).toEqual({ title: 'Excalidraw', image: 'https://excalidraw.com/og.png' })
  })

  it('returns nothing for a failed or malformed payload', () => {
    expect(parsePreview({ status: 'fail', data: { title: 'x' } })).toEqual(EMPTY)
    expect(parsePreview({ status: 'success' })).toEqual(EMPTY)
    expect(parsePreview(null)).toEqual(EMPTY)
    expect(parsePreview('nope')).toEqual(EMPTY)
    expect(parsePreview({})).toEqual(EMPTY)
  })

  it('tolerates a page with a title but no image', () => {
    expect(parsePreview({ status: 'success', data: { title: 'Just text' } })).toEqual({
      title: 'Just text',
      image: null,
    })
  })

  // An http image would make the whole page mixed content.
  it('drops a non-https image', () => {
    expect(
      parsePreview({ status: 'success', data: { image: { url: 'http://example.com/a.png' } } })
    ).toEqual(EMPTY)
    expect(
      parsePreview({ status: 'success', data: { image: { url: 'not a url' } } })
    ).toEqual(EMPTY)
  })

  it('collapses whitespace in a title and drops an empty one', () => {
    expect(parsePreview({ status: 'success', data: { title: '  A   b\n c ' } }).title).toBe('A b c')
    expect(parsePreview({ status: 'success', data: { title: '   ' } }).title).toBeNull()
  })

  it('caps a runaway title at the length the form allows', () => {
    expect(parsePreview({ status: 'success', data: { title: 'x'.repeat(400) } }).title).toHaveLength(
      300
    )
  })

  it('ignores fields of the wrong type', () => {
    expect(parsePreview({ status: 'success', data: { title: 42, image: 'string' } })).toEqual(EMPTY)
  })
})
