const express = require('express')
require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db.config');
const {errorHandler} = require('./middleware/errorHandler')
connectDB()

const app = express()


app.use(errorHandler)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/assistants', require('./routes/assistantRoutes'));





app.listen(port, () => console.log(`Server started on port ${port}`));