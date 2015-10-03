var request = require('request');

var TelegramApi = function() {};

TelegramApi.prototype.sendMessage = function(chat_id, text) {
	var text = { "chat_id": chat_id, "text": text };
	console.log(text);

	var options = {
		method: 'POST',
		json: true,
		formData: text,
		uri: 'https://api.telegram.org/bot' + this.token + '/sendMessage'
	};

	request(options, function (err, response, body) {
		if (err) {
			console.log(err);
		}
		console.log(body);
	});
}

TelegramApi.prototype.setWebhook = function (bot_api_url) {
	// registers itself as webhook
	var options = {
		method: 'POST',
		url: 'https://api.telegram.org/bot' + this.token + '/setWebhook',
		form: {
			'url': bot_api_url
		}
	};
	request(options, function (err, response, body) {
		if (err) {
			console.log('ixi'+ err);
		}
		console.log('body'+ body);
	});
}

TelegramApi.prototype.handleMessage = function (reply, msg) {
	var self = this;
	console.log(msg);
	
	var chatId = msg.chat.id;
	var text = msg.text;
	
	// if the message comes from a group chat, ignore it
	if (msg.chat.title == void(0)) {
		sendReply('I don\'t support group chats yet');
		return;
	}
	
	if (text && text.length > 9 && text.indexOf('/remember') === 0) {
		handleRemember(text);
	} else {
		sendReply('I didn\'t get it. Try something like: /remember 10s play tibia with Kenya.');
	}

	function handleRemember(text) {
		var baseText = text.substring(10);

		var timeText = baseText.substring(0, baseText.indexOf(' '));
		var unit = timeText.substring(timeText.length-1);
		var time = timeText.substring(0, timeText.length-1);

		var task = baseText.substring(baseText.indexOf(' ')+1);

		var convertedTime;
		if (unit === 's') { // seconds
			convertedTime = time * 1000;
		} else if (unit === 'm') { // minutes
			convertedTime = time * 1000 * 60;
		} else if (unit === 'h') { // hours
			convertedTime = time * 1000 * 60 * 60;
		} else if (unit === 'd') { // days
			convertedTime = time * 1000 * 60 * 60 * 24;
		} else {
			sendReply('Oops! Please use one of the following formats: d, h, m, s. Example: /remember 10m invite Marco to sushi');
		}

		if (convertedTime) {
			setTimeout(function() {
				self.sendMessage(chatId, task);
			}, convertedTime);

			sendReply("I will remind you to '" + task + "' in " + timeText);
		}
	}

	function sendReply(messageReply) {
		var infos = {
			method: "sendMessage",
			chat_id: chatId,
			text: messageReply
		};
		reply(infos).code(200);
	}
}

TelegramApi.prototype.setToken = function (token) {
	this.token = token;
}

TelegramApi.prototype.getToken = function() {
	return this.token;
}

module.exports = TelegramApi;
