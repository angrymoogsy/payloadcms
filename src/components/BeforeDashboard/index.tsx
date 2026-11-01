import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

// The template's "Seed your database" button was removed here: it deletes every
// media file, including the Squeege ’n’ Shine photos.
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Squeege ’n’ Shine</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          {'To change the website, open '}
          <a href="/admin/globals/site-content">Site content</a>
          {', edit any tab, then click Save.'}
        </li>
        <li>
          {'Add or replace photos in the same place, or in '}
          <a href="/admin/collections/media">Media</a>.
        </li>
        <li>
          <a href="/" target="_blank">
            View the website
          </a>
          {' to see your changes.'}
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
