const server = require('./server/tcp-server')
const logger = require('./middleware/logger')
const bodyParser = require('./middleware/bodyParser')
const fs = require('fs')
const staticFileHandler = require('./middleware/staticFileHandler')

server.startServer(9000)
server.addHandler(bodyParser)
server.addHandler(logger)
server.addHandler((req, res, next) => {
  console.log('My own handler for request: ' + req.body)
  next(req, res)
})
server.addHandler(staticFileHandler('./test'))
server.addHandler(staticFileHandler('./form-test'))
server.addRoutes('GET', '/bg.jpg', (req, res) => {
  fs.readFile('./test/images/bg.jpg', (err, data) => {
    if (err) throw err
    res.body = data
    res.setHeaders()
    res.setContentType('./test/images/bg.jpg')
    res.send()
  })
})

server.addRoutes('POST', '/data.html', (req, res) => {
  res.body = req.body['say'] + ' ' + req.body['to']
  res.setHeaders()
  res.setContentType('/data.html')
  res.send()
})

server.addRoutes('GET', '/home', (req, res) => {
  res.body = 'Home Page'
  res.send()
})

server.addRoutes('POST', '/submit.cgi', (req, res) => {
  fs.appendFile('./write.txt', req.files['secret'])
  res.body = 'File written'
  res.setHeaders()
  res.setContentType('/submit.cgi')
  res.send()
})
