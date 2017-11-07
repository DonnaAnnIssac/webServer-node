const net = require('net')
const Request = require('./request')
const Response = require('./response')
const port = 9000

let server = net.createServer((socket) => {
  console.log('New client connection made')
  console.log(socket.remoteAddress + ':' + socket.remotePort)
  let reqStr = ''
  socket.on('data', (data) => {
    reqStr += data
    if (reqStr.includes('Content-Length')) {
      console.log('Inside POST')
      let len = findContentLength(reqStr)
      let arr = findContent(reqStr)
      if (parseInt(len) === arr[1]) {
        createReqAndRes(reqStr, socket)
        reqStr = ''
      }
    }
    if (reqStr.endsWith('\r\n\r\n')) {
      createReqAndRes(reqStr, socket)
      reqStr = ''
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

function findContentLength (reqStr) {
  let str = reqStr.slice(reqStr.indexOf('Content-Length'))
  let arr = str.slice(0, str.search('\r\n')).split(' ')
  return arr[1]
}

function findContent (reqStr) {
  let i = reqStr.search('\r\n\r\n')
  return [reqStr.slice(i + 4), reqStr.slice(i + 4).length]
}
function next (req, res, socket) {
  let handler = (req.method === 'GET') ? req.handlers.shift() : req.handlers.pop()
  handler(req, res, socket, next)
}

function createReqAndRes (reqStr, socket) {
  let request = new Request(reqStr)
  console.log(request)
  let response = new Response(request)
  next(request, response, socket)
}
