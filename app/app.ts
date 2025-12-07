import { Server } from '../framework/backend/server';

const root = new URL('./src/', import.meta.url).pathname;

function App() {
  const s = Server({ root, allowed: { origins: ['http://example.com'] } });

  let timer: ReturnType<typeof setTimeout>;
  s.use((c) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      console.log(`Debounced log: ${c.req.method} ${c.req.url}`);
    }, 500);
  });

  s.get('/', (c) => {
    c.res.html('<a href="/home">Go to Home</a>');
  });

  s.get('/home', (c) => {
    c.res.render({ template: 'compare_code', params: { message: 'Welcome!', title: 'Home' } });
  });

  s.get('/nested/hello', (c) => {
    c.res.render({ params: { message: 'Nested view test' } });
  });

  s.get('/users/:id', (c) => {
    c.res.render({
      template: 'compare_code',
      params: { message: `User ID: ${c.req.pathParams.id}`, title: 'User Profile' },
    });
  });

  s.get('/search', (c) => {
    c.res.json({ query: c.req.query });
  });

  s.get('/api/hello', (c) => {
    c.res.json({ message: 'Hello, World!' });
  });

  s.post('/api/data', (c) => {
    c.res.status(201).json({ created: true, received: c.req.body });
  });

  return s;
}

const app = App();
app.start();
