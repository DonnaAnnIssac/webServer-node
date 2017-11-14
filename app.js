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
    res.setContentType('./test/images/bg.jpg')
    res.send()
  })
})

server.addRoutes('POST', '/data.html', (req, res) => {
  console.log('Now I am here')
  res.body = req.body['Name'] + ' is ' + req.body['Age']
  res.setContentType('/data.html')
  res.send()
})
