var http = require('http'),
    url = require('url');

var server = http.createServer(function(request, response){
  // Setting CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');

  // URL Parsing
  var parsedUrl = url.parse(request.url, true),
      path = parsedUrl.pathname.toLowerCase(),
      method = request.method;

  console.log(path + " : " + method);

  // Routing & Control
  if (path === '/login' && method === 'POST' ) {                  //login
    var data = '';
    request.setEncoding('utf8');
    request.on('data', function(chunk) {
      data += chunk;
    });
    request.on('end', function(){
      data = JSON.parse(data);
      var user = fakeDB.findByEmail(data.credentials.email);
      if (user && user.passwordDigest === reallyCrummyCrypt(data.credentials.password)) {
        response.writeHead(200, {"Content-Type": "text/json"});
        response.end(JSON.stringify({accessKey: user.accessKey}));
      } else {
        response.writeHead(401, {"Content-Type": "text/json"});
        response.end(JSON.stringify({message:"Unauthorized."}));
      }
    });

  } else if (path === '/register' && method === 'POST') {         //register
    // Load the request data in pieces, as it arrives
    var data = '';
    request.setEncoding('utf8');
    request.on('data', function(chunk) {
      data += chunk;
    });
    request.on('end', function(){
      data = JSON.parse(data);
      console.log(data);
      if (data.credentials && data.credentials.email && data.credentials.password) {
        fakeDB.users.push({
          email: data.credentials.email,
          passwordDigest: reallyCrummyCrypt(data.credentials.password),
          accessKey: Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1)
                     //generates a random 32-character string
        });
        response.writeHead(200, {"Content-Type": "text/json"});
        response.end(JSON.stringify({message:"Successfully registered."}));
      } else {
        response.writeHead(500, {"Content-Type": "text/json"});
        response.end(JSON.stringify({message:"Bad request."}));
      }
    });

  } else if (method === "OPTIONS") {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.end("Pre-flight");

  } else {                                                        //404 - no path
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end("Not Found");

  }
});
server.listen(8880, function(){
  console.log("Auth Server listening on port 8880");
})

var reallyCrummyCrypt = function(password){
  var chars = password.toLowerCase().split('');
  if (chars[0].match(/[^aeiou]/)) {
    var first = chars.shift();
    chars.push(first);
  }
  chars.push('a','y')
  return chars.join('');
};

var fakeDB = {
  findByEmail: function(email){
    return this.users.filter(function(user){return user.email === email;})[0];
  },
  users : [
    {
      email: "test@test.com",
      passwordDigest:"esttay",
      accessKey: "DNei6c7anOy4hPBEy3xXWlCSXu2zRA0y"
    },
    {
      email: "o@canada.com",
      passwordDigest: "ohforsureay",
      accessKey: "9z84X236dZm9o0B41u3hvDh2CtCTL2NM"
    }
  ]
}

