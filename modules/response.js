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
  constructor (request) {
    this.version = 'HTTP/1.1'
    this.statusCode = 200
    this.statusMessage = status[this.statusCode]
    this.socket = request.socket
    this.headers = {}
    setHeaders(request, this)
  }
  setStatus (code) {
    this.statusCode = code
    this.statusMessage = status[code]
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
  setContentType (url) {
    let ext = path.extname(url)
    this.headers['Content-Type'] = mimeTypes[ext]
  }
  send () {
    this.headers['Content-Length'] = this.body.byteLength
    this.socket.write(this.generateResStr(), (err) => {
      if (err) console.log('ERR IN WRITE:', err)
      this.socket.write(this.body, err => {
        if (err) console.log('ERR IN WRITE:', err)
        console.log('Write complete')
        if (this.headers['Connection'] === 'close') this.close()
      })
    })
  }
}

function setHeaders (request, response) {
  response.headers['Date'] = new Date()
  response.headers['Connection'] = request.headers['Connection'] || 'keep-alive'
}

module.exports = Response
