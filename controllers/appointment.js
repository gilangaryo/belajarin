
const db = require("../config");

const createAppointments = async (req) => {
    try {
        const selectedDate = req.body.selectedDate;

        const selectedTime = req.body.selectedTime

        const startDate = new Date(`${selectedDate.slice(0, 10)}T${selectedTime.startTime}:00.000Z`);
        const endDate = new Date(`${selectedDate.slice(0, 10)}T${selectedTime.endTime}:00.000Z`);

        const mentorUID = 'your-mentor-uid';

        const mentorDocRef = db.collection("mentor").doc(mentorUID);

        const subCollectionRef3 = mentorDocRef.collection("jadwal").doc();
        await subCollectionRef3.set({
            start: startDate,
            end: endDate,
        });

        console.log('Data set successfully');
    } catch (error) {
        console.error('Error creating appointments:', error);
    }
};

module.exports = {
    createAppointments
};