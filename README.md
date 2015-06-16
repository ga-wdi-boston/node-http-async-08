#Node HTTP

## Morning

First, you'll want to write a client, based on `client.js`, to interface with `morning\_server.js`.

To test your client, first run `morning_server.js`. Starting from a shell in the same directory as the file, enter this command:

`node morning_server.js`

You then want to write your client such that you can run it with the following command:

`node client.js localhost`

(or substitute the IP or hostname of the machine running the server)

In order to do that, you will need to use `process.argv`, an array that stores the command-line arguments passed to Node. See `example_client.js` for a reference.

Please don't just copy it, but write your own client and understand what is taking place throughout.


## Afternoon

Here, you want to have `afternoon_client.js` running passively like we did with `morning_server.js`. Its purpose is to be a client to the server you write, but you trigger this role by sending it a GET request, so it initially acts as a server.

`node afternoon_client.js`

And, as before, you ultimately want to run your server like so:

`node server.js localhost`

(or, as before, substitute the IP or hostname of the machine running the server)
