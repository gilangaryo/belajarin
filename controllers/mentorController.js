const express = require('express');
const router = express.Router();
const db = require("../config");
const { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } = require('@firebase/storage');
const { sendEmail } = require('../controllers/sendEmailController');
const mentor = db.collection("mentor");
const mentorCollection = db.collection('register');
const getAllMentor = async (req, res) => {
    try {
        const snapshot = await mentor.get();
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send(list);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


require('dotenv').config();

const uploadssss = async (cvFile, portfolioFile, regis_id, res) => {
    try {
        const { appku } = require("../config");
        const storageGet = getStorage(appku);

        // Handle the CV file
        const cvFilename = `cv/${cvFile.originalname}`;
        const cvStorageRef = ref(storageGet, cvFilename);
        await uploadBytes(cvStorageRef, cvFile.buffer, { contentType: cvFile.mimetype });
        const cvDownloadURL = await getDownloadURL(cvStorageRef);

        // Handle the portfolio file
        const portfolioFilename = `portfolio/${portfolioFile.originalname}`;
        const portfolioStorageRef = ref(storageGet, portfolioFilename);
        await uploadBytes(portfolioStorageRef, portfolioFile.buffer, { contentType: portfolioFile.mimetype });
        const portfolioDownloadURL = await getDownloadURL(portfolioStorageRef);

        // Update the document in Firestore with download URLs
        await mentorCollection.doc(regis_id).update({
            cv: cvDownloadURL,
            portfolio: portfolioDownloadURL
        });

        console.log('Files successfully uploaded. CV Download URL:', cvDownloadURL, 'Portfolio Download URL:', portfolioDownloadURL);
    } catch (error) {
        console.error('Error uploading files', error);
        res.status(400).send(error.message);
    }
};



const addMentor = async (req, res) => {
    try {

        const cvFile = req.files.cv[0];
        const portfolioFile = req.files.portfolio[0];

        const image = req.file;
        const member = db.collection("member");
        const {
            name,
            email,
            residenceAddress,
            educationalBackground,
            communityName,
            communityAccountSign,
            // cv,
            // portfolio,
            bankAccountName,
            bankAccountNumber,
            bank,
        } = req.body;

        if (name) {
            if (communityName && communityAccountSign) {
                // const subCollectionRef3 = subCollectionRef2.collection("materi").doc();
                // await subCollectionRef3.set({
                //     materi_id: subCollectionRef3.id,
                //     title: title,
                //     description: description,
                //     image: img
                // });

                const mentorDocRef = mentorCollection.doc();
                await mentorDocRef.set({
                    reg_id: mentorDocRef.id,
                    name: name,
                    email: email,
                    address: residenceAddress,
                    communityName: communityName,
                    communityAccountSign: communityAccountSign,
                    education: educationalBackground,
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    bank: bank
                    // cv: cv,
                    // portfolio: portfolio
                });
                const regis_id = mentorDocRef.id;
                console.log("idnya", regis_id);
                uploadssss(cvFile, portfolioFile, regis_id);
                sendEmail(email, name);
                res.status(201).json({ message: 'Mentor added successfully', mentorId: mentorDocRef.id });
            } else {

                const mentorDocRef = mentorCollection.doc();
                await mentorDocRef.set({
                    reg_id: mentorDocRef.id,
                    name: name,
                    email: email,
                    address: residenceAddress,
                    education: educationalBackground,
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    bank: bank

                });
                const regis_id = mentorDocRef.id;
                console.log("idnya", regis_id);
                uploadssss(cvFile, portfolioFile, regis_id);
                sendEmail(email, name);
                console.log("community");
                res.status(201).json({ message: 'Mentor community added successfully', mentorId: mentorCollection.doc.id });
            }
        } else {
            res.status(406).json({ message: 'salah format', bodyna: req.body });
            console.log("salawe");

        }



    } catch (error) {
        console.error('Error adding mentor:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllMentor,
    addMentor
};
