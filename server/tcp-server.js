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
  socket.on('data', (data) => {
    reqStr += data
    if (reqStr.includes('\r\n\r\n')) {
      let [header, body] = getHeaderAndBody(reqStr)
      let obj = parseRequest(header)
      reqStr = handleRequest(obj, socket, body, reqStr)
    }
  })
}

function getHeaderAndBody (reqStr) {
  let header = reqStr.slice(0, reqStr.indexOf('\r\n\r\n'))
  let body = reqStr.slice(reqStr.indexOf('\r\n\r\n') + 4)
  return [header, body]
}

function handleRequest (obj, socket, body, reqStr) {
  if (obj.Headers['Content-Length'] === undefined || parseInt(obj.Headers['Content-Length']) === body.length) {
    let [request, response] = createReqAndRes(obj, socket)
    if (request.method === 'POST') request.body = body
    next(request, response)
    reqStr = ''
  }
  return reqStr
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
