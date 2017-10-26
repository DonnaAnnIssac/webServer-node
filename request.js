class Request {
	constructor(method, url, version) {
		this.method = method || 'GET',
		this.url = url || '/',
		this.version = version || 'HTTP/1.1',
		this.headers = {},
	}
}

module.exports = Request