const Request = require ('./request.js')
const fs = require('fs')

const status = {
	200 : 'OK',
	400 : 'Bad Request',
	404 : 'Not Found',
	500 : 'Internal Server Error'
}
class Response {
	constructor() {
		this.version = 'HTTP/1.1'
		this.statusCode = 200
		this.statusMessage = status[this.statusCode]
		this.headers = {}
		this.body = ''
	}
	generateResponse(request) {
		console.log('In Response class'+request, this)
		setHeaders(request, this)
		if(request.headers['content-type'] === 'text/html') {
			console.log('Inside')
			var path = resolvePath(request.url)
			console.log('Path'+ path)
			var data = fs.readFileSync(path, 'utf-8')
			this.body = data
			return generateResStr(this)
		}
		else {
			this.statusCode = 500
			this.statusMessage = status[this.statusCode]
			this.body = this.statusCode + ' ' + this.statusMessage
			return generateResStr(this)
			
		}

	}
}

function resolvePath(url) {
	return (url === '/') ? './test/index.html' : './test/about.html' 
}

function setHeaders(request, response) {
	let headers = {}
	headers['Content-Type'] = request.headers['content-type'] 
	headers['Date'] = new Date()
	response.headers = headers
}

function generateResStr(response) {
	var str = ''
	str += response.version + ' ' + response.statusCode + ' ' + response.statusMessage + '\n'
	for(let i in response.headers) {
		console.log('Check'+ i, response.headers[i])
		if(response.headers.hasOwnProperty(i))
			str += i + ': ' + response.headers[i] + '\n'
	}
	str += '\n' + response.body
	return str
}
module.exports = Response