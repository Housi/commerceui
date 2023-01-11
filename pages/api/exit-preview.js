export default async function exit(_, res) {

  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  // Redirect the user back to current page
  res.writeHead(307, { Location: _.headers.referer })
  res.end()
}
