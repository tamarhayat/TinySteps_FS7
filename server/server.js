const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('השרת פועל!');
});

app.listen(PORT, () => {
  console.log(`השרת מאזין על http://localhost:${PORT}`);
});
