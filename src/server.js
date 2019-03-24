const twitter = require('./twitter');
const io = require('./socket');
const EE = require('events').EventEmitter;

const pubsub = new EE();

const stream = twitter.stream('statuses/filter', { track: ['zidane'] });

stream.on('tweet', data => {
  pubsub.emit('tweet', data);
});

io.on('connection', client => {
  pubsub.on('tweet', data => {
    client.emit('tweet', data);
  });
});
