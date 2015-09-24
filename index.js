var Hapi = require('hapi');
var TelegramApi = require('./app/controllers');

var token = process.env.BOT_TOKEN || process.argv[2];
var bot_api_url = 'https://4c27f645.ngrok.com/bot' + token;

var telegram = new TelegramApi();
telegram.setToken(token);

var server = new Hapi.Server();
server.connection({ port: 8443 });

server.route({
	method: 'POST',
	path: '/bot'+telegram.getToken(),
	handler: function (request, reply) {
		var payload = request.payload;
		telegram.handleMessage(payload.message);
		reply(200);
	}
});

server.start(function() {
	console.log('Telegram Bot listening at ', server.info.uri);
	telegram.setWebhook(bot_api_url);
});

