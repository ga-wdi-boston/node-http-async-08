var http = require('http');

var serverHost = process.argv[2];

var getHandler = function(response) {
  // this is what runs when we get a response
  var getResponseData = '';

  response.setEncoding('utf8');
  response.on('data', function(d) {
    getResponseData += d;
    //console.log(d);
  });
  response.on('end', function() {
    // here, we are assured that `getResponseData`
    // is complete
    //console.log("FINAL: " + getResponseData);
    postReq.write(getResponseData);
    postReq.end();
  });
};

var postHandler = function(response) {
  var postResponseData = '';
  response.setEncoding('utf8');
  response.on('data', function(d) {
    postResponseData += d;
  });
  response.on('end', function() {
    console.log(postResponseData);
  });
};

var getOptions = {
  hostname : serverHost,
  port : 8888,
  path : '/',
  method : 'GET'
};

var postOptions = {
  hostname : serverHost,
  port : 8888,
  path : '/',
  method : 'POST',
  headers : {
    'Content-Type' : 'application/json'
  }
};

var getReq = http.request(getOptions, getHandler);
// `req` contains a writable Stream
getReq.end();
// `req` is now actually sent to the server

var postReq = http.request(postOptions, postHandler);
