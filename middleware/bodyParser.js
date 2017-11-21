const bodyParser = (req, res, next) => {
  if (req.headers['Content-Type'] === ' application/x-www-form-urlencoded') {
    req.body = parseUrlEncodedBody(req)
    next(req, res)
  } else if (req.headers['Content-Type'] === ' application/json') {
    req.body = parseJsonTypeBody(req)
    next(req, res)
  } else if (req.headers['Content-Type'] !== undefined && req.headers['Content-Type'].includes(' multipart/form-data')) {
    let [parsedBody, files] = parseMultipartFormData(req)
    req.body = parsedBody
    req.files = files
    next(req, res)
  } else next(req, res)
}

function parseUrlEncodedBody (req) {
  let values = req.body.split('&')
  let parsedBody = {}
  values.forEach((element) => {
    parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
  })
  return parsedBody
}

function parseJsonTypeBody (req) {
  let values = req.body.slice(1, req.body.length - 3).split(',')
  let parsedBody = {}
  values.forEach((element) => {
    parsedBody[element.split(':')[0].trim()] = element.split(':')[1].trim()
  })
  return parsedBody
}

function parseMultipartFormData (req) {
  let [parts, boundary] = getParts(req)
  return parseParts(parts, boundary)
}

function getParts (req) {
  let i = req.headers['Content-Type'].indexOf('=')
  let boundary = req.headers['Content-Type'].slice(i + 1)
  return [req.body.split('--' + boundary + '\r\n'), boundary]
}

function parseParts (parts, boundary) {
  let parsedBody = {}
  let files = {}
  parts.forEach((part) => {
    if (part.length !== 0) {
      let [headers, body] = part.split('\r\n\r\n')
      headers = headers.split('\r\n')
      body = body.slice(0, body.indexOf('--' + boundary))
      if (headers.length > 1) files = parsePartWithFile(headers, files, body)
      else {
      // Without Content-Type and file
        let key = headers[0].slice(headers[0].indexOf('=') + 1)
        parsedBody[key.slice(1, key.length - 1)] = body
      }
    }
  })
  return [parsedBody, files]
}

function parsePartWithFile (headersArr, files, body) {
  let i = (headersArr[0].indexOf('name') + 5)
  let j = headersArr[0].lastIndexOf(';')
  let key = headersArr[0].slice(i, j)
  files[key.slice(1, key.length - 1)] = Buffer.from(body)
  return files
}

module.exports = bodyParser