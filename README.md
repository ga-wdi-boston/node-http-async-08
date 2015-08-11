![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

## Objectives
- Use the `http` Node module to create an HTTP client and make requests.
- Use the `http` Node module to create an HTTP server and set up routing and control for the handling of requests.
- Use the `async` module in conjunction with `http` to set up series and parallel processes.

## Prerequisites
- Using `require` to load Node modules.
- HTTP
- AJAX

# Overview :: Node's `http` Module

Now that you've learned a little bit about how Node works, let's take a look at how Node modules can be used to build web applications. This lesson will focus on one in particular, `http`, a module that lets you create both HTTP clients _and_ HTTP servers, all in JavaScript. Pretty much all of the web frameworks in Node are built on top of the `http` module, so it helps to have a basic idea of how it works. It's also simple enough that you can get started quickly.

## Making Clients with `http`

You should all be familiar with the idea of JavaScript-based HTTP clients by now - you've all incorporated that behavior into your front-end applications.

Take a look at this code snippet from `demo-app/main.js` :

```javascript
var authServer = "http://localhost:8880",
    documentServer = "http://localhost:8881",
    accessKey;

$("#register").on('click', function(event){
  $.ajax({
    url: authServer + "/register",
    method: "POST",
    data: JSON.stringify({
      credentials: {
        email: $("#email").val(),
        password: $("#password").val()
      }
    })
  }).done(function(data){
    console.log(data)
  }).fail(function(data, testStatus, jqxhr){
    console.error(data);
    console.error(testStatus);
    console.error(jqxhr);
  });
});
```

This, obviously, is a jQuery AJAX request - specifically a post request directed at a server running on port 8880. You can actually see it in action by going into `demo-app` and running the following commands (in separate console tabs):

```bash
ruby -run -e httpd . -p5000
node auth-server.js
node document-server.js
```

Try registering a new user, and then logging in - you should get back a 32-character random string that acts as your key to the document server.
Then, try logging in with the following credentials:
```
email: "test@test.com"
password: "test"
```
You should get back a totally different alphanumeric string. If you then click 'Get Documents', this will trigger a request to a different server, retrieving a list of documents (in this case, Shakespeare quotes) using our alphanumeric string as a key.

Using `http`, we can initiate HTTP requests from Node in a similar way to how our jQuery-based client can.

```javascript
var http = require('http');

var register = function(){
  var registerData = JSON.stringify({
    credentials : {
      email: process.argv[2],
      password: process.argv[3]
    }
  });
  var registerRequest = http.request({      // http.request(options,callback) => ClientRequest
    hostname: 'localhost',
    port: 8880,
    path: '/register',
    method: 'POST'
  }, function(response) {                   // 'done' handler
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
register();
```

Note the structural similarities! Both setups require:

1. An 'options' object which is used to configure the request.
2. A callback for handling the success case.
3. A callback for handling the failure case.
4. (Optionally) Data to be sent.

In this case, however, rather than getting our `email` and `password` parameters from form fields in a web page, they instead get passed in as arguments from the command line.

As an exercise, let's work together to write a second request in our Node-based client to replicate the `login` functionality. Assume that we want the option of _choosing_ between registering and logging in from the command line; we might want to change our argument format from

`node console-client.js email password`

to

`node console-client.js command email password`

where `command` might be 'register', 'login', etc.

### Your Turn
In your groups, add a third request option to this Node client to duplicate the AJAX request that retrieves documents. You might need to set up a way to store the access key. You'll also need to include an 'authorize' header in the HTTP request in order to share the access key with the document server; assuming we're using the `base-64` module, we need to add the following to that request's _options_ object:

```javascript
headers: {
  'Authorization': "Basic " + base64.encode(process.argv[3])
}
```

> ##### Aside :: `async.series`
> Suppose that we wanted to create a combined action out of logging in and retrieving documents. We could just try to call them both one at a time, in order, e.g.
```javascript
login();
getDocuments();
```
> But this presents a problem - because both of these processes are asynchronous (i.e. _non-blocking_) we have no way to know for sure that the `login` process will be complete before we start the `getDocuments` process.
>
> One way around this might be to create a new function called `loginAndGetDocuments` that's almost identical to `login`, except that it would invoke `getDocuments` from its 'done' handler. However, this would be fairly duplicative. What's more, suppose that we needed to have a three-step process instead of a two-step one; would we just keep adding callbacks within callbacks? That kind of situation is affectionally referred to by JavaScript programmers as 'callback hell' - when callbacks get too deeply nested to be used effectively.
>
> Fortunately, there's a powerful tool that can help us out here : a Node module called [`async`](https://github.com/caolan/async). `async` is specifically designed to allow us to construct complex processes out of asynchronous steps - no trivial task!
>
> In this case, we might use `async`'s `series` method, which allows us to executes a sequence of callbacks in a specific order. Here's the syntax:
>
```javascript
var async = require('async');
...
async.series([
    function(callback){
      login();
      callback(error,result);
      // Invokes the next callback in the chain, indirectly. Also tries to pass its result to the 'results' array,
      // or jumps immediately to the final callback (if it exists) if an error is hit.
    },
    function(callback){
      getDocuments();
      callback(error,result);
    },
  ],
  function(err, results) {
    // Optional callback function for processing the collected results of each individual step
    // and for handling any errors that might come up during the process.
  }
);
```
> `async` has a number of other useful methods as well; some of the most common are `parallel` (which allows us to launch multiple processes at once, and wait until all have finished before moving on) and `waterfall` (almost the same as `series`, except that each step's output is daisy-chained to the next step).

> The best part? Because it's JavaScript, we can actually use it on the front-end as well!

## Making Servers with `http`
As was mentioned earlier, the `http` module allows you to create both clients and servers; now that we've looked at how clients can be built, let's take a look at how to make a simple server in Node.

The good news is that getting the bare minimum is very easy. To create a completely vanilla server, all you need is the following:

```javascript
var http = require('http');

var server = http.createServer(function(request, response){
});

server.listen(8000, function(){     //callback is optional
  console.log("Server is running on port 8000");
});
```

That's it! If you run this file with Node (e.g. `node my-server.js`), you'll see some text in the console indicating that your server is running.

Of course, this server doesn't actually do anything at the moment, so we'll want to add some more stuff.

- **CORS**

  As with Rails, we need to set up CORS if we want to make AJAX requests to our page. This is pretty much just cut and paste:

  ```javascript
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Request-Method', '*');
  ```

- **Parsing a URL for routing.**

  Routing is a pretty core feature of a web application. But in order to do routing on a request, you need to know (a) where the request was made, i.e. _path_, and (b) the type of request, i.e. _method_. The request method is available directly as a property of the `request` object (`request.method`). However, parsing out things like the relative path, query string, etc can be a bit tedious - fortunately, we can use the [`url`](https://nodejs.org/api/url.html) module to make it simpler.

  ```javascript
  var url = require('url');

  var parsedUrl = url.parse(request.url, true),
  path = parsedUrl.pathname.toLowerCase(),
  method = request.method;
  ```

- **Collecting the full body of the request.**

  The body of the request gets sent over in small pieces - 'chunks' - that need to be aggregated. Every time that a new 'chunk' arrives, it triggers a 'data' event on our request object; when that happens, we convert that chunk to a string and append it to our existing data.

  ```javascript
  var body = '';
  request.setEncoding('utf8');
  request.on('data', function(chunk){ body += chunk;})
  ```

  Finally, when the body finishes arriving, it triggers an 'end' event in the request, allowing us to trigger subsequent steps.

  ```javascript
  request.on('end', function(){
    // Do some stuff with 'body'.
  });
  ```

- **Sending back a response.**

  To send back a response, we'd write something like this:
  ```javascript
  response.writeHead(200, {'Content-Type' : 'text/plain'});
    // The first parameter is the HTTP code, the second is the data type of the response.
  response.end("All systems go.");
    // Similar to what we did when we sent requests! Passing in an argument to '.end' is the same as passing
    // that same argument into '.write', and then calling '.end' with no arguments.
  ```
  Naturally, we'd only want to send back a response once we're finished with what we need to do.


Now that you've seen some of these core features, let's take a minute to look throught the source code of the two servers we were using earlier. Are you able to follow what's going on?

## Your Turn :: Making Servers with `http`

Let's try spinning up some simple servers and interacting with them via simple clients. In your groups, create two JavaScript files, called `client.js` and `server.js` respectively.

Inside `server.js` add the following mock database:
```
var fakeDB = {
  statues: [
    {name: "David", location: "Florence, Italy"},
    {name: "Liberty", location: "New Jersey, USA"},
    {name: "Redeemer", location: "Rio De Janeiro, Brazil"}
  ],
  wizards: [
    {name: "Gandalf", universe: "Lord of the Rings"},
    {name: "Dumbledore", universe: "Harry Potter"},
    {name: "Oz the Great and Terrible", universe: "The Wizard of Oz"}
  ],
  pigs : [
    {name: "Wilbur"},
    {name: "Babe"},
    {name: "Miss Piggy"}
  ]
}
```

Create a new server, and give it two routes/control paths for each of the above resources - specifically, an `index` action and a `create` action.

Once that's done, go to `client.js` and create requests that hit those routes.

> ##### Aside :: `async.parallel`
> Let's look at another example of how `http` and `async` can be used in tandem.
>
> Suppose that we wanted a service that would call up any three websites, count the number of characters on each page, and return the address of the longest page (in characters).
>
> Here's how we might implement that process for a single page:
```javascript
var charsOnPage = function(url, callback) {
  http.get(url, function(response){
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function(data){ body += data; });
    response.on('end', function(){
      console.log(body.length);
    });
  }).on('error', function(e){
    console.error(e);
  });
};
```
> In this case, we might want to use the `async` module to coordinate the different requests; in particular, we'd probably want to use `async.parallel`, since all three processes (requesting the page and getting its length) should run independently of each other.
>
> Here's how that would get set up.
```javascript
var async = require('async');
async.parallel({
  processOne : function(callback){
    // Do a thing, and get either a result or an error.
    // err = blah
    // result = blah
    callback(err, result);
  },
  processTwo : function(callback){ callback(err, result);},
  processThree : function(callback){ callback(err, result);}
}, function (err, results){
  // Optional callback function for processing the collected results
  // and for handling any errors that might come up during the process.
});
```
> If we want to integrate these two things, we need to change 'charsOnPage' so that it passes its results back to `async`, rather than just printing them to the console.
```javascript
var async = require('async');
var charsOnPage = function(url, callback) {
  http.get(url, function(response){
    var body = '';
    response.setEncoding('utf8');
    response.on('data', function(data){ body += data; });
    response.on('end', function(){
      callback(null, body.length);  // pass out result, with no errors
    });
  }).on('error', function(e){
    callback(e, null);              // pass out error, with no results
  });
};
async.parallel({
  "http://www.google.com" : function(callback){charsOnPage("http://www.google.com", callback);},
  "http://www.zombo.com/" : function(callback){charsOnPage("http://www.zombo.com", callback);},
  "http://www.w3.org/" : function(callback){charsOnPage("http://www.w3.org/", callback);}
}, function(err, results){
  // For now, doing nothing with the results besides printing them.
  console.log(results);
});
```
> Given all this, do you think you can set up a server that will accept three URLs as arguments in a request, and send back a response with the url of the page with the most characters (and how long it is)? Give it a shot!
