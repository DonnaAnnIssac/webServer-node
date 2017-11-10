const server = require('./server/tcp-server')
const logger = require('./middleware/logger')
const fs = require('fs')
const staticFileHandler = require('./middleware/staticFileHandler')

server.startServer(9000)
server.addHandler(logger)
server.addHandler(staticFileHandler('./test'))
server.addRoutes('GET', '/about', (req, res) => {
  fs.readFile('./form-test/about.html', (err, data) => {
    if (err) throw err
    res.body = data
    res.setContentType('./form-test/about.html')
    res.send()
  })
})

server.addRoutes('GET', '/data', (req, res) => {
  fs.readFile('./form-test/data.html', (err, data) => {
    if (err) throw err
    res.body = data
    res.setContentType('./form-test/data.html')
    res.send()
  })
})

server.addRoutes('GET', '/form', (req, res) => {
  fs.readFile('./form-test/form.html', (err, data) => {
    if (err) throw err
    res.body = data
    res.setContentType('./form-test/form.html')
    res.send()
  })
})

server.addRoutes('GET', '/bg.jpg', (req, res) => {
  fs.readFile('./test/images/bg.jpg', (err, data) => {
    if (err) throw err
    res.body = data
    res.setContentType('./test/images/bg.jpg')
    res.send()
  })
})

server.addRoutes('GET', '/paint-it-black.mp3', (req, res) => {
  fs.readFile('./form-test/paint-it-black.mp3', (err, data) => {
    if (err) throw err
    res.body = data
    res.setContentType('./form-test/paint-it-black.mp3')
    res.send()
  })
})
