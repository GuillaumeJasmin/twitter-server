require('dotenv').config();
const Twit = require('twit');
const io = require('socket.io')();
const EE = require('events').EventEmitter;

const pubsub = new EE();

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

const stream = T.stream('statuses/filter', { track: ['zidane'] });

stream.on('tweet', data => {
  pubsub.emit('tweet', data);
});

io.on('connection', client => {
  pubsub.on('tweet', data => {
    client.emit('tweet', data);
  });
});

io.listen(3001);
