const Server = require('./tcp-server.js')

var server = new Server(9000, 'localhost')
server.start(() => {
	console.log('Server started')
})