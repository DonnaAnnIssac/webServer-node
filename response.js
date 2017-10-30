const fs = require('fs')

const status = {
  200: 'OK',
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error'
}
class Response {
  constructor () {
    this.version = 'HTTP/1.1'
    this.statusCode = 200
    this.statusMessage = status[this.statusCode]
    this.headers = {}
    this.body = ''
  }
  generateResponse (request) {
    console.log('In Response class' + request, this)
    this.setHeaders(request)
    if (request.url === null) {
      this.setStatus(400)
      return this.generateResStr()
    }
    let data = fs.readFileSync(request.url, 'utf-8')
    if (data === undefined) {
      this.setStatus(404)
      return this.generateResStr()
    }
    this.body = data
    return this.generateResStr()
  }
  setHeaders (request) {
    let headers = {}
    headers['Content-Type'] = request.headers['Content-Type']
    headers['Date'] = new Date()
    this.headers = headers
  }
  generateResStr () {
    let str = ''
    str += this.version + ' ' + this.statusCode + ' ' + this.statusMessage + '\n'
    for (let i in this.headers) {
      console.log('Check' + i, this.headers[i])
      if (this.headers.hasOwnProperty(i)) str += i + ': ' + this.headers[i] + '\n'
    }
    str += '\n' + this.body
    return str
  }
  setStatus (code) {
    this.statusCode = code
    this.statusMessage = status[code]
    this.body = this.statusCode + ' ' + this.statusMessage
  }
}

module.exports = Response
