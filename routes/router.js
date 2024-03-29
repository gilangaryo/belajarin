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



module.exports = router;
