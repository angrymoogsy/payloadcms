import type { Media, SiteContent } from '@/payload-types'

// The page script (template.ts) reads one JSON object shaped like the original
// index.html's site-data block. This rebuilds that object from the Site content global.

const url = (m: number | Media | null | undefined) =>
  m && typeof m === 'object' ? m.url || '' : ''
const texts = (items: { text: string }[] | null | undefined) => (items || []).map((i) => i.text)
// The page counts up stats whose value is a number.
const statValue = (n: string) => (/^\d+(\.\d+)?$/.test(n.trim()) ? Number(n) : n)

export const toSiteData = (doc: SiteContent) => {
  const services = doc.services || []
  const logo = url(doc.logo)

  return {
    company: {
      name: doc.company?.name || '',
      suburb: doc.company?.suburb || '',
      city: doc.company?.city || '',
      state: doc.company?.state || '',
      phone: doc.company?.phone || '',
      email: doc.company?.email || '',
      address: doc.company?.address || '',
      abn: doc.company?.abn || '',
      licence: doc.company?.licence || '',
      role: '',
      hours: (doc.company?.hours || []).map((h) => [h.day, h.time]),
    },
    emoji: doc.emoji || '',
    ...(logo ? { logo } : {}),
    // Fixed settings from the original page: illustration prop, build-stack pick, not a demo.
    prop: 'bucket',
    stack: 1,
    demo: false,
    formEndpoint: doc.formEndpoint || '',
    defaults: {
      palette: Number(doc.defaults?.palette ?? 0),
      font: Number(doc.defaults?.font ?? 0),
      style: doc.defaults?.style || 'glass',
      imagery: doc.defaults?.imagery || 'stock',
      hero: doc.defaults?.hero || 'split',
      mode: doc.defaults?.mode || 'light',
    },
    hero: {
      eyebrow: doc.hero?.eyebrow || '',
      h1: doc.hero?.h1 || '',
      sub: doc.hero?.sub || '',
      cta1: doc.hero?.cta1 || '',
      cta2: doc.hero?.cta2 || '',
      note: doc.hero?.note || '',
      formTitle: doc.hero?.formTitle || '',
    },
    heroBadge: doc.heroBadge || '',
    trust: texts(doc.trust),
    stats: (doc.stats || []).map((s) => ({ n: statValue(s.n), s: s.s || '', l: s.l || '' })),
    servicesTitle: doc.servicesTitle || '',
    services: services.map((s) => ({
      i: s.i || '',
      t: s.t,
      d: s.d || '',
      ...(s.badge ? { badge: s.badge } : {}),
      ...(s.q ? { q: s.q } : {}),
      more: s.more || '',
      inc: texts(s.inc),
      ideal: s.ideal || '',
    })),
    about: {
      title: doc.about?.title || '',
      text: doc.about?.text || '',
      bullets: texts(doc.about?.bullets),
    },
    process: (doc.process || []).map((p) => ({ t: p.t, d: p.d || '' })),
    testimonials: (doc.testimonials || []).map((t) => ({ q: t.q, n: t.n || '' })),
    faq: (doc.faq || []).map((f) => ({ q: f.q, a: f.a })),
    cta: { title: doc.cta?.title || '', text: doc.cta?.text || '', btn: doc.cta?.btn || '' },
    // Photo descriptions: [main photo, about photo, then one per service].
    shots: [
      doc.heroImageAlt || '',
      doc.aboutImageAlt || '',
      ...services.map((s) => s.photoAlt || s.t),
    ],
    photos: [url(doc.heroImage), url(doc.aboutImage)],
    svcPhotos: services.map((s) => url(s.photo)),
    credits: (doc.credits || []).map((c) => ({
      title: c.title || '',
      creator: c.creator || '',
      licence: c.licence || '',
      url: c.url || '',
      file: c.file || '',
    })),
    portfolio: (doc.portfolio || [])
      .filter((p) => url(p.image))
      .map((p) => ({ cat: p.cat, cap: p.cap || '', src: url(p.image) })),
  }
}
