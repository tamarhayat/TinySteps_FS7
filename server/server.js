const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);     
app.use('/api/children', childRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
