import fetchContentfulGraphQL from './fetchContentfulGraphQL'

function extract(response) {
  return response?.data?.redirectCollection?.items ?? null
}

async function fetchAllRedirects() {
  const response = await fetchContentfulGraphQL(`
    query redirectCollectionQuery {
      redirectCollection {
        items {
          destination
          permanent
          source
        }
      }
    }
`)

  console.log(response)
  return extract(response)
}

export default fetchAllRedirects
