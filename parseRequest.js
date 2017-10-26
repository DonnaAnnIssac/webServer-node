const Request = require('./request.js')

function parseRequest(reqBody, request) {
	var msgBody, msgHead
	reqBody.pop()
	reqBody.map((line, i) => {
		if(line.startsWith('\r\n') && msgHead === undefined){
			msgHead = reqBody.slice(0, i)
			msgBody = reqBody.slice(i+1) 
		}
	})
	console.log(msgHead, msgBody)
	request = parseRequestHeaders(msgHead.slice(1), parseRequestLine(msgHead[0], request))
	console.log(request, msgBody.toString().trim())
}

function parseRequestLine(line, request) {
	var parts = line.split(' ')
	request.method = parts[0].trim()
	request.url = parts[1].trim()
	request.version = parts[2].trim()
	return request
}

function parseRequestHeaders(line, request) {
	console.log(request)
	var headers = {}
	line.forEach((item) => {
		console.log(item)
		var result = item.split(/:/)
		console.log(result)
		headers[result[0].toLowerCase()] = result[1].toLowerCase().trim()
	})
	request.headers = headers
	return request
}

// parseRequest('GET /path HTTP/1.1\nUser-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)\nHost: www.tutorialspoint.com\nAccept-Language: en-us\nAccept-Encoding: gzip, deflate\nConnection: Keep-Alive\n\nhi')
module.exports = parseRequest