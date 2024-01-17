const express = require('express');
const router = express.Router();
const db = require("../config");
const { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } = require('@firebase/storage');
const { collection, getDocs } = require("@firebase/firestore");
const uploadssss = async (imgFile, portfolioFile, regis_id, res) => {
    try {
        const { appku } = require("../config");
        const storageGet = getStorage(appku);

        // Handle the img file
        const imgFilename = `materi/${imgFile.originalname}`;
        const imgStorageRef = ref(storageGet, imgFilename);
        await uploadBytes(imgStorageRef, imgFile.buffer, { contentType: imgFile.mimetype });
        const imgDownloadURL = await getDownloadURL(imgStorageRef);

        // Update the document in Firestore with download URLs
        await mentorCollection.doc(regis_id).update({
            img: imgDownloadURL,
            portfolio: portfolioDownloadURL
        });

        console.log('Files successfully uploaded. img Download URL:', imgDownloadURL, 'Portfolio Download URL:', portfolioDownloadURL);
    } catch (error) {
        console.error('Error uploading files', error);
        res.status(400).send(error.message);
    }
};


const addMateri = async (req, res) => {
    try {
        const db = require('../config');
        const { uid } = req.params;
        // , mentor_id, mentor_name
        // const mentor_id = "xcpPYjTRcHBFM0gOMyZj";
        // const mentor_name = "jeki";
        const { title, selectedCategory, selectedSubCategory, selectedSubMenu, price, learningPath } = req.body;


        const mentor_name = "tes ganti nama";


        console.log("halo", req.files);

        // console.log(imgFile);
        console.log("hai body", req.body);
        const categoryRef = db.collection('categories').doc(selectedCategory);
        const subCollectionRef = categoryRef.collection("subCategory").doc(selectedSubCategory);
        const subCollectionRef2 = subCollectionRef.collection("subMenu").doc(selectedSubMenu);
        const subCollectionRef3 = subCollectionRef2.collection("materi").doc();


        if (uid) {
            // const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/imagess%2Fpythonnn.png?alt=media&token=b7910944-9334-4a39-aeab-20fe011f289a";

            await subCollectionRef3.set({
                materi_id: subCollectionRef3.id,
                mentor_id: uid,
                mentor_name: mentor_name,
                title: title,
                learning_path: learningPath,
                price: price
            });

            const mentorCollection = db.collection('mentor').doc(uid);
            const materiMentor = mentorCollection.collection("materi");
            const materiMentorDocRef = materiMentor.doc(subCollectionRef3.id);
            await materiMentorDocRef.set({
                materi_id: subCollectionRef3.id,
                title: title,
                learningPath: learningPath,
                price: price
            });
            console.log("hai berhasil masuk mentor : ", req.files.file[0]);
            // console.log("hai berhasil masuk mentor : ", req.files.file[0]);

            // Check if req.files.image is defined and has at least one element
            if (req.files && req.files.file[0] && req.files.file.length > 0) {
                const imgFile = req.files.file[0];
                const { appku } = require("../config");
                const storageGet = getStorage(appku);

                // Handle the img file
                const imgFilename = `materi/${uid}/${subCollectionRef3.id}/${imgFile.originalname}`;
                const imgStorageRef = ref(storageGet, imgFilename);
                await uploadBytes(imgStorageRef, imgFile.buffer, { contentType: imgFile.mimetype });
                const imgDownloadURL = await getDownloadURL(imgStorageRef);

                await subCollectionRef3.update({
                    image: imgDownloadURL
                });

                await materiMentorDocRef.update({
                    image: imgDownloadURL
                });

                console.log('Files successfully uploaded. img Download URL:', imgDownloadURL);

            } else {
                // Handle the case when req.files.image is undefined or empty
                console.error('Image file is missing or empty.');
            }


            res.status(201).send('Berhasil!');
        } else {
            res.status(400).send('uid tidak ada');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

};


const getMateriMentor = async (req, res) => {
    const { uid } = req.params;

    try {
        const querySnapshot = await db.collectionGroup('materi').where('uid', '==', uid).get();
        console.log(uid);
        if (!querySnapshot.empty) {
            const materiData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Check if materiData contains mentor_id
            if (materiData.length > 0 && materiData[0].mentor_id) {
                const queryMentor = await db.collection('mentor').where('uid', '==', materiData[0].mentor_id).get();

                if (!queryMentor.empty) {
                    const mentorData = queryMentor.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Return both materiData and mentorData
                    res.json({ materiData, mentorData });
                } else {
                    // If no mentor documents are found, return a 404 status
                    res.status(404).json({ error: 'Mentor not found' });
                }
            } else {
                // If no mentor_id is found in materiData, return a 404 status
                res.status(404).json({ error: 'Mentor_id not found in Materi data' });
            }
        } else {
            // If no documents are found, return a 404 status
            res.status(404).json({ error: 'Materi not found' });
        }
    } catch (error) {
        // Handle errors
        console.error('Error fetching materi:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};




module.exports = {
    addMateri,
    getMateriMentor

};