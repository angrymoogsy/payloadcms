import type { Payload } from 'payload'

import type { SiteContent } from '@/payload-types'

import fs from 'fs/promises'
import path from 'path'

// Original content and photos taken from the live index.html (see seed/content.json).
const SEED_DIR = path.resolve(process.cwd(), 'src/SiteContent/seed')

type SeedContent = {
  company: Record<string, string> & { hours: [string, string][] }
  emoji: string
  defaults: {
    palette: number
    font: number
    style: string
    imagery: string
    hero: string
    mode: string
  }
  hero: Record<string, string>
  heroBadge: string
  trust: string[]
  stats: { n: string; s: string; l: string }[]
  servicesTitle: string
  services: {
    i: string
    t: string
    d: string
    badge?: string
    more: string
    inc: string[]
    ideal: string
    q?: string
  }[]
  about: { title: string; text: string; bullets: string[] }
  process: { t: string; d: string }[]
  testimonials: { q: string; n: string }[]
  faq: { q: string; a: string }[]
  cta: { title: string; text: string; btn: string }
  shots: string[]
  credits: { title: string; creator: string; licence: string; url: string; file: string }[]
  images: { hero: string; about: string; services: string[] }
  portfolio: { cat: 'Residential' | 'Commercial'; cap: string; file: string }[]
  seoTitle: string
  seoDescription: string
}

const toTextList = (items: string[]) => items.map((text) => ({ text }))

export const seedSiteContent = async (payload: Payload): Promise<void> => {
  try {
    const existing = await payload.findGlobal({ slug: 'site-content', depth: 0 })
    if (existing?.company?.name) return

    payload.logger.info('Adding the Squeege ’n’ Shine content to Site content...')
    const seed: SeedContent = JSON.parse(
      await fs.readFile(path.join(SEED_DIR, 'content.json'), 'utf8'),
    )

    const upload = async (file: string, alt: string): Promise<number> => {
      const found = await payload.find({
        collection: 'media',
        where: { filename: { equals: file } },
        limit: 1,
        depth: 0,
      })
      if (found.docs[0]) return found.docs[0].id
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.join(SEED_DIR, 'images', file),
      })
      return doc.id
    }

    const shots = seed.shots
    const heroImage = await upload(seed.images.hero, shots[0])
    const aboutImage = await upload(seed.images.about, shots[1])
    const servicePhotos: number[] = []
    for (const [i, file] of seed.images.services.entries()) {
      servicePhotos.push(await upload(file, seed.services[i].t))
    }
    const portfolioPhotos: number[] = []
    for (const p of seed.portfolio) {
      portfolioPhotos.push(await upload(p.file, p.cap))
    }

    const { hours, ...company } = seed.company

    await payload.updateGlobal({
      slug: 'site-content',
      context: { disableRevalidate: true },
      data: {
        company: {
          name: company.name,
          phone: company.phone,
          email: company.email,
          address: company.address,
          suburb: company.suburb,
          city: company.city,
          state: company.state,
          abn: company.abn,
          licence: company.licence,
          hours: hours.map(([day, time]) => ({ day, time })),
        },
        emoji: seed.emoji,
        hero: {
          eyebrow: seed.hero.eyebrow,
          h1: seed.hero.h1,
          sub: seed.hero.sub,
          cta1: seed.hero.cta1,
          cta2: seed.hero.cta2,
          note: seed.hero.note,
          formTitle: seed.hero.formTitle,
        },
        heroImage,
        heroImageAlt: shots[0],
        heroBadge: seed.heroBadge,
        stats: seed.stats,
        trust: toTextList(seed.trust),
        servicesTitle: seed.servicesTitle,
        services: seed.services.map((s, i) => ({
          i: s.i,
          t: s.t,
          badge: s.badge,
          d: s.d,
          more: s.more,
          inc: toTextList(s.inc),
          ideal: s.ideal,
          photo: servicePhotos[i],
          // The page also uses these descriptions for its fallback gallery.
          photoAlt: shots[i + 2] ?? s.t,
          q: s.q,
        })),
        about: { ...seed.about, bullets: toTextList(seed.about.bullets) },
        aboutImage,
        aboutImageAlt: shots[1],
        process: seed.process,
        portfolio: seed.portfolio.map((p, i) => ({
          image: portfolioPhotos[i],
          cat: p.cat,
          cap: p.cap,
        })),
        credits: seed.credits,
        testimonials: seed.testimonials,
        faq: seed.faq,
        cta: seed.cta,
        defaults: {
          ...seed.defaults,
          palette: String(seed.defaults.palette),
          font: String(seed.defaults.font),
        } as SiteContent['defaults'],
        seoTitle: seed.seoTitle,
        seoDescription: seed.seoDescription,
      },
    })
    payload.logger.info('Site content added.')
  } catch (err) {
    payload.logger.error({ err, msg: 'Could not add the Squeege ’n’ Shine content' })
  }
}
