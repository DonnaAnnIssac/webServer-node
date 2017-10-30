const net = require('net')
const path = require('path')
const Request = require('./request.js')
const Response = require('./response.js')

const port = 9000

let server = net.createServer((socket) => {
  console.log('New client connection made')
  console.log(socket.remoteAddress + ':' + socket.remotePort)
  let request = new Request()
  let reqBody = ''
  socket.setEncoding('utf-8')
  socket.on('data', (data) => {
    reqBody += (data)
    if (reqBody.endsWith('\r\n\r\n')) {
      request.parseRequest(reqBody)
      resolvePath(request)
      console.log('Check again ' + request.url)
      let response = new Response()
      response.generateResponse(request, socket)
    }
  })
  socket.on('end', () => {
    console.log('End event')
  })
  socket.on('close', () => {
    console.log('Connection from ' + socket.remoteAddress + ' closed')
  })
})

server.listen(port, () => {
  console.log('Listening on port: ' + port)
})

server.on('error', (err) => {
  throw err
})

function resolvePath (req) {
  console.log('Check' + req.url)
  let ext = path.extname(req.url)
  req.url = (req.url === '/' || req.url === '/favicon.ico')
            ? './test/index.html' : (ext.length === 0)
            ? './test' + req.url + '.html' : './test' + req.url + ext
}
