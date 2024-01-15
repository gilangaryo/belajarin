const { getStorage, ref, uploadBytesResumable, uploadBytes } = require('@firebase/storage');
const { signInWithEmailAndPassword } = require("@firebase/auth");
const { getDownloadURL } = require("@firebase/storage");

require('dotenv').config();


const uploadss = async (req, res) => {
    try {
        const { appku } = require("../config");

        // await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);
        const storageGet = getStorage(appku);

        const fileku = req.file;
        console.log(fileku);

        const filename = `image/${fileku.originalname}`;

        const dateTime = giveCurrentDateTime();
        const metadata = {
            contentType: fileku.mimetype
        };

        const storageRef = ref(storageGet, filename + dateTime);

        await uploadBytes(storageRef, fileku.buffer, metadata);

        console.log('file successfully uploaded');
        res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
};

module.exports = {
    uploadss
};
