function parseRequest(reqBody, request) {
	var msgBody, msgHead
	reqBody = reqBody.toString().split('\r\n')
	console.log(reqBody)
	reqBody.pop()
	reqBody.map((line, i) => {
		if(line.length === 0 && msgHead === undefined){
			msgHead = reqBody.slice(0, i)
			msgBody = reqBody.slice(i+1) 
		}
	})
	request = parseRequestHeaders(msgHead.slice(1), parseRequestLine(msgHead[0], request))
	request.body = msgBody.toString().trim()
	console.log(request)
	return request
}

function parseRequestLine(line, request) {
	var parts = line.split(' ')
	request.method = parts[0].trim()
	request.url = parts[1].trim()
	request.version = parts[2].trim()
	return request
}

function parseRequestHeaders(line, request) {
	var headers = {}
	line.forEach((item) => {
		var result = item.split(/:/)
		headers[result[0].toLowerCase()] = result[1].toLowerCase().trim()
	})
	request.headers = headers
	return request
}

module.exports = parseRequest