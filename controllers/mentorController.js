const express = require('express');
const router = express.Router();
const db = require("../config");
const { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } = require('@firebase/storage');
const { sendEmail, sendEmails } = require('../controllers/sendEmailController');
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

const uploadssss = async (cvFile, portfolioFile, keanggotaanFile, regis_id, res) => {
    try {
        const { appku } = require("../config");
        const storageGet = getStorage(appku);

        // Handle the CV file
        const cvFilename = `register/${regis_id}/cv/${cvFile.originalname}`;
        const cvStorageRef = ref(storageGet, cvFilename);
        await uploadBytes(cvStorageRef, cvFile.buffer, { contentType: cvFile.mimetype });
        const cvDownloadURL = await getDownloadURL(cvStorageRef);

        // Handle the portfolio file
        const portfolioFilename = `register/${regis_id}/portfolio/${portfolioFile.originalname}`;
        const portfolioStorageRef = ref(storageGet, portfolioFilename);
        await uploadBytes(portfolioStorageRef, portfolioFile.buffer, { contentType: portfolioFile.mimetype });
        const portfolioDownloadURL = await getDownloadURL(portfolioStorageRef);

        // Handle the portfolio file
        const keanggotaanFilename = `register/${regis_id}/keanggotaan/${keanggotaanFile.originalname}`;
        const keanggotaanStorageRef = ref(storageGet, keanggotaanFilename);
        await uploadBytes(keanggotaanStorageRef, keanggotaanFile.buffer, { contentType: keanggotaanFile.mimetype });
        const keanggotaanDownloadURL = await getDownloadURL(keanggotaanStorageRef);

        // Update the document in Firestore with download URLs
        await mentorCollection.doc(regis_id).update({
            cv: cvDownloadURL,
            portfolio: portfolioDownloadURL,
            keanggotaan: keanggotaanDownloadURL
        });

        console.log('Files successfully uploaded. CV Download URL:', cvDownloadURL);
        console.log('Files successfully uploaded. Portfolio Download URL:', portfolioDownloadURL);
        console.log('Files successfully uploaded. keanggotaan URL:');
    } catch (error) {
        console.error('Error uploading files', error);
        res.status(400).send(error.message);
    }
};



const addMentor = async (req, res) => {
    try {

        console.log("filessnya: ", req.files);
        // console.log("FILE REQUESTNYAA  ", req);
        const cvFile = req.files.cv[0];
        console.log(cvFile);
        console.log(req.body);
        const portfolioFile = req.files.portfolio[0];


        // const image = req.file;
        // const member = db.collection("member");
        const {
            nama,
            email,
            residenceAddress,
            educationalBackground,
            communityName,
            bankAccountName,
            bankAccountNumber,
            bank,
        } = req.body;

        if (nama) {
            if (communityName) {
                // const subCollectionRef3 = subCollectionRef2.collection("materi").doc();
                // await subCollectionRef3.set({
                //     materi_id: subCollectionRef3.id,
                //     title: title,
                //     description: description,
                //     image: img
                // });
                const keanggotaanFile = req.files.keanggotaan[0];
                const mentorDocRef = mentorCollection.doc();
                await mentorDocRef.set({
                    reg_id: mentorDocRef.id,
                    name: nama,
                    email: email,
                    address: residenceAddress,
                    communityName: communityName,
                    education: educationalBackground,
                    bankAccountName: bankAccountName,
                    bankAccountNumber: bankAccountNumber,
                    bank: bank
                    // cv: cv,
                    // portfolio: portfolio
                });
                const regis_id = mentorDocRef.id;
                console.log("idnya", regis_id);
                uploadssss(cvFile, portfolioFile, keanggotaanFile, regis_id);
                sendEmail(email, nama);
                res.status(201).json({ message: 'Mentor added successfully', mentorId: mentorDocRef.id });
            } else {

                const mentorDocRef = mentorCollection.doc();
                await mentorDocRef.set({
                    reg_id: mentorDocRef.id,
                    name: nama,
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
                sendEmail(email, nama);
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


const getAllDate = async (req, res) => {
    try {
        const jadwal = db.collection("mentor").doc("xcpPYjTRcHBFM0gOMyZj").collection("jadwal");
        const snapshot_jadwal = await jadwal.get();
        const list_jadwal = snapshot_jadwal.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send(list_jadwal);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


module.exports = {
    getAllMentor,
    addMentor,
    getAllDate
};
