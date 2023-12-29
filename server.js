const express=require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const { scheduleAppointmentNotifications } = require('./middleware/notificationScheduler');
const cron = require('node-cron');

require('dotenv').config();
const PORT = process.env.PORT || 8080;
const app = express();
const dbConnect = require('./config/db.config');
dbConnect();
var corsOptions = {
    origin: "http://localhost:3000"
    };
const {errorHandler} = require('./middleware/errorHandler')
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(errorHandler)
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

require('./routes/chat.routes')(app);
require('./routes/user.routes')(app);
require('./routes/rdv.routes')(app);
require('./routes/medecin.routes')(app);
require('./routes/service.routes')(app);
require('./routes/consultation.routes')(app);
require('./routes/assistant.routes')(app);

require('./routes/patient.routes')(app);
require('./routes/facture.routes')(app);

// Schedule the job to run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('Automatically triggering tomorrow notifications...');
      await scheduleAppointmentNotifications();
    } catch (error) {
      console.error('Error triggering tomorrow notifications:', error);
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
