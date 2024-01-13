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

        if (communityName === undefined && communityAccountSign === undefined) {
            const mentorCollection = db.collection('register');
            const mentorDocRef = mentorCollection.add({
                nama: nama,
                email: email,
                address: residenceAddress,
                education: educationalBackground,
                bankAccName: bankAccountName,
                bankNumber: bankAccountNumber,
                bankName: bank

            });

            // sendEmail(email);
            res.status(201).json({ message: 'Mentor added successfully', mentorId: mentorDocRef.id });
        } else {
            const mentorCollection = db.collection('register');
            const mentorDocRef = mentorCollection.add({
                nama: nama,
                email: email,
                address: residenceAddress,
                education: educationalBackground,
                communityName: communityName,
                communityAcc: communityAccountSign,
                bankAccName: bankAccountName,
                bankNumber: bankAccountNumber,
                bankName: bank

            });
            // sendEmail(email);
            res.status(201).json({ message: 'Mentor community added successfully', mentorId: mentorDocRef.id });
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
