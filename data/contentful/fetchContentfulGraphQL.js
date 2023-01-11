const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const previewAccessToken = process.env.NEXT_PRIVATE_CONTENTFUL_PREVIEW_TOKEN;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchContentfulGraphQL(query, preview = false) {

  let isFirst = true;
  let response;

  do {
    if (!isFirst) {
      console.log('Error while contentful fetching, sleeping 5s...', query);
      await sleep(5000);
      console.log('Wake up');
      console.log(response);
    }

    response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${space}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            preview
              ? previewAccessToken
              : accessToken
            }`,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (response.errors) {
      console.log("\x1b[31m","###RESPONSE ERRORS" + JSON.stringify(response.errors));
    }

    isFirst = false;

  } while (response.status !== 200);


  return response.json()
}

export default fetchContentfulGraphQL