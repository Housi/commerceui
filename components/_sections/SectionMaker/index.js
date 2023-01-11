import React from 'react'

import SectionSvgBanner from '@/components/_sections/SectionSvgBanner'
import SectionMarqueeBanner from '@/components/_sections/SectionMarqueeBanner'
import SectionPortraitImages from '@/components/_sections/SectionPortraitImages'
import Section5050 from '@/components/_sections/Section5050'
import SectionImageText from '@/components/_sections/SectionImageText'
import SectionText from '@/components/_sections/SectionText'
import SectionNewsletterForm from '@/components/_sections/SectionNewsletterForm'
import SectionJournalText from '@/components/_sections/SectionJournalText'

const SectionMaker = ({ __typename, ...sectionProps }) => {
  switch (__typename) {
    case 'SectionMarqueeBanner':
      return <SectionMarqueeBanner {...sectionProps} />
    case 'SectionPortraitImages':
      return <SectionPortraitImages {...sectionProps} />
    case 'SectionNewsletterForm':
      return <SectionNewsletterForm />
    case 'SectionSvgBanner':
      return <SectionSvgBanner {...sectionProps} />
    case 'Section5050':
      return <Section5050 {...sectionProps} />
    case 'SectionImageText':
      return <SectionImageText {...sectionProps} />
    case 'SectionTextImage':
      return <SectionImageText {...sectionProps} isTextFirst />
    case 'SectionImageImage':
      return <SectionImageText {...sectionProps} />
    case 'SectionText':
      return <SectionText {...sectionProps} />
    case 'SectionJournalText':
      return <SectionJournalText {...sectionProps} />
    default:
      console.log(`Can't render type of section: ${__typename}`)
      return null
  }
}

export default SectionMaker
