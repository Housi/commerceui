require('isomorphic-fetch');



async function subscribeToWaitlist(body) {
  // Default options are marked with *
  const response = await fetch("https://a.klaviyo.com/api/v1/catalog/subscribe", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body
  });

  let res = await response.json();
  return {content: res, status: response.status}
}


export default async (req, res) => {

  const response = await subscribeToWaitlist(req.body);

  // console.log(response)

  // res.status(response.status)
  // res.send(response.content)
  // res.end(`klaviyo response content`);
  console.log('#3 waitlist response', response);

  res.status(response.status).json({response});


  //
  // res.status('200')
  // res.send({success: true, message: 'ok'})
  // res.end(`klaviyo response content`);
}