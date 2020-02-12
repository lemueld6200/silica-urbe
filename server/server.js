#!/usr/bin/env node

/**
 * Module dependencies.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
// const http = require("http");
const https = require("https");
const app = require("./app");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT);

/**
 * Create HTTPS server.
 */

const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../cert/key.pem"), "utf8"),
  cert: fs.readFileSync(path.resolve(__dirname, "../cert/cert.pem"), "utf8")
};
const server = https.createServer(
  options,
  app.callback()
);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // Named pipe
    return val;
  }

  if (port >= 0) {
    // Port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} is already in use.`);
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`App listening on ${bind}...`);
}
