// Example route.js file

const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');
// const uuid = require("uuid-v4");

const apps = express();
const serverless = require('serverless-http');


const { getAllMember, getMember, deleteMember, addMember } = require("../controllers/memberController");
const { getAllMentor, addMentor } = require("../controllers/mentorController");
const { signUp, login, logout } = require('../controllers/authController');
const { pay, trxNotif } = require('../controllers/paymentController');
const { getAllcategory, getCategory, addSubcategory, getMateri } = require('../controllers/categoryController');
const { sendEmail, sendEmails } = require('../controllers/sendEmailController');
const { addMateri, getMateriMentor } = require('../controllers/materiController');
const { getBank } = require('../controllers/bank');
const { uploadss } = require('../controllers/uploadController');
const { uploadImageku } = require('../controllers/uploadImage');



router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ... rest of your server setup


router.get('/member', getAllMember);

router.get('/member/:id', getMember);
// router.post('/member/:id', updateMember);
router.delete('/member/:id', deleteMember);
router.post('/member/add', addMember);

router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// MENTOR
router.get('/allMentor', getAllMentor);
router.post('/addMentor', addMentor);


router.post('/pay', pay);
router.post('/notification', trxNotif);

router.get('/material/:name/:uid', getMateriMentor);
// category
router.get('/category', getAllcategory);
router.get('/:category', getCategory);
router.get('/:category/:subMenu', getMateri);




// router.get('/category/:category/:subCategory/:subMenu', getSubCategory);

// category :programming :mobile-development :

// router.post('/category/:category/:subCategory', addSubcategory);
router.post('/category/:category/:subCategory', addSubcategory);

// send email
router.post('/sendemail', sendEmail);
router.post('/sendemails', sendEmails);


router.post('/addMateri', addMateri);

router.get('/', (req, res) => {
    res.json({
        'haii': 'SELAMAT MALAM !!'
    });
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1000000 } });
// Handle file upload
router.post("/upload", upload.single("file"), uploadss);






const { database, writeUserData } = require('../configReal');
router.post('/adduser', (req, res) => {
    const { userId, name, email, imageUrl } = req.body;

    // Call the writeUserData function defined in database.js
    writeUserData(userId, name, email, imageUrl);

    res.status(200).json({ message: 'User data added successfully' });
});

router.get('/getuserdata/:userId', (req, res) => {
    const userId = req.params.userId;

    // Read data from the database
    const userRef = database.ref('users/' + userId);
    userRef.once('value', (snapshot) => {
        const userData = snapshot.val();
        res.status(200).json(userData);
    });
});
apps.use('/.netlify/routes/router', router);

module.exports = router;
