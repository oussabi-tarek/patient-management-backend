const express = require('express')
require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db.config');
const {errorHandler} = require('./middleware/errorHandler')
const patientController = require('./controllers/patient.controller')
const patientRoutes = require('./routes/patient.routes');
connectDB()

const app = express()



app.use(errorHandler)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/patients', patientRoutes)
app.use('/login', patientController.loginPatient)






app.listen(port, () => console.log(`Server started on port ${port}`));