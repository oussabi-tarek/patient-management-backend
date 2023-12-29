const nodemailer = require('nodemailer');
const Appointment = require('../model/Rdv');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'boostfollowers274@gmail.com',
    pass: 'kvnaykgefnicrylw',
  },
});

const sendTomorrowAppointmentNotification = async (appointment) => {
  try {
    // Assuming you're querying for the appointment and populating the patient field
    const appointmentData = await Appointment.findById(appointment._id).populate('patient');

    // Check if the appointment and patient exist
    if (!appointmentData || !appointmentData.patient) {
      throw new Error('Appointment or patient not found');
    }

    console.log(appointmentData.patient.email);

    const mailOptions = {
      from: 'boostfollowers274@gmail.com',
      to: appointmentData.patient.email,
      subject: 'Upcoming Tomorrow Appointment',
      text: `Your appointment is scheduled for tomorrow at ${appointmentData.date}.`,
    };

    await transporter.sendMail(mailOptions);

    // Update the appointment to mark notification as sent
    await Appointment.findByIdAndUpdate(appointment._id, { notificationSent: true });

    console.log('Appointment updated:', appointment._id);
  } catch (error) {
    console.error('Error sending tomorrow appointment notification:', error);
  }
};

module.exports = { sendTomorrowAppointmentNotification };
