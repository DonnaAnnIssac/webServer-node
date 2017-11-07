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
    if (reqStr.includes('\r\n\r\n')) {
      let arr = reqStr.split('\r\n\r\n')
      let obj = headerParser(arr[0])
      if (arr[1].length === 0 && obj.Method === 'GET') {
        createReqAndRes(reqStr, socket)
        reqStr = ''
      } else {
        if (parseInt(obj['Content-Length']) === arr[1].length) {
          createReqAndRes(reqStr, socket)
          reqStr = ''
        }
      }
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

function headerParser (headerStr) {
  let arr = headerStr.split('\r\n')
  let headerObj = {}
  let reqLine = arr.shift().split(' ')
  headerObj['Method'] = reqLine[0]
  headerObj['Path'] = reqLine[1]
  headerObj['Version'] = reqLine[2]
  arr.forEach((element) => {
    let header = element.split(':')
    headerObj[header[0]] = header[1]
  })
  return headerObj
}

function foo (reqStr, socket) {

}

function next (req, res, socket) {
  if (req.handlers.length === 0) socket.end()
  let handler = req.handlers.shift()
  handler(req, res, socket, next)
}

function createReqAndRes (reqStr, socket) {
  let request = new Request(reqStr)
  console.log(request)
  let response = new Response(request)
  next(request, response, socket)
}
