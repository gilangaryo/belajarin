const express = require('express');
const router = express.Router();
const db = require("../config");
const { sendEmail } = require('../controllers/sendEmailController');
const mentor = db.collection("mentor");

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


const uploadss = async (req, res) => {
    try {
        const { appku } = require("../config");
        const storageGet = getStorage(appku);

        const cvFile = req.files["cv"][0];
        const portfolioFile = req.files["portfolio"][0];

        // Handle the CV file
        const cvFilename = `cv/${cvFile.originalname}`;
        const cvStorageRef = ref(storageGet, cvFilename);
        await uploadBytes(cvStorageRef, cvFile.buffer, { contentType: cvFile.mimetype });

        // Handle the portfolio file
        const portfolioFilename = `portfolio/${portfolioFile.originalname}`;
        const portfolioStorageRef = ref(storageGet, portfolioFilename);
        await uploadBytes(portfolioStorageRef, portfolioFile.buffer, { contentType: portfolioFile.mimetype });

        console.log('Files successfully uploaded');
        res.send({
            message: 'Files uploaded to firebase storage',
            cv: { name: cvFile.originalname, type: cvFile.mimetype },
            portfolio: { name: portfolioFile.originalname, type: portfolioFile.mimetype },
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};



const addMentor = async (req, res) => {
    try {

        const {
            nama,
            email,
            residenceAddress,
            educationalBackground,
            communityName,
            communityAccountSign,
            cv,
            portfolio,
            bankAccountName,
            bankAccountNumber,
            bank,
        } = req.body;

        if (nama === null) {
            if (communityName === undefined && communityAccountSign === undefined) {
                const mentorCollection = db.collection('register');
                const mentorDocRef = mentorCollection.add({
                    nama: jsonData.nama,
                    email: jsonData.email,
                    address: jsonData.residenceAddress,
                    education: jsonData.educationalBackground,
                    bankAccName: jsonData.bankAccountName,
                    bankNumber: jsonData.bankAccountNumber,
                    bankName: jsonData.bankName,
                    // cv: cv,
                    // portfolio: portfolio
                });

                sendEmail(email);
                sendEmail(email);
                res.status(201).json({ message: 'Mentor added successfully', mentorId: mentorDocRef.id });
            } else {
                const mentorCollection = db.collection('register');
                const mentorDocRef = mentorCollection.add({
                    nama: jsonData.nama,
                    email: jsonData.email,
                    address: jsonData.residenceAddress,
                    education: jsonData.educationalBackground,
                    communityName: jsonData.communityName,
                    communityAcc: jsonData.communityAccountSign,
                    bankAccName: jsonData.bankAccountName,
                    bankNumber: jsonData.bankAccountNumber,
                    bankName: jsonData.bank

                });
                sendEmail(email);
                res.status(201).json({ message: 'Mentor community added successfully', mentorId: mentorDocRef.id });
            }
        } else {
            res.status(406).json({ message: 'salah format', bodyna: req.body });
            console.log(req.body);

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
