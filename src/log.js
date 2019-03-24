class Logger {
  constructor(update) {
    this.update = update;
    this.breakLineCount = 0;
  }

  breakLine() {
    this.breakLineCount += 1;
    process.stdout.write('\n');
  }

  write(src) {
    process.stdout.write(src);
  }

  clear() {
    if (this.breakLineCount) {
      process.stdout.moveCursor(0, -this.breakLineCount);
      process.stdout.cursorTo(0);
      process.stdout.clearScreenDown();
      this.breakLineCount = 0;
    }
  }

  show(show) {
    this.clear();
    show();
  }
}

const logger = new Logger();

const logClientCountAndDuplication = io => {
  // client count
  const clients = Object.values(io.sockets.clients().sockets);

  logger.write(`Client count: ${clients.length}`);
  logger.breakLine();

  duplicatedClients = {};

  for (let client1 of clients) {
    for (let client2 of clients) {
      if (
        client1.handshake.address === client2.handshake.address &&
        client1.id !== client2.id
      ) {
        duplicatedClients[client1.handshake.address] = true;
      }
    }
  }

  duplicatedClients = Object.keys(duplicatedClients);

  logger.write(
    `duplicated clients: ${duplicatedClients.length} ${duplicatedClients.join(
      ' - '
    )}`
  );
  logger.breakLine();
};

const showLog = io => {
  logger.show(() => {
    logClientCountAndDuplication(io);
  });
};

module.exports = showLog;
