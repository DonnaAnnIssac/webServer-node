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
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mp3',
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
  }
  generateResponse (request, socket) {
    this.setHeaders(request)
    fs.readFile(request.url, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          this.setStatus(404)
          this.writeToSocket(this.generateResStr(), socket, request)
          return
        } else {
          this.setStatus(500)
          this.writeToSocket(this.generateResStr(), socket, request)
          return
        }
      } else if (data === undefined) {
        this.setStatus(400)
        this.writeToSocket(this.generateResStr(), socket, request)
        return
      }
      this.body = data
      this.headers['Content-Length'] = this.body.byteLength
      this.writeToSocket(this.generateResStr(), socket, request)
    })
  }
  setHeaders (request) {
    this.setContentType(request)
    this.headers['Date'] = new Date()
    this.headers['Connection'] = request.headers['Connection'] || 'keep-alive'
  }
  generateResStr () {
    let str = ''
    str += this.version + ' ' + this.statusCode + ' ' + this.statusMessage + '\n'
    for (let i in this.headers) {
      if (this.headers.hasOwnProperty(i)) str += i + ': ' + this.headers[i] + '\n'
    }
    str += '\n'
    return str
  }
  setStatus (code) {
    this.statusCode = code
    this.statusMessage = status[code]
  }
  setContentType (request) {
    let ext = path.extname(request.url)
    this.headers['Content-Type'] = mimeTypes[ext]
  }
  writeToSocket (str, socket, request) {
    socket.write(str, (err) => {
      if (err) console.log('ERR IN WRITE:', err)
      socket.write(this.body, err => {
        if (err) console.log('ERR IN WRITE:', err)
        console.log('Write complete')
        if (this.headers['Connection'] === 'close') socket.destroy()
      })
    })
  }
}

module.exports = Response
