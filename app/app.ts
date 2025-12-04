import { Backend } from '../framework/backend/backend';

function App() {
  const appHome = new URL('./src/', import.meta.url).pathname;
  const c = Backend({ appHome });

  c.get('/', (_req, res) => {
    res.html('<a href="/home">Go to Home</a>');
  });

  c.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello, World!' });
  });

  c.get('/home', (_req, res) => {
    res.render('compare_code', { message: 'Welcome!' });
  });

  c.get('/users/:id', (req, res) => {
    res.render('compare_code', { message: `User ID: ${req.params.id}` });
  });

  c.get('/search', (req, res) => {
    res.json({ query: req.query });
  });

  c.post('/api/data', (_req, res) => {
    res.status(201).json({ created: true });
  });

  return c;
}

App().start();
