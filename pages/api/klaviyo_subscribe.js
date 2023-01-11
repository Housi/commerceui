require('isomorphic-fetch');

async function subscribe(body) {
  // Default options are marked with *
  const response = await fetch("https://a.klaviyo.com/api/v2/list/TpNWL5/subscribe?api_key=pk_bbb4f19dac8bfb8baf353f3b99d0176cab", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  console.log('#1 fetch response', response);
  let res = await response.json();
  console.log('#2 res', res)
  return {content: response.statusText, status: response.status}
}


export default async (req, res) => {

  const response = await subscribe(req.body);

  console.log('#3 subscribe response', response);

  res.status(response.status).json({response});

}