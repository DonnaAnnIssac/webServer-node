function parseUrlEncodedBody (req, res, next) {
  if (req.headers['content-type'] === ' application/x-www-form-urlencoded') {
    let values = req.body.toString().split('&')
    let parsedBody = {}
    values.forEach((element) => {
      parsedBody[element.split('=')[0]] = element.split('=')[1].replace('+', ' ')
    })
    req.body = parsedBody
  }
  next(req, res)
}

function parsePlainTextBody (req, res, next) {
  if (req.headers['content-type'] === ' text/plain') req.body = req.body.toString()
  next(req, res)
}

function parseJsonTypeBody (req, res, next) {
  if (req.headers['content-type'] === ' application/json') {
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
  console.log('aaaaaaaaaaa', req)
  if (req.headers['content-type'] !== undefined && req.headers['content-type'].includes(' multipart/form-data')) {
    console.log('Parsing')
    let [parts, boundary] = getParts(req)
    console.log(Array.isArray(parts))
    let [parsedBody, files] = parseParts(parts, boundary)
    req.body = parsedBody
    req.files = files
  }
  next(req, res)
}

function getParts (req) {
  let i = req.headers['content-type'].indexOf('=')
  let boundary = req.headers['content-type'].slice(i + 1)
  console.log(Buffer.isBuffer(req.body))
  let parts = []
  let copy = req.body
  while (copy.indexOf('--' + boundary + '--') !== 0) {
    let part = copy.slice(boundary.length + 4, copy.indexOf('--', boundary.length + 4))
    parts.push(part)
    copy = copy.slice(boundary.length + 4 + part.length)
  }
  // parts = parts.map((part) => {
  //   if (part.includes('--' + boundary + '--')) {
  //     // console.log(part.slice(0, part.indexOf('--' + boundary + '--')))
  //     return part.slice(0, part.indexOf('--' + boundary + '--'))
  //   } else return part
  // })
  console.log(Array.isArray(parts))
  console.log('Parts Array: ')
  console.log(parts)
  return [parts, boundary]
}

function parseParts (parts, boundary) {
  // let parsedBody = {}
  // let files = {}
  // let fname = ''
  // let filesArr = []
  parts.forEach((part) => {
    if (part.length !== 0) {
      let headers = part.slice(0, part.indexOf('\r\n\r\n'))
      let body = part.slice(part.indexOf('\r\n\r\n') + 4)
      console.log(Buffer.isBuffer(body))
      // console.log('HEADER:', headers.toString())
      console.log(body)
      // headers = headers.split('\r\n')
      // if (headers[0].includes('filename')) { // Parts with file
      //   [files, fname] = parsePartWithFile(headers, files, body)
      //   filesArr.push(fname)
      // } else { // Parts without file
      //   let key = headers[0].slice(headers[0].indexOf('=') + 1)
      //   parsedBody[key.slice(1, key.length - 1)] = body
      // }
    }
  })
  // parsedBody['filenames'] = filesArr
  // return [parsedBody, files]
}

function parsePartWithFile (headersArr, files, body) {
  let key = headersArr[0].slice((headersArr[0].indexOf('name') + 5), headersArr[0].lastIndexOf(';'))
  let fname = headersArr[0].slice(headersArr[0].indexOf('filename') + 10, headersArr[0].lastIndexOf('"'))
  console.log(typeof body)
  files[key.slice(1, key.length - 1)] = Buffer.from(body)
  console.log(Buffer.isBuffer(files[key.slice(1, key.length - 1)]))
  return [files, fname]
}

module.exports = {
  parseUrlEncodedBody,
  parseJsonTypeBody,
  parsePlainTextBody,
  parseMultipartFormData
}
