require('dotenv').config();
const io = require('socket.io')();
const argv = require('minimist')(process.argv.slice(2), {
  alias: { p: 'port' }
});

const config = {
  port: 3000,
  ...argv
};

io.listen(config.port);

console.log(`\nsocket.io listening http://localhost:${config.port}`);

module.exports = io;
