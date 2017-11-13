function parseRequest (headerStr) {
  let arr = headerStr.split('\r\n')
  let reqLine = arr.shift().split(' ')
  let headerObj = {}
  headerObj['Method'] = reqLine[0]
  headerObj['Path'] = parseUrl(reqLine[1])
  headerObj['Version'] = reqLine[2]
  let headers = {}
  arr.forEach((element) => {
    let header = element.split(':')
    headers[header[0]] = header[1]
  })
  headerObj['Headers'] = headers
  return headerObj
}

function parseUrl (url) {
  let i = url.indexOf('?')
  return (i !== -1) ? url.slice(0, i) : url
}

module.exports = parseRequest
