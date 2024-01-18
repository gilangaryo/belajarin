
// router.post('/gilangaryo', async (req, res) => {
//     try {
//         await updateMentorMember22(req);
//         res.status(200).json({ message: 'masuk updated mentor and member.' });
//     } catch (error) {
//         console.error('Error in /gilangaryo route:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// const updateMentorMember22 = async (req, res) => {
//     try {
//         const db = require("../config");
//         const id_mentor = req.body.uid;
//         const materi_id = "WOI";

//         const mentor = db.collection('mentor').doc(id_mentor);
//         const mentorSub = mentor.collection('cobaKopi').doc(materi_id);

//         // Create a JavaScript Date object representing the current date and time
//         const currentDate = new Date();


//         console.log(currentDate);
//         if (!currentDate) {
//             console.log(currentDate);
//         }
//         // Use serverTimestamp() as a field value
//         await mentorSub.set({
//             cek: "masuk ga ?",
//             materi_id: materi_id,
//             createdAt: currentDate
//         });

//     } catch (error) {
//         console.error("Error updating mentor and member:", error);
//     }
// };

// const createAppointments = async (req) => {
//     try {
//         const selectedDate = "2024-01-18T17:00:00.000Z";

//         // Assuming you have the selected time object
//         const selectedTime = {
//             startTime: '05:00',
//             endTime: '06:00',
//             value: '05:00',
//             label: '05:00 - 06:00'
//         };

//         const startDate = new Date(`${selectedDate.slice(0, 10)}T${selectedTime.startTime}:00.000Z`);
//         const endDate = new Date(`${selectedDate.slice(0, 10)}T${selectedTime.endTime}:00.000Z`);

//         const mentorUID = 'your-mentor-uid';

//         const mentorDocRef = db.collection("mentor").doc(mentorUID);

//         const subCollectionRef3 = mentorDocRef.collection("jadwal").doc();
//         await subCollectionRef3.set({
//             start: startDate,
//             end: endDate,
//         });

//         console.log('Data set successfully');
//     } catch (error) {
//         console.error('Error creating appointments:', error);
//     }
// };



// router.post('/jadwalbroku', createAppointments);