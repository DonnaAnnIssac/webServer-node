const net = require('net')
const Request = require('../modules/request')
const Response = require('../modules/response')
const parseRequest = require('../modules/parseRequest')
const fs = require('fs')
const bodyParser = require('../middleware/bodyParser')
const logger = require('../middleware/logger')
const staticFileHandler = require('../middleware/staticFileHandler')

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
          request.body = body
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
