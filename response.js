const fs = require('fs')
const path = require('path')

const status = {
  200: 'OK',
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error'
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
}

class Response {
  constructor () {
    this.version = 'HTTP/1.1'
    this.statusCode = 200
    this.statusMessage = status[this.statusCode]
    this.headers = {}
    this.body = ''
  }
  generateResponse (request, socket) {
    console.log('In Response class')
    this.setHeaders(request)
    console.log('Hey' + request.url)
    fs.readFile(request.url, 'utf-8', (err, data) => {
      if (err) {
        this.setStatus(404)
        this.writeToSocket(this.generateResStr(), socket)
        return
      } else if (data === undefined) {
        this.setStatus(400)
        this.writeToSocket(this.generateResStr(), socket)
        return
      }
      this.body = data
      this.writeToSocket(this.generateResStr(), socket)
    })
  }
  setHeaders (request) {
    this.getContentType(request)
    this.headers['Date'] = new Date()
  }
  generateResStr () {
    let str = ''
    str += this.version + ' ' + this.statusCode + ' ' + this.statusMessage + '\n'
    for (let i in this.headers) {
      if (this.headers.hasOwnProperty(i)) str += i + ': ' + this.headers[i] + '\n'
    }
    str += '\n' + this.body
    console.log('Oohhh' + str)
    return str
  }
  setStatus (code) {
    this.statusCode = code
    this.statusMessage = status[code]
    this.body = this.statusCode + ' ' + this.statusMessage
  }
  getContentType (request) {
    let ext = path.extname(request.url)
    this.headers['Content-Type'] = mimeTypes[ext]
  }
  writeToSocket (str, socket) {
    socket.write(str, 'utf-8', () => {
      console.log('Write complete')
      socket.end()
    })
  }
}

module.exports = Response
