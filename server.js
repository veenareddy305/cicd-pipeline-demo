const express = require('express');
const app = express();

app.get('/', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'dev' }));
app.get('/health', (req, res) => res.status(200).json({ healthy: true }));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Running on ${PORT}`));
}
module.exports = app;
