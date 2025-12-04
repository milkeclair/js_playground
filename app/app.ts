import { Backend } from '../framework/backend/backend';

const appHome = new URL('./src/', import.meta.url).pathname;
const backend = Backend({ appHome });

backend.get('/', (_req, res) => {
  res.html('<a href="/home">Go to Home</a>');
});

backend.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello, World!' });
});

backend.get('/home', (_req, res) => {
  res.render('compare_code', { message: 'Welcome!' });
});

backend.get('/users/:id', (req, res) => {
  res.render('compare_code', { message: `User ID: ${req.params.id}` });
});

backend.get('/search', (req, res) => {
  res.json({ query: req.query });
});

backend.post('/api/data', (_req, res) => {
  res.status(201).json({ created: true });
});

backend.start();
