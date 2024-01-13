const admin = require("firebase-admin");
const express = require('express');
const multer = require('multer');
const { v4: uuid } = require('uuid');

const app = express();

// Check if the app is already initialized
if (!admin.apps.length) {
    const serviceAccount = require("./belajarin-ac6fd-firebase-adminsdk-u8o70-db638e484e.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "gs://belajarin-ac6fd.appspot.com"
    });
}

const bucket = admin.storage().bucket("image");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageku = async (req, res) => {

    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No file");
    }

    const metadata = {
        metadata: {
            firebaseStorageDownloadTokens: uuid()
        },
        contentType: req.files.image.mimetype,
        cacheControl: "public, max-age=31536000"
    };

    console.log(req.files);
    const blob = bucket.file(req.files.image.name);
    const blobStream = blob.createWriteStream({
        metadata: metadata,
        gzip: { enabled: true }
    });

    blobStream.on("error", (err) => {
        return res.status(500).json({ error: "Unable to upload image" });
    });

    blobStream.on("finish", () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        return res.status(201).json({ imageUrl });
    });

    blobStream.end(req.files.image.buffer);
};

module.exports = {
    uploadImageku
};
