function parseUrlEncodedBody (req, res, next) {
  if (req.headers['Content-Type'] === ' application/x-www-form-urlencoded') {
    let values = req.body.toString().split('&')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
    })
    req.body = parsedBody
  }
  next(req, res)
}

function parseJsonTypeBody (req, res, next) {
  if (req.headers['Content-Type'] === ' application/json') {
    let values = req.body.toString().slice(1, req.body.length - 3).split(',')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split(':')[0].trim()] = element.split(':')[1].trim()
    })
    req.body = parsedBody
  }
  next(req, res)
}

function parseMultipartFormData (req, res, next) {
  if (req.headers['Content-Type'] !== undefined && req.headers['Content-Type'].includes(' multipart/form-data')) {
    let [parts, boundary] = getParts(req)
    let [parsedBody, files] = parseParts(parts, boundary)
    req.body = parsedBody
    req.files = files
  }
  next(req, res)
}

function getParts (req) {
  let i = req.headers['Content-Type'].indexOf('=')
  let boundary = req.headers['Content-Type'].slice(i + 1)
  return [req.body.toString().split('--' + boundary + '\r\n'), boundary]
}

function parseParts (parts, boundary) {
  let parsedBody = {}
  let files = {}
  parts.forEach((part) => {
    if (part.length !== 0) {
      let [headers, body] = part.split('\r\n\r\n')
      headers = headers.split('\r\n')
      if (headers[0].includes('filename')) [files, parsedBody] = parsePartWithFile(headers, files, parsedBody, body)
      else {
      // Without file
        let key = headers[0].slice(headers[0].indexOf('=') + 1)
        parsedBody[key.slice(1, key.length - 1)] = body
      }
    }
  })
  return [parsedBody, files]
}

function parsePartWithFile (headersArr, files, parsedBody, body) {
  let i = (headersArr[0].indexOf('name') + 5)
  let j = headersArr[0].lastIndexOf(';')
  let key = headersArr[0].slice(i, j)
  i = headersArr[0].indexOf('filename') + 10
  let fname = headersArr[0].slice(i, headersArr[0].lastIndexOf('"'))
  files[key.slice(1, key.length - 1)] = Buffer.from(body)
  parsedBody['filename'] = fname
  return [files, parsedBody]
}

module.exports = {parseUrlEncodedBody, parseJsonTypeBody, parseMultipartFormData}
