var http = require('http');

/*
http.get(url, function(response) {
	// `http.get` is shorthand for `http.request` where `options.method` === 'GET'
	// and the returned writable stream is closed without being written to
}).on('error', function(err) {
	console.error(err);
});
/**/

/*
http.request({
	hostname : 'localhost',
	port : 80,
	method : 'POST',
	path : '/',
	headers : {
		'Content-Type' : 'application/json'
	}
}, function(response) {
	var responseData = '';

	response.setEncoding('utf8');

	res.on('data', function(d) {
		responseData += d;
	});

	res.on('end', function() {
		// do something with `responseData` here
	});
}).on('error', function(err) {
	console.error(err);
}).end(JSON.stringify({ put : 'data here' }));
/**/
