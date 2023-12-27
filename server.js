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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

require('./routes/chat.routes')(app);
require('./routes/user.routes')(app);
require('./routes/rdv.routes')(app);
require('./routes/medecin.routes')(app);
require('./routes/service.routes')(app);
require('./routes/patient.routes')(app);
require('./routes/facture.routes')(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
