// Example route.js file

const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');
// const uuid = require("uuid-v4");

const apps = express();
const serverless = require('serverless-http');
const cors = require('cors');


const { getAllMember, getMember, deleteMember, addMember, getAllClassMember } = require("../controllers/memberController");
const { getAllMentor, addMentor, getAllDate } = require("../controllers/mentorController");
const { signUp, login, daftarMentorByAdmin, loginMentor, accMentor } = require('../controllers/authController');
const { pay, trxNotif } = require('../controllers/paymentController');
const { getAllcategory, getCategory, getAllCat, getAllSubCategory, getAllSubMenu, getMateribyCategory, getCategorySubMenuAllMateri } = require('../controllers/categoryController');
const { sendEmail, sendEmails } = require('../controllers/sendEmailController');
const { addMateri, getMateriMentor, getAllMateriMentor, getAllMaterial } = require('../controllers/materiController');
const { uploadss } = require('../controllers/uploadController');
const db = require('../config');
const { timeStamp, time } = require('console');


router.use(cors());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


router.get('/member', getAllMember);
router.get('/member/class/:uid', getAllClassMember);


router.get('/member/:id', getMember);
// router.post('/member/:id', updateMember);
router.delete('/member/:id', deleteMember);
router.post('/member/add', addMember);

router.post('/auth/signup', signUp);
router.post('/auth/login', login);

// MENTOR
router.get('/allMentor', getAllMentor);
const uploads = multer({ storage: multer.memoryStorage(), limits: { fileSize: 3000000 } });
router.post('/addMentor', uploads.fields([{ name: 'cv', maxCount: 1 }, { name: 'portfolio', maxCount: 1 }, { name: 'keanggotaan', maxCount: 1 }]), addMentor);


router.post('/dashboard/login/mentor', loginMentor);


// midtrans
router.post('/pay', pay);
router.post('/notification', trxNotif);





router.get('/home', getAllMaterial);
router.get('/', (req, res) => {
    res.json({
        'haii': 'SELAMAT MALAM !!'
    });
});



// category
router.get('/category', getAllcategory);
router.get('/category/all', getAllCat);
router.get('/category/allSubCat', getAllSubCategory);
router.get('/category/allSubMenu', getAllSubMenu);

router.get('/:category', getCategory);

// get all materi by category 
// router.get('/:category/:subMenu', getMateribyCategory);
router.get('/:category/:subMenu', getCategorySubMenuAllMateri);

// detail kelas
router.get('/material/:nama/:materi_id', getMateriMentor);
router.get('/HomeMentor/:mentor_name/:mentor_id', getAllMateriMentor);

// send email
router.post('/sendemail', sendEmail);
router.post('/sendemails', sendEmails);



// TAMBAH MATERI
router.post('/HomeMentor/:mentor_name/:uid/addMateri', uploads.fields([{ name: 'file', maxCount: 1 }]), addMateri);


const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1000000 } });
router.post("/upload", upload.single("file"), uploadss);


// router.get('/allDate', getAllDate);


// ADMIN 
router.post('/admin/register/mentor', accMentor);


router.post('/gilangaryo', async (req, res) => {
    try {
        await updateMentorMember22(req);
        res.status(200).json({ message: 'masuk updated mentor and member.' });
    } catch (error) {
        console.error('Error in /gilangaryo route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const updateMentorMember22 = async (req, res) => {
    try {
        const db = require("../config");
        const id_mentor = req.body.uid;
        const materi_id = "WOI";

        const mentor = db.collection('mentor').doc(id_mentor);
        const mentorSub = mentor.collection('cobaKopi').doc(materi_id);

        // Create a JavaScript Date object representing the current date and time
        const currentDate = new Date();


        console.log(currentDate);
        if (!currentDate) {
            console.log(currentDate);
        }
        // Use serverTimestamp() as a field value
        await mentorSub.set({
            cek: "masuk ga ?",
            materi_id: materi_id,
            createdAt: currentDate
        });

    } catch (error) {
        console.error("Error updating mentor and member:", error);
    }
};
const createAppointments = async (req) => {
    const selectedDate = "2024-01-18T17:00:00.000Z";

    // Assuming you have the selected time object
    const selectedTime = {
        startTime: '05:00',
        endTime: '06:00',
        value: '05:00',
        label: '05:00 - 06:00'
    };

    // Combine date and time for start and end
    const startDateTimeString = `${selectedDate.slice(0, 10)} ${selectedTime.startTime}`;
    const endDateTimeString = `${selectedDate.slice(0, 10)} ${selectedTime.endTime}`;


    // Create Date objects
    const startDate = new Date(selectedDate);
    const startTime = new Date(startDateTimeString);
    const endTime = new Date(endDateTimeString);

    if (!isNaN(startDate) && !isNaN(startTime) && !isNaN(endTime)) {
        const appointments = [];
        console.log(startDateTimeString);
        console.log(endDateTimeString);

        // Add logic for creating appointments as needed
    } else {
        console.error("Invalid date or time format");
    }
}
router.post('/jadwalbroku', createAppointments);

module.exports = router;
