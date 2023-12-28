const Rdv = require('../model/Rdv');

const scheduleAppointmentNotifications = async () => {
  try {
    // Find appointments scheduled for tomorrow
    const now = new Date();
    console.log('Now:', now.toISOString()); // Log now variable

    const tomorrowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    console.log('Tomorrow End:', tomorrowEnd.toISOString()); // Log tomorrowEnd variable

    const tomorrowAppointments = await Rdv.find({
      date: {
        $gte: now.toISOString(),
        $lt: tomorrowEnd.toISOString(),
      },
      notificationSent: false,
    });

    console.log('Tomorrow Appointments:', tomorrowAppointments);

    tomorrowAppointments.forEach(async (appointment) => {
      notificationService.sendTomorrowAppointmentNotification(appointment);
    });

    console.log('Tomorrow notifications triggered automatically.');
  } catch (error) {
    console.error('Error triggering tomorrow notifications:', error);
  }
};

module.exports = { scheduleAppointmentNotifications };
