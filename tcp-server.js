const net = require('net')
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
      resolvePath(request.url)
      let response = new Response()
      let res = response.generateResponse(request)
      socket.write(res, 'utf-8', () => {
        console.log('Write complete')
        socket.end()
      })
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

function resolvePath (url) {
  url = (url === '/') ? './test/index.html' : (url === '/about') ? './test/about.html' : null
}
