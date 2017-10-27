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
    if (request.headers['Content-Type'] === 'text/html') {
      console.log('Inside')
      let path = this.resolvePath(request.url)
      console.log('Path' + path)
      let data = fs.readFileSync(path, 'utf-8')
      this.body = data
      return this.generateResStr()
    } else {
      this.statusCode = 400
      this.statusMessage = status[this.statusCode]
      this.body = this.statusCode + ' ' + this.statusMessage
      return this.generateResStr()
    }
  }
  setHeaders (request) {
    let headers = {}
    headers['Content-Type'] = request.headers['Content-Type']
    headers['Date'] = new Date()
    this.headers = headers
  }
  resolvePath (url) {
    return (url === '/') ? './test/index.html' : './test/about.html'
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
}

module.exports = Response
