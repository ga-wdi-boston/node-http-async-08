var http = require('http');
var url = require('url');
var crypto = require('crypto');

var codes = {};
var server = http.createServer(requestHandler);

function requestHandler(request, response) {
	var parsedUrl = url.parse(request.url, true);

	if(parsedUrl.pathname === '/') {
		if(request.method === 'GET')
			return crypto.randomBytes(8, function(err, bytes) {
				if(err)
					return response.writeHead(500).end(); // internal error

				var arrBytes = [];
				
				for(var i = 0; i < bytes.length; i++)
					arrBytes.push(bytes[i]);

				codes[request.connection.remoteAddress] = JSON.stringify(arrBytes);

				response.writeHead(200, {
					'Content-Type' : 'application/json'
				}); // OK

				response.end(codes[request.connection.remoteAddress]);
			});
		if(request.method === 'POST') {
			var postData = '';

			request.on('data', function(d) {
				postData += d;
			});

			request.on('end', function() {
				var status = 200,
					responseText,
					correct = false;

				if(postData.slice(1, postData.length-1) === codes[request.connection.remoteAddress])
					correct = true;

				responseText = correct ? "Success!" : "Failure!";

				response.writeHead(status, {
					'Content-Type' : 'text/plain'
				});
				response.end(responseText);
			});

			return;
		}
	} else {
		response.writeHead(404, {
			'Content-Type' : 'text/plain'
		});
		return response.end("Not Found");
	}
}

server.listen(8888, function() {
	console.log("Server is up and listening.");
});
