import { createServer } from './server';

const port = process.env.PORT || 3000;

(async () => {
  try {
    const app = await createServer();
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();