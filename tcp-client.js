const net = require('net')

var HOST = 'localhost'
var PORT = 9000

var client = net.createConnection(PORT, HOST, () => {
  console.log('Connected to server')
  client.write('GET /about HTTP/1.1\r\nContent-Type: text/html\r\n\r\n')
  client.setEncoding('utf-8')
})
client.on('error', (err) => {
  throw err
})

client.on('data', function (data) {
  console.log(data)
  client.end()
})

client.on('close', function () {
  console.log('Connection closed')
})
