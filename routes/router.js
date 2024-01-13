// Example route.js file

const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');
// const uuid = require("uuid-v4");

const app = express();
const serverless = require('serverless-http');


const { getAllMember, getMember, deleteMember, addMember } = require("../controllers/memberController");
const { getAllMentor, addMentor } = require("../controllers/mentorController");
const { signUp, login, logout } = require('../controllers/authController');
const { pay, trxNotif } = require('../controllers/paymentController');
const { getAllcategory, getCategory, getSubCategory, getSubMenu, addSubcategory } = require('../controllers/categoryController');
const { sendEmail, sendEmails } = require('../controllers/sendEmailController');
const { addMateri } = require('../controllers/materiController');
const { getBank } = require('../controllers/bank');
const { uploadsss } = require('../controllers/upload');
const { uploadImageku } = require('../controllers/uploadImage');



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


// category
router.get('/category', getAllcategory);

router.get('/getBank', getBank);

router.get('/category/:category', getCategory);
router.get('/category/:category/:subCategory', getSubMenu);
// router.get('/category/:category/:subCategory/:subMenu', getSubCategory);

// category :programming :mobile-development :

router.post('/category/:category/:subCategory', addSubcategory);
router.post('/category/:category/:subCategory', addSubcategory);

// send email
router.post('/sendemail', sendEmail);
router.post('/sendemails', sendEmails);


router.post('/addMateri', addMateri);

router.get('/', (req, res) => {
    res.json({
        'haii': 'haloo'
    });
});


// router.post('/upload', upload);

router.use(fileUpload({
    createParentPath: true,
}));

router.post('/uploads', (req, res) => {
    const { file } = req.files;


    if (!file) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // Move the file to the designated folder
    const assetsFolder = path.join(__dirname, "assets");
    file.mv(path.join(assetsFolder, file.name), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file.', error: err });
        }

        // File uploaded successfully

        res.status(200).json({ message: 'File uploaded successfully.' });
    });




});


router.post('/uploadImage', uploadImageku);


// router.post("/uploadImage", upload("image"), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send("no file")
//     }

//     const metadata = {
//         metadata: {
//             firebaseStorageDownloadTokens: uuid()
//         },
//         contentType: req.file.mimeType,
//         cacheControl: "public, max-age=31536000"
//     };
//     const blob = bucket.file(req.file.originalname);
//     const blobStream = blob.createWriteStream({
//         metadata: metadata,
//         gzip: truncate
//     });

//     blobStream.on("error", err => {
//         return res.status(500).json({ error: "unable to upload imag" });
//     })

//     blobStream.on("finish", () => {
//         const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//         return res.status(201).json({ imageUrl });
//     });

//     blobStream.end(req.file.buffer);

// });



app.use('/.netlify/routes/router', router);

module.exports = router;
