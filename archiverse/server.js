const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

// Logging Middleware
server.use((req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

// Set a timeout for all requests
server.use((req, res, next) => {
  res.setTimeout(15000, () => {  // 15 seconds timeout
    res.status(504).json({ error: "Request timed out" });
  });
  next();
});

// Handle the requests
server.all('*', (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
