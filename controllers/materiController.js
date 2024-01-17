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
        console.log("halo file", req.file);

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
                price: price,
                category: selectedCategory,
                subCategory: selectedSubCategory,
                subMenu: selectedSubMenu
            });

            const mentorCollection = db.collection('mentor').doc(uid);
            const materiMentor = mentorCollection.collection("materi_mentor");
            const materiMentorDocRef = materiMentor.doc(subCollectionRef3.id);
            await materiMentorDocRef.set({
                materi_id: subCollectionRef3.id,
                mentor_id: uid,
                title: title,
                learningPath: learningPath,
                price: price,
                category: selectedCategory,
                subCategory: selectedSubCategory,
                subMenu: selectedSubMenu
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


// const getMateriMentorsatu = async (req, res) => {
//     const { uid } = req.params;

//     var mentor_id = "rGpTUQAnWAW0pTWJavBwY3gDtwQ2";
//     try {
//         const mentorRef = db.collection('mentor');
//         console.log(uid);
//         const materiQuery = await mentorRef.collection('materi').doc(uid).get();

//         if (!materiQuery.empty) {
//             const materiData = materiQuery.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));

//             res.json({ materiData });
//         } else {
//             res.status(404).json({ error: 'Materi not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching materi:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }

// };
const getMateriMentor = async (req, res) => {
    const { materi_id } = req.params;

    try {
        const mentorSnapshot = await db.collection("mentor").get();

        const material = [];
        const mentorData = [];

        for (const mentorDoc of mentorSnapshot.docs) {
            const materiSnapshot = await mentorDoc.ref.collection("materi_mentor").where("materi_id", "==", materi_id).get();

            materiSnapshot.forEach(function (doc2) {
                const currentMentorData = {
                    mentor_id: mentorDoc.id,
                    location: mentorDoc.data().location,
                    uid: mentorDoc.data().uid,
                    nama: mentorDoc.data().nama,
                    email: mentorDoc.data().email,
                    desc_mentor: mentorDoc.data().desc_mentor,
                    photoURL: mentorDoc.data().photoURL

                };

                const currentMaterial = {

                    ...doc2.data(),
                };

                mentorData.push(currentMentorData);
                material.push(currentMaterial);
            });
        }

        if (material.length > 0) {
            res.json({ material, mentorData });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error getting documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// get list mentor
const getAllMateriMentor = async (req, res) => {
    const { mentor_id } = req.params;

    try {
        const materiSnapshot = await db.collection("mentor").doc(mentor_id).collection("materi_mentor").get();

        const materiData = materiSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (materiData.length > 0) {
            res.json({ materiData });
        } else {
            res.status(404).json({ error: 'data tidak ditemukan bray' });
        }
    } catch (error) {
        console.error('Error getting documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {
    addMateri,
    getMateriMentor,
    getAllMateriMentor

};