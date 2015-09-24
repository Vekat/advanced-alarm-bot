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

TelegramApi.prototype.handleMessage = function (msg) {
	console.log(msg);
	var text = msg.text;
	var chatId = msg.chat.id;
	if (text && text.length > 9 && text.indexOf('/remember') === 0) {
		var baseText = text.substring(10);
		timeText = baseText.substring(0, baseText.indexOf(' '));

		var unit = timeText.substring(timeText.length-1);
		var time = timeText.substring(0, timeText.length-1);

		var task = baseText.substring(baseText.indexOf(' ')+1);

		var self = this;
		var convertedTime;
		if (unit === 's') { // seconds
			convertedTime = time * 1000;
		} else if (unit === 'm') {
			convertedTime = time * 1000 * 60;
		} else if (unit === 'h') {
			convertedTime = time * 1000 * 60 * 60;
		} else {
			self.sendMessage(chatId, 'Invalid unit. Please use one of the following formats: h, m, s. Example: /remember 10m invite Marco to sushi');
		}
		if (convertedTime) {
			setTimeout(function() {
				self.sendMessage(chatId, task);
			}, convertedTime);
			self.sendMessage(chatId, "I will remind you to '" + task + "' in " + timeText);
		}
	} else {
		this.sendMessage(msg.chat.id, 'Invalid usage. Try /remember 10s play tibia with Kenya.');
	}
}

TelegramApi.prototype.setToken = function (token) {
	this.token = token;
}

TelegramApi.prototype.getToken = function() {
	return this.token;
}

module.exports = TelegramApi;
