var http = require('http'),
    url = require('url'),
    base64 = require('base-64');

var server = http.createServer(function(request, response){
  // Setting CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');

  // URL Parsing
  var parsedUrl = url.parse(request.url, true),
      path = parsedUrl.pathname.toLowerCase(),
      method = request.method;

  // Routing and Control
  console.log(path + " : " + method);
  if (path === '/documents' && method === 'GET') {                      //index
    // var accessKey = new Buffer(request.headers.authorization.split(' ')[1], 'base64').toString(); // Without the base-64 module.
    var accessKey = base64.decode(request.headers.authorization.split(' ')[1]);
    var docs = fakeDB.findByAccessKey(accessKey);
    response.writeHead(200, {'Content-Type' : 'text/json'});
    response.end(JSON.stringify({documents: docs}));

  } else if (method === "OPTIONS") {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.end("Pre-flight");

  } else {                              //404 - no path
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end("Not Found");
  }
});

server.listen(8881, function(){
  console.log("Document Server listening on port 8881");
})

var fakeDB = {
  findByAccessKey: function(key){
    return this.documents.filter(function(document){return document.accessKey === key;});
  },
  documents : [
    {
      accessKey: "DNei6c7anOy4hPBEy3xXWlCSXu2zRA0y",
      content: "Love all, trust a few, do wrong to none."
    },
    {
      accessKey: "DNei6c7anOy4hPBEy3xXWlCSXu2zRA0y",
      content: "The course of true love never did run smooth."
    },
    {
      accessKey: "DNei6c7anOy4hPBEy3xXWlCSXu2zRA0y",
      content: "Better three hours too soon than a minute too late."
    },
    {
      accessKey: "9z84X236dZm9o0B41u3hvDh2CtCTL2NM",
      content: "This life, which had been the tomb of his virtue and of his honour, is but a walking shadow; a poor player, that struts and frets his hour upon the stage, and then is heard no more: it is a tale told by an idiot, full of sound and fury, signifying nothing."
    },
    {
      accessKey: "9z84X236dZm9o0B41u3hvDh2CtCTL2NM",
      content: "Good night, good night! Parting is such sweet sorrow, that I shall say good night till it be morrow."
    }
  ]
}
