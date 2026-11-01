import type { Field, GlobalConfig } from 'payload'

import { revalidateSiteContent } from './hooks/revalidateSiteContent'

// Option lists match the PALETTES, FONTS and STYLES arrays in the page script (template.ts).
const PALETTES = [
  'Fresh Coastal',
  'Warm Terracotta',
  'Midnight Gold',
  'Forest & Cream',
  'Berry Bold',
  'Slate & Citrus',
  'Blush Studio',
  'Electric Indigo',
  'Mono Ink',
  'Sunny Playful',
  'Brand Purple',
]
const FONTS = [
  'Modern Clean',
  'Elegant Editorial',
  'Friendly Rounded',
  'Bold Industrial',
  'Luxe Serif',
  'Playful',
  'Tech Geometric',
  'Classic Trust',
]

const textList = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: { description },
  fields: [{ name: 'text', type: 'text', required: true }],
})

const photo = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  admin: { description },
})

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site content',
  admin: {
    description: 'Everything shown on the Squeege ’n’ Shine home page. Save to update the site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business details',
          fields: [
            {
              name: 'company',
              type: 'group',
              label: false,
              fields: [
                { name: 'name', label: 'Business name', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'phone', type: 'text' },
                    { name: 'email', type: 'email' },
                  ],
                },
                { name: 'address', label: 'Address or service area', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'suburb', type: 'text' },
                    { name: 'city', type: 'text' },
                    { name: 'state', type: 'text' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'abn', label: 'ABN', type: 'text' },
                    { name: 'licence', label: 'Licence', type: 'text' },
                  ],
                },
                {
                  name: 'hours',
                  label: 'Opening hours',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'day', type: 'text', required: true },
                        { name: 'time', label: 'Hours', type: 'text', required: true },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'emoji',
              label: 'Logo icon',
              type: 'text',
              admin: {
                description: 'An emoji shown next to the business name when there is no logo.',
              },
            },
            photo('logo', 'Logo', 'Optional. Replaces the icon and business name in the header.'),
            {
              name: 'formEndpoint',
              label: 'Form endpoint',
              type: 'text',
              admin: {
                description:
                  'Optional. A Formspree address (e.g. https://formspree.io/f/abcdwxyz) to receive quote requests directly. Leave empty and the forms open the visitor’s email app instead.',
              },
            },
          ],
        },
        {
          label: 'Top of page',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: false,
              fields: [
                { name: 'eyebrow', label: 'Small heading', type: 'text' },
                { name: 'h1', label: 'Headline', type: 'text', required: true },
                { name: 'sub', label: 'Intro text', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'cta1', label: 'Main button', type: 'text' },
                    { name: 'cta2', label: 'Second button', type: 'text' },
                  ],
                },
                { name: 'note', label: 'Note under the buttons', type: 'text' },
                { name: 'formTitle', label: 'Quick quote form title', type: 'text' },
              ],
            },
            photo('heroImage', 'Main photo'),
            { name: 'heroImageAlt', label: 'Main photo description', type: 'text' },
            { name: 'heroBadge', label: 'Badge on the photo', type: 'text' },
            {
              name: 'stats',
              label: 'Highlights',
              type: 'array',
              maxRows: 4,
              admin: {
                description:
                  'The short facts under the top section. A number counts up when the page loads.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'n', label: 'Big text', type: 'text', required: true },
                    { name: 's', label: 'After the big text', type: 'text' },
                    { name: 'l', label: 'Label', type: 'text' },
                  ],
                },
              ],
            },
            textList('trust', 'Trust points', 'The row of short points under the highlights.'),
          ],
        },
        {
          label: 'Services',
          fields: [
            { name: 'servicesTitle', label: 'Section heading', type: 'text' },
            {
              name: 'services',
              type: 'array',
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/SiteContent/RowLabel#ServiceRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 't', label: 'Service name', type: 'text', required: true },
                    { name: 'i', label: 'Icon', type: 'text', admin: { width: '20%' } },
                    { name: 'badge', label: 'Badge', type: 'text', admin: { width: '30%' } },
                  ],
                },
                { name: 'd', label: 'Short description', type: 'textarea' },
                { name: 'more', label: 'Full description', type: 'textarea' },
                textList('inc', 'What’s included'),
                { name: 'ideal', label: 'Ideal for', type: 'text' },
                photo('photo', 'Photo'),
                { name: 'photoAlt', label: 'Photo description', type: 'text' },
                { name: 'q', type: 'text', admin: { hidden: true } },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'about',
              type: 'group',
              label: false,
              fields: [
                { name: 'title', label: 'Heading', type: 'text' },
                { name: 'text', type: 'textarea' },
                textList('bullets', 'Bullet points'),
              ],
            },
            photo('aboutImage', 'Photo'),
            { name: 'aboutImageAlt', label: 'Photo description', type: 'text' },
            {
              name: 'process',
              label: 'How it works',
              type: 'array',
              fields: [
                { name: 't', label: 'Step', type: 'text', required: true },
                { name: 'd', label: 'Description', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            {
              name: 'portfolio',
              label: 'Job photos',
              type: 'array',
              fields: [
                photo('image', 'Photo'),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cat',
                      label: 'Category',
                      type: 'select',
                      required: true,
                      defaultValue: 'Residential',
                      options: ['Residential', 'Commercial'],
                    },
                    { name: 'cap', label: 'Caption', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'credits',
              label: 'Photo credits',
              type: 'array',
              admin: {
                initCollapsed: true,
                description:
                  'Shown in the footer. Stock photos under CC BY or CC BY-SA must keep their credit.',
              },
              fields: [
                { name: 'title', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'creator', type: 'text' },
                    { name: 'licence', type: 'text' },
                  ],
                },
                { name: 'url', label: 'Link', type: 'text' },
                { name: 'file', type: 'text', admin: { hidden: true } },
              ],
            },
          ],
        },
        {
          label: 'Reviews & FAQ',
          fields: [
            {
              name: 'testimonials',
              label: 'Reviews',
              type: 'array',
              fields: [
                { name: 'q', label: 'Review', type: 'textarea', required: true },
                { name: 'n', label: 'Reviewer', type: 'text' },
              ],
            },
            {
              name: 'faq',
              label: 'FAQ',
              type: 'array',
              fields: [
                { name: 'q', label: 'Question', type: 'text', required: true },
                { name: 'a', label: 'Answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'cta',
              label: 'Call to action',
              type: 'group',
              fields: [
                { name: 'title', label: 'Heading', type: 'text' },
                { name: 'text', type: 'text' },
                { name: 'btn', label: 'Button', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Look',
          description:
            'The design the page starts with. Visitors can still try others in the Design options panel.',
          fields: [
            {
              name: 'defaults',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'palette',
                      label: 'Colour palette',
                      type: 'select',
                      options: PALETTES.map((label, i) => ({ label, value: String(i) })),
                    },
                    {
                      name: 'font',
                      label: 'Typography',
                      type: 'select',
                      options: FONTS.map((label, i) => ({ label, value: String(i) })),
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'style',
                      label: 'Design style',
                      type: 'select',
                      options: [
                        { label: 'Soft & modern', value: 'soft' },
                        { label: 'Bold & punchy', value: 'bold' },
                        { label: 'Glass & gradient', value: 'glass' },
                        { label: 'Editorial & refined', value: 'editorial' },
                      ],
                    },
                    {
                      name: 'imagery',
                      type: 'select',
                      options: [
                        { label: 'Photography', value: 'stock' },
                        { label: 'Cartoon / illustrated', value: 'cartoon' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'hero',
                      label: 'Top section layout',
                      type: 'select',
                      options: [
                        { label: 'Split', value: 'split' },
                        { label: 'Centred', value: 'centered' },
                      ],
                    },
                    {
                      name: 'mode',
                      type: 'select',
                      options: [
                        { label: 'Light', value: 'light' },
                        { label: 'Dark', value: 'dark' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Search engines',
          fields: [
            { name: 'seoTitle', label: 'Page title', type: 'text' },
            { name: 'seoDescription', label: 'Description', type: 'textarea' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteContent],
  },
}
