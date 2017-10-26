const net = require('net')
const parseRequest = require('./parseRequest')
const Request = require('./request.js')
const Response = require('./response.js')

const port =  9000

var server = net.createServer((socket) => {
	console.log('New client connection made')
	console.log(socket.remoteAddress+':'+socket.remotePort)
	var request = new Request()
	var reqBody = [], i = 0
	socket.setEncoding('utf-8')
	socket.on('data', (data) => {
		reqBody.push(data)
		i++
		if(reqBody[i-2] === '\r\n' && reqBody[i-1] === '\r\n') {
			socket.end()
			console.log('FIN!')
		}
		console.log('Data so far...'+reqBody)
	})
	socket.on('end', () => {
		request = parseRequest(reqBody, request)
		console.log('Back in server...')
		var response = new Response()
		response.generateResponse(request, (response) => console.log('Generated response...' + response))
	})
	socket.on('close', () => {
		console.log('Connection from' + socket.remoteAddress + 'closed')
	})		
})

server.listen(port, () => {
	console.log('Listening on port: '+ port)})

server.on('error', (err) => {throw err})
