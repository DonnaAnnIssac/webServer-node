class Request {
  constructor (method, url, version) {
    this.method = method || 'GET'
    this.url = url || '/'
    this.version = version || 'HTTP/1.1'
    this.headers = {}
    this.body = ''
  }
  parseRequest (reqBody) {
    var msgBody, msgHead
    reqBody = reqBody.split('\r\n')
    console.log(reqBody)
    reqBody.pop()
    reqBody.map((line, i) => {
      if (line.length === 0 && msgHead === undefined) {
        msgHead = reqBody.slice(0, i)
        msgBody = reqBody.slice(i + 1)
      }
    })
    this.parseRequestLine(msgHead[0])
    this.parseRequestHeaders(msgHead.slice(1))
    this.body = msgBody.toString().trim()
    console.log(this)
    return this
  }
  parseRequestLine (line) {
    var parts = line.split(' ')
    this.method = parts[0].trim()
    this.url = parts[1].trim()
    this.version = parts[2].trim()
  }
  parseRequestHeaders (line) {
    var headers = {}
    line.forEach((item) => {
      var result = item.split(/:/)
      headers[result[0]] = result[1].trim()
    })
    this.headers = headers
  }
}

module.exports = Request
