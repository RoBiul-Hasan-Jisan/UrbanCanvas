import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
server.use(cors());

// Use default middlewares (CORS, static, etc)
server.use(middlewares);

// Use JSON Server router
server.use(router);

// Start server
server.listen(PORT, () => {
  console.log(` JSON Server is running on port ${PORT}`);
  console.log(` API Endpoints:`);
  console.log(`   http://localhost:${PORT}/products`);
  console.log(`   http://localhost:${PORT}/orders`);
  console.log(`   http://localhost:${PORT}/users`);
  console.log(` Home: http://localhost:${PORT}`);
});