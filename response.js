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
	generateResponse(request, callback) {
		if(request.headers['content-type'] === 'text/html') {
			var path = resolvePath(request.url)
			fs.readFile(path, 'utf-8', (err, data) => {
				if(err) {
					this.statusCode = 404
					this.statusMessage = status[this.statusCode]
					return this
				}		
				console.log('Generating response...')	
				setHeaders(request, this)
				this.body = data
				console.log(this)
				return this
			})
		}
		else {
			this.statusCode = 500
			this.statusMessage = status[this.statusCode]
			return this
		}

	}
}

function resolvePath(url) {
	return (url === '/') ? './test/index.html' : './test/about.html' 
}

function setHeaders(request, response) {
	let headers = {}
	headers['Content-Type'] = request.headers['content-type'] 
	response.headers = headers
}
module.exports = Response