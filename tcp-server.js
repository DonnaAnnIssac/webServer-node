const net = require('net')
const parseRequest = require('./parseRequest')
const Request = require('./request.js')
const Response = require('./response.js')

class Server {
	constructor(port, address) {
		this.port =  port,
		this.address = address,
		this.clients = []
	}
	start(callback) {
		net.createServer((socket) => {
			console.log('New client connection made')
			console.log(socket.remoteAddress+':'+socket.remotePort)
			var request = new Request()
			var reqBody = []
			handleDataEvent(socket, reqBody)
			handleEndEvent(socket, reqBody, request)
			handleCloseEvent(socket)
			// socket.on('error', () => {})
		}).listen(this.port, () => {
			console.log('Listening on port: '+ this.port)
		})
		// server.on('error', (err) => {
		// 	console.log(err.message)
		// 	throw err
		// })
	}	
		
}

function handleDataEvent(socket, body) {
	socket.setEncoding('utf-8')
	var i = 0
	socket.on('data', (data) => {
		body.push(data)
		i++
		console.log(body, i)
		if(body[i-2] === '\r\n' && body[i-1] === '\r\n') {
			socket.end()
			console.log('FIN!')
		}
	})
}

function handleEndEvent(socket, body, request) {
	socket.on('end', () => {
		console.log(body)
		parseRequest(body, request)
	})
}

function handleCloseEvent(socket) {
	socket.on('close', () => {
		console.log('Connection from' + socket.remoteAddress + 'closed')
	})
}
module.exports = Server