const server = require('./server/tcp-server')
const logger = require('./middleware/logger')
const fs = require('fs')
const staticFileHandler = require('./middleware/staticFileHandler')

server.startServer(9000)
server.addHandler(logger)
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
