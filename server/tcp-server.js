const net = require('net')
const Request = require('../modules/request')
const Response = require('../modules/response')
const parseRequest = require('../modules/parseRequest.js')
const logger = require('../middleware/logger')
const staticFileHandler = require('../middleware/staticFileHandler.js')

const routes = {
  GET: {},
  POST: {}
}

const handlers = []

function startServer (port) {
  let server = net.createServer((socket) => {
    console.log('New client connection made')
    console.log(socket.remoteAddress + ':' + socket.remotePort)
    let reqStr = ''
    socket.on('data', (data) => {
      reqStr += data
      if (reqStr.includes('\r\n\r\n')) {
        let [header, body] = reqStr.split('\r\n\r\n')
        let obj = parseRequest(header)
        if (obj.Headers['Content-Length'] === undefined) {
          let [request, response] = createReqAndRes(obj, socket)
          next(request, response)
          reqStr = ''
        }
        if (parseInt(obj.Headers['Content-Length']) === body.length) {
          let [request, response] = createReqAndRes(obj, socket)
          next(request, response)
          reqStr = ''
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
}

function createReqAndRes (reqObj, socket) {
  let request = new Request(reqObj, handlers)
  request['socket'] = socket
  let response = new Response(request)
  return [request, response]
}

function next (req, res) {
  if (req.handlers.length === 0 && routes[req.method].hasOwnProperty(req.url)) {
    req.handlers.push(methodHandler)
    next(req, res)
    return
  }
  let handler = req.handlers.shift()
  handler(req, res, next)
}

const methodHandler = (req, res) => {
  if (!routes[req.method].hasOwnProperty(req.url)) {
    res.setStatus(404)
    res.body = res.statusCode + ' ' + res.statusMessage
    res.send()
  }
  routes[req.method][req.url](req, res)
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
