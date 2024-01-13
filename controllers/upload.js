
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');

router.use(fileUpload({
    createParentPath: true,
}));

const upload = async (req, res) => {
    // const { file } = req.files;
    if (!req.files || !req.files.file || !req.file.files) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }
    const { files } = req.files;

    if (!file) {
        return res.status(400).json({ message: 'No files were uploadedettt.' });
    }
    const { file } = req.files;

    // Move the file to the designated folder
    const assetsFolder = path.join(__dirname, "assets");
    file.mv(path.join(assetsFolder, file.name), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file.', error: err });
        }

        // File uploaded successfully
        res.status(200).json({ message: 'File uploaded successfully.' });
    });
}
// module.exports = router;
module.exports = {
    upload,
    router
};
