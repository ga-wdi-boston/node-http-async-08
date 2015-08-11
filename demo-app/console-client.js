var http = require('http');

var register = function(){
  var registerData = JSON.stringify({
    credentials : {
      email: process.argv[3],
      password: process.argv[4]
    }
  });
  var registerRequest = http.request({      // http.request(options,callback) => ClientRequest
    hostname: 'localhost',
    port: 8880,
    path: '/register',
    method: 'POST'
  }, function(response) {                        // 'done' handler
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function(){
      console.log(body);
    });
  }).on('error', function(e) {              // error handler
    console.error('problem with request: ' + e.message);
  });

  registerRequest.write(registerData);      // write data to request body
  registerRequest.end();                    // 'end' the message, sending it out
};

