var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response) {
	var parsedUrl = url.parse(request.url, true);

	if(Object.keys(parsedUrl.query).length)
		response.write(JSON.stringify(parsedUrl.query)); // response for request with query string

/*	if(parsedUrl.pathname === '/') {
		if(request.method === 'GET')
			// GET response for this route
		if(request.method === 'POST')
			// POST response for this route
	} else {
		response.writeHead(404, {
			'Content-Type' : 'text/plain'
		});
		return response.end("Not Found");
	}
/**/
/* SAMPLE RESPONSE
	response.writeHead(200, {
		'Content-Type' : 'application/json'
	}); // OK

	response.write(JSON.stringify(object));

	response.end();
*/
});

server.listen(8888, function() {
	console.log("Server is up and listening.");

	http.get("http://" + process.argv[2] + ":8888/", function(res) {
		return;
	});
});
