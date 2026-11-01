import { getCachedGlobal } from '@/utilities/getGlobals'
import { template } from '@/SiteContent/template'
import { toSiteData } from '@/SiteContent/toSiteData'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Safe inside <script type="application/json">: no "</script>" or HTML comment can break out.
const toScriptJson = (data: unknown) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

// The home page is the original Squeege ’n’ Shine page, filled with the Site content global.
export async function GET() {
  const doc = await getCachedGlobal('site-content', 1)()

  const html = template
    .replace('__SITE_DATA__', () => toScriptJson(toSiteData(doc)))
    .replace('__SEO_TITLE__', () => escapeHtml(doc.seoTitle || doc.company?.name || ''))
    .replace('__SEO_DESCRIPTION__', () => escapeHtml(doc.seoDescription || ''))

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
