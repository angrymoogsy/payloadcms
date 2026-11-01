'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ServiceRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<{ i?: string | null; t?: string | null }>()
  const name = data?.data?.t
  return <div>{name ? `${data.data.i ? data.data.i + ' ' : ''}${name}` : 'Service'}</div>
}
