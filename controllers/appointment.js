const db = require("../config");

const createAppointments = async (req, transaction_id) => {
    try {
        const { selectedDate, selectedTime, uid, materi_id, totalAmount } = req.body;

        const startDate = new Date(selectedDate);

        const startTimeParts = selectedTime.startTime.split('.');
        const endTimeParts = selectedTime.endTime.split('.');

        const startTime = new Date(startDate);
        const endTime = new Date(startDate);

        startTime.setHours(parseInt(startTimeParts[0], 10), parseInt(startTimeParts[1], 10));
        endTime.setHours(parseInt(endTimeParts[0], 10), parseInt(endTimeParts[1], 10));

        const mentorUID = 'your-mentor-uid';

        const mentorDocRef = db.collection("mentor").doc(mentorUID);

        const orderCollection = db.collection("order");
        await orderCollection.doc(transaction_id).update({
            start: startDate,
            end: endTime,
        });

        const subCollectionRef3 = mentorDocRef.collection("jadwal").doc();
        await subCollectionRef3.set({
            start: startDate,
            end: endTime,
            uid,
            materi_id,
            totalAmount,
        });

        console.log('Data set successfully');
    } catch (error) {
        console.error('Error creating appointments:', error);
    }
};

module.exports = {
    createAppointments
};
