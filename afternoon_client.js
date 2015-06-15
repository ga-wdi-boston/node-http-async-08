var http = require('http'),
	async = require('async');

var server = http.createServer(function(req, serverResponse) {
	var target = req.connection.remoteAddress,
		protocol = 'http://',
		port = 8888;

	async.parallel({
		'dateGet' : function(cb) {
			http.get(protocol + target + port + '/date', function(res) {
				var resData = '';

				res.on('data', function(d) {
					resData += d;
				});
				res.on('end', function() {
					var epoch = parseInt(resData);

					if(Number.isNaN(epoch))
						return cb({
							name : 'DateIsNaN',
							message : "Expected epoch time is not a number."
						});

					var date = new Date(epoch);

					if(date.getFullYear() === 2015 && date.getMonth() === 6 && date.getDate() === 15)
						return cb(null, epoch);

					cb({
						name : 'DateIsntToday',
						message : "Received date is not from today."
					});
				});
			});
		},
		'datePost' : function(cb) {
			var now = Date.now();

			http.request({
				hostname : protocol + target,
				'port' : port,
				path : '/date'
				method : 'POST',
				headers : {
					'Content-Type' : 'text/plain'
				}
			}, function(res) {
				var resData = '';

				res.on('data', function(d) {
					resData += d;
				});
				res.on('end', function() {
					if(Date.parse(resData) === now)
						return cb(null);

					cb({
						name : 'BadDateTransform',
						message : "Received value did not map to the value sent."
					});
				});
			}).end('' + now);
		},
		'echoPost' : function(cb) {
			var echoText = '' + Math.floor(Math.random()*1000000);

			http.request({
				hostname : protocol + target,
				'port' : port,
				path : '/echo'
				method : 'POST',
				headers : {
					'Content-Type' : 'text/plain'
				}
			}, function(res) {
				var resData = '';

				res.on('data', function(d) {
					resData += d;
				});
				res.on('end', function() {
					if(resData === echoText)
						return cb(null);

					cb({
						name : 'FalseEcho',
						message : "Response echo does not match request data."
					});
				});
			}).end(echoText);
		},
		'echoGet' : function(cb) {
			var echoText = '' + Math.floor(Math.random()*1000000);

			http.request({
				hostname : protocol + target,
				'port' : port,
				path : '/echo'
				method : 'GET',
				headers : {
					'Content-Type' : 'text/plain'
				}
			}, function(res) {
				var resData = '';

				res.on('data', function(d) {
					resData += d;
				});
				res.on('end', function() {
					if(resData === '')
						return cb(null);

					if(resData === echoText)
						return cb({
							name : 'EchoOnGet',
							message : "Echo route does not discriminate by method."
						});

					cb(null, resData);
				});
			}).end(echoText);
		}
	}, function(err, results) {
		serverResponse.writeHead(200, {
			'Content-Type' : 'text/plain'
		});

		if(err) {
			return serverResponse.end("Fail. Reason: " + err.name);
		}

		if(results.echoGet) {
			return serverResponse.end("Possible pass. Echo get response: " + results.echoGet);
		}

		serverResponse.end("Pass. Congrats!");
	});
});

server.listen(8888, function() {
	console.log("Server is up and listening.");
});
