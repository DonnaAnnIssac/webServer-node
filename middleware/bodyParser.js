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
    // console.log('Body\n' + req.body)
    // console.log('Files\n' + req.files)
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
  // console.log('Parts')
  // console.log(parts)
  return parseParts(parts, boundary)
}

function getParts (req) {
  let i = req.headers['Content-Type'].indexOf('=')
  let boundary = req.headers['Content-Type'].slice(i + 1)
  // console.log('Boundary')
  // console.log(boundary)
  return [req.body.split('--' + boundary + '\r\n'), boundary]
}

function parseParts (parts, boundary) {
  let parsedBody = {}
  let files = {}
  parts.forEach((part) => {
    if (part.length !== 0) {
      let [headers, body] = part.split('\r\n\r\n')
      headers = headers.split('\r\n')
      // console.log('Part headers\n' + headers)
      // console.log(headers.length)
      body = body.slice(0, body.indexOf('--' + boundary))
      // console.log('Part body\n' + body)
      if (headers.length > 1) files = parsePartWithFile(headers, files, body)
      else {
      // Without Content-Type and file
        let key = headers[0].slice(headers[0].indexOf('=') + 1)
        // console.log('Key\n' + key.slice(1, key.length - 1))
        parsedBody[key.slice(1, key.length - 1)] = body
        // console.log(parsedBody[key.slice(1, key.length - 1)])
      }
    }
  })
  return [parsedBody, files]
}

function parsePartWithFile (headersArr, files, body) {
  // console.log(headersArr[0])
  let i = (headersArr[0].indexOf('name') + 5)
  let j = headersArr[0].lastIndexOf(';')
  // console.log(i, j)
  let key = headersArr[0].slice(i, j)
  // console.log('Key\n' + key)
  files[key.slice(1, key.length - 1)] = Buffer.from(body)
  // console.log(files[key.slice(1, key.length - 1)])
  return files
}

module.exports = bodyParser
