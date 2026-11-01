import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateSiteContent: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site content`)

    // Expire straight away so the first visit after a save already shows the change.
    revalidateTag('global_site-content', { expire: 0 })
  }

  return doc
}
