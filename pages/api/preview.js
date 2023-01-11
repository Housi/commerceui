import fetchUtilityPageByHandle from '../../data/contentful/fetchUtilityPageByHandle'
import fetchHome from '../../data/contentful/fetchHome'
import fetchEditorialCollectionByHandle from '../../data/contentful/fetchEditorialCollectionByHandle'
import fetchJournalEntryByHandle from '@/data/contentful/fetchJournalEntryByHandle'

export default async function preview(req, res) {
  const { secret, slug, id, type } = req.query

  if (secret !== process.env.NEXT_PRIVATE_CONTENTFUL_PREVIEW_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  let page = null
  let previewData = {}
  let url = '/'

  switch (type) {
    case 'home':
      page = await fetchHome(id)
      previewData.entryId = id
      previewData.message = page.name
      break
    case 'collection':
      page = await fetchEditorialCollectionByHandle(slug, true)
      previewData.message = `${slug}`
      url = `/collections/${slug}`
      break
    case 'utility':
      page = await fetchUtilityPageByHandle(slug)
      previewData.message = `${page.title}`
      url = `/${slug}`
      break
    case 'journalEntry':
      page = await fetchJournalEntryByHandle(slug)
      previewData.message = `${page.title}`
      url = `/journal/${slug}`
      break
    default:
      return res.status(401).json({ message: 'Wrong preview data provided' })
      break
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(previewData)

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  // res.writeHead(307, { Location: `/posts/${post.slug}` })

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>`
  )
  res.end()
}
