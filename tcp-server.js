const net = require('net')
const path = require('path')
const Request = require('./request.js')
const Response = require('./response.js')

const port = 9000

let server = net.createServer((socket) => {
  console.log('New client connection made')
  console.log(socket.remoteAddress + ':' + socket.remotePort)
  let reqBody = ''
  socket.on('data', (data) => {
    reqBody += data
    if (reqBody.endsWith('\r\n\r\n')) {
      let request = new Request()
      request.parseRequest(reqBody)
      reqBody = ''
      console.log(request)
      resolvePath(request)
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
  socket.on('error', err => {
    console.log(err)
  })
})

server.listen(port, () => {
  console.log('Listening on port: ' + port)
})

server.on('error', (err) => {
  throw err
})

function resolvePath (req) {
  let ext = path.extname(req.url)
  req.url = (req.url === '/')
            ? './test/index.html' : (ext.length === 0)
            ? './test' + req.url + '.html' : './test' + req.url
  console.log(req.url)
}
