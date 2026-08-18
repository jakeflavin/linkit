import { describe, expect, it } from 'vitest'
import { domainOf, normalizeUrl, validateDraft } from './url.ts'

const CATEGORIES = ['tools', 'fun']

describe('normalizeUrl', () => {
  it('keeps a well-formed https url', () => {
    expect(normalizeUrl('https://example.com/a')).toBe('https://example.com/a')
  })

  it('assumes https for a bare host', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/')
  })

  it('upgrades http rather than rejecting it', () => {
    expect(normalizeUrl('http://example.com/')).toBe('https://example.com/')
  })

  it('drops the fragment so the same page is one link', () => {
    expect(normalizeUrl('https://example.com/a#top')).toBe('https://example.com/a')
  })

  it('rejects input that is not a web address', () => {
    expect(normalizeUrl('')).toBeNull()
    expect(normalizeUrl('   ')).toBeNull()
    expect(normalizeUrl('localhost')).toBeNull()
    expect(normalizeUrl('just some words')).toBeNull()
    expect(normalizeUrl('javascript:alert(1)')).toBeNull()
    expect(normalizeUrl('ftp://example.com')).toBeNull()
  })
})

describe('domainOf', () => {
  it('strips www and lowercases', () => {
    expect(domainOf('https://WWW.Example.com/x')).toBe('example.com')
  })

  it('keeps other subdomains', () => {
    expect(domainOf('https://docs.example.com')).toBe('docs.example.com')
  })

  it('returns empty for an unparseable url', () => {
    expect(domainOf('nonsense')).toBe('')
  })
})

describe('validateDraft', () => {
  it('accepts a complete draft', () => {
    expect(validateDraft('https://example.com', 'A thing', 'tools', CATEGORIES)).toEqual({})
  })

  it('reports every missing field at once', () => {
    const errors = validateDraft('', '', '', CATEGORIES)
    expect(Object.keys(errors).sort()).toEqual(['category', 'title', 'url'])
  })

  it('rejects a category that is not on the list', () => {
    expect(validateDraft('https://example.com', 'A thing', 'ghost', CATEGORIES).category).toBe(
      'Pick a community.'
    )
  })

  it('rejects an over-long title', () => {
    expect(validateDraft('https://example.com', 'x'.repeat(301), 'fun', CATEGORIES).title).toMatch(
      /cap/
    )
  })
})
