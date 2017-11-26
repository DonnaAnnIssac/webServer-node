const net = require('net')
const Request = require('../modules/request')
const Response = require('../modules/response')
const parseRequest = require('../modules/parseRequest')
const fs = require('fs')

const routes = {
  GET: {},
  POST: {}
}

const handlers = []

const allowedOriginsList = {}
function startServer (port) {
  let server = net.createServer((socket) => {
    console.log('New client connection made')
    console.log(socket.remoteAddress + ':' + socket.remotePort)
    handleDataEvent(socket)
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
}

function handleDataEvent (socket) {
  let reqBuff = Buffer.from([])
  let bodyBuff = Buffer.from([])
  let receivedPart = false
  let obj = {}
  socket.on('data', (data) => {
    if (receivedPart) {
      bodyBuff = Buffer.concat([bodyBuff, data], bodyBuff.length + data.length)
    }
    reqBuff = Buffer.concat([reqBuff, data], reqBuff.length + data.length)
    if (reqBuff.includes('\r\n\r\n')) {
      if (!receivedPart) {
        let [header, body] = getHeaderAndBody(reqBuff)
        obj = parseRequest(header.toString())
        bodyBuff = Buffer.from(body)
        receivedPart = true
      }
      if (obj.Headers['Content-Length'] === undefined || parseInt(obj.Headers['Content-Length']) === bodyBuff.length) {
        reqBuff = handleRequest(obj, socket, bodyBuff)
        receivedPart = false
      }
    }
  })
}

function getHeaderAndBody (reqBuff) {
  let header = reqBuff.slice(0, reqBuff.indexOf('\r\n\r\n'))
  let body = reqBuff.slice(reqBuff.indexOf('\r\n\r\n') + 4)
  return [header, body]
}

function handleRequest (obj, socket, body) {
  let [request, response] = createReqAndRes(obj, socket)
  if (request.method === 'POST') request.body = body
  next(request, response)
  return ''
}

function createReqAndRes (reqObj, socket) {
  addHandler(methodHandler)
  let request = new Request(reqObj, handlers)
  request['socket'] = socket
  let response = new Response(request)
  return [request, response]
}

function next (req, res) {
  // if (req.handlers.length === 1) checkForOriginHeader(req, res)
  let handler = req.handlers.shift()
  handler(req, res, next)
}

// function checkForOriginHeader (req, res) {
//   if (req.headers['Origin'] && allowedOriginsList[req.headers['Origin']]) {

//   }
// }

const methodHandler = (req, res, next) => {
  if (routes[req.method].hasOwnProperty(req.url)) {
    routes[req.method][req.url](req, res)
  } else {
    res.setStatus(404)
    fs.readFile('./server/404.html', (err, data) => {
      if (err) throw err
      res.body = data
      res.send()
    })
  }
}

function addRoutes (method, route, callback) {
  routes[method][route] = callback
}

function addHandler (handler) {
  handlers.push(handler)
}

function addOrigin (origin, methodList) {
  allowedOriginsList[origin] = methodList
}

module.exports = {
  startServer,
  addHandler,
  addRoutes,
  addOrigin
}
