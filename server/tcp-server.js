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
  let reqStr = ''
  let bodyBuff = Buffer.from('')
  let receivedPart = false
  let obj = {}
  socket.on('data', (data) => {
    if (receivedPart) bodyBuff = Buffer.concat([bodyBuff, data], bodyBuff.length + data.length)
    reqStr += data
    if (reqStr.includes('\r\n\r\n')) {
      if (!receivedPart) {
        var [header, body] = getHeaderAndBody(reqStr)
        obj = parseRequest(header)
        bodyBuff = Buffer.from(body)
        receivedPart = true
      }
      if (obj.Headers['Content-Length'] === undefined || parseInt(obj.Headers['Content-Length']) === bodyBuff.length) {
        reqStr = handleRequest(obj, socket, bodyBuff)
        receivedPart = false
      }
    }
  })
}

function getHeaderAndBody (reqStr) {
  let header = reqStr.slice(0, reqStr.indexOf('\r\n\r\n'))
  let body = reqStr.slice(reqStr.indexOf('\r\n\r\n') + 4)
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
  let handler = req.handlers.shift()
  handler(req, res, next)
}

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

module.exports = {
  startServer,
  addHandler,
  addRoutes
}
