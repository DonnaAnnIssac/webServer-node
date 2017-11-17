const server = require('./server/tcp-server')
const logger = require('./middleware/logger')
const bodyParser = require('./middleware/bodyParser')
const fs = require('fs')
const sessionHandler = require('./middleware/sessionHandler')
const staticFileHandler = require('./middleware/staticFileHandler')

server.startServer(9000)
server.addHandler(bodyParser)
server.addHandler(sessionHandler.handleSession)
server.addHandler(logger)
server.addHandler((req, res, next) => {
  console.log('My own handler for request: ' + req.body)
  next(req, res)
})
server.addHandler(staticFileHandler('./test'))
server.addHandler(staticFileHandler('./form-test'))

server.addRoutes('POST', '/data.html', (req, res) => {
  res.body = req.body['say'] + ' ' + req.body['to']
  res.setHeaders()
  res.setContentType('/data.html')
  res.send()
})

server.addRoutes('GET', '/home', (req, res) => {
  res.redirect('./about')
})

server.addRoutes('POST', '/submit.cgi', (req, res) => {
  console.log(req.files['secret'].length)
  fs.appendFile('./copy.png', req.files['secret'])
  res.body = 'File written'
  res.setHeaders()
  res.setContentType('.png')
  res.send()
})

server.addRoutes('POST', '/validate', (req, res) => {
  sessionHandler.addSession(req, req.body['UserName'])
  if (sessionHandler.getSession(req) !== undefined) res.redirect('./welcome')
  else res.redirect('./login')
})

server.addRoutes('GET', '/welcome', (req, res) => {
  if (sessionHandler.getSession(req) !== undefined) res.redirect('./welcome')
  else res.redirect('./login')
})

server.addRoutes('GET', '/display', (req, res) => {
  if (sessionHandler.getSession(req) !== undefined) {
    res.body = 'User Name: ' + req.body['UserName']
  } else res.redirect('./login')
})

server.addRoutes('GET', '/logout', (req, res) => {
  sessionHandler.deleteSession(req)
  res.redirect('./login')
})
