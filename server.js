const express=require('express');
const cors=require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const app = express();
const dbConnect = require('./config/db.config');
dbConnect();
var corsOptions = {
    origin: "http://localhost:3000"
    };
const {errorHandler} = require('./middleware/errorHandler')
app.use(errorHandler)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/chat.routes')(app);
require('./routes/patient.routes')(app);
require('./routes/rdv.routes')(app);
require('./routes/auth.routes')(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
