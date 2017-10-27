const net = require('net')
const parseRequest = require('./parseRequest')
const Request = require('./request.js')
const Response = require('./response.js')

const port =  9000

var server = net.createServer((socket) => {
	console.log('New client connection made')
	console.log(socket.remoteAddress+':'+socket.remotePort)
	var request = new Request()
	var reqBody = []//, i = 0
	socket.setEncoding('utf-8')
	socket.on('data', (data) => {
		reqBody.push(data)
		// i++
		// if(reqBody[i-2] === '\r\n' && reqBody[i-1] === '\r\n') {
		// socket.end()
		// console.log('FIN!')
		if(reqBody[0].endsWith('\r\n\r\n'))  {
			request = parseRequest(reqBody, request)
			var response = new Response()
			var res = response.generateResponse(request)

			socket.write(res, 'utf-8', () => {
				console.log('Write complete')
			})
		}
	})
	socket.on('end', () => {
		console.log('End event')
	})
	socket.on('close', () => {
		console.log('Connection from ' + socket.remoteAddress + ' closed')
	})		
})

server.listen(port, () => {
	console.log('Listening on port: '+ port)})

server.on('error', (err) => {throw err})
