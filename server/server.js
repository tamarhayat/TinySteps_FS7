const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const childRoutes = require('./routes/childRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const fileRoutes = require('./routes/fileRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const userRoutes = require('./routes/userRoutes');

// cors
app.use(cors({
    origin: 'http://localhost:5173', // the client address
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);     
app.use('/api/children', childRoutes); 
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/measurements', measurementRoutes); 
app.use('/api/files', fileRoutes); 
app.use('/api/users', userRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
