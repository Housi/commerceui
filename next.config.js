const path = require('path')
const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN

const query = `
query redirectCollectionQuery {
  redirectCollection {
    items {
      destination
      permanent
      source
    }
  }
}`
async function fetchAllRedirects() {
  const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${space}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query })
  })

  if (response.errors) {
    console.log('\x1b[31m', '###RESPONSE ERRORS' + JSON.stringify(response.errors))
  }

  const _response = await response.json()

  const redirects = _response?.data?.redirectCollection?.items ?? null

  console.log(`${redirects.length} redirects fetched from Contentful`)

  return redirects
}

module.exports = {
  target: 'serverless',
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  images: {
    deviceSizes: [420, 768, 1024, 1400, 1600, 1920, 2560],
    imageSizes: [105, 210],
    domains: ['image.mux.com', 'cdn.shopify.com', 'images.ctfassets.net']
  },
  async redirects() {
    return await fetchAllRedirects()
  }
}
