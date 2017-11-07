function parseRequest (reqStr, request) {
  reqStr = reqStr.split('\r\n')
  let msgBody, msgHead
  reqStr.map((line, i) => {
    if (line.length === 0 && msgHead === undefined) {
      msgHead = reqStr.slice(0, i)
      msgBody = reqStr.slice(i + 1)
    }
  })
  parseRequestLine(msgHead[0], request)
  parseRequestHeaders(msgHead.slice(1), request)
  parseRequestBody(msgBody, request)
  return request
}
function parseRequestLine (line, request) {
  let parts = line.split(' ')
  request.method = parts[0].trim()
  request.url = parseUrl(parts[1].trim())
  request.version = parts[2].trim()
}
function parseRequestHeaders (section, request) {
  let headers = {}
  section.forEach((item) => {
    let result = item.split(/:/)
    headers[result[0]] = result[1].trim()
  })
  request.headers = headers
}
function parseUrl (url) {
  let i = url.indexOf('?')
  return (i !== -1) ? url.slice(0, i) : url
}
function parseRequestBody (msgBody, request) {
  request.body = msgBody.toString().trim()
}

module.exports = parseRequest
