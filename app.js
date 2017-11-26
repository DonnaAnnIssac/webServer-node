const server = require('./server/tcp-server')
const logger = require('./middleware/logger')
const bodyParser = require('./middleware/bodyParser')
const fs = require('fs')
const path = require('path')
const sessionHandler = require('./middleware/sessionHandler')
const staticFileHandler = require('./middleware/staticFileHandler')

server.startServer(9000)

server.addHandler(bodyParser.parseUrlEncodedBody)
server.addHandler(bodyParser.parseMultipartFormData)
server.addHandler(sessionHandler.handleSession)
server.addHandler(logger)
server.addHandler((req, res, next) => {
  console.log('My own handler for request: ')
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

server.addRoutes('POST', '/submit', (req, res) => {
  let keys = Object.keys(req.files)
  console.log(keys)
  keys.forEach((key) => {
    let file = req.body['filenames'].shift()
    console.log(Buffer.isBuffer(req.files[key]))
    let outStream = fs.createWriteStream(file)
    outStream.write(req.files[key], null, (err) => {
      if (err) throw err
    })
    console.log("We're done here")
  })
  console.log('Take me home')
  res.redirect('/home')
})

server.addRoutes('GET', '/login', (req, res) => {
  fs.readFile('./session-test/login.html', (err, data) => {
    if (err) throw err
    res.body = data
    res.setHeaders()
    res.setContentType('login.html')
    res.send()
  })
})

server.addRoutes('POST', '/validate', (req, res) => {
  sessionHandler.addSession(req, req.body['UserName'])
  if (sessionHandler.getSession(req) !== undefined) res.redirect('./welcome')
  else res.redirect('./login')
})

server.addRoutes('GET', '/welcome', (req, res) => {
  if (sessionHandler.getSession(req) !== undefined) {
    fs.readFile('./session-test/welcome.html', (err, data) => {
      if (err) throw err
      res.body = data
      res.setHeaders()
      res.setContentType('.html')
      res.send()
    })
  } else res.redirect('./login')
})

server.addRoutes('GET', '/display', (req, res) => {
  if (sessionHandler.getSession(req) !== undefined) {
    res.body = 'User Name: ' + sessionHandler.getSession(req)
    res.setHeaders()
    res.setContentType('.html')
    res.send()
  } else res.redirect('./login')
})

server.addRoutes('GET', '/logout', (req, res) => {
  sessionHandler.deleteSession(req)
  res.redirect('./login')
})
