const http = require('http');
const PORT = 80;

const server = http.createServer((req, res) => {
  res.end('✅ Hello from AWS Free Tier Node.js App!');
});

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
