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
        const { title, selectedCategory, selectedSubCategory, selectedSubMenu, price, learningPath } = req.body;

        console.log(uid);
        const registerDoc = await db.collection("mentor").doc(uid).get();

        if (!registerDoc.exists) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        const mentorName = registerDoc.data().nama;

        console.log("Mentor Name:", mentorName);

        const subCollectionRef3 = await createMateriDocument(db, uid, mentorName, title, selectedCategory, selectedSubCategory, selectedSubMenu, price, learningPath, req.files);

        if (subCollectionRef3) {
            res.status(201).send('Berhasil!');
        } else {
            res.status(500).send('Internal Server Error Red3');
        }
    } catch (error) {
        console.error('Error in addMateri:', error);
        res.status(500).send('Internal Server Error Error');
    }
};

const createMateriDocument = async (db, uid, mentorName, title, selectedCategory, selectedSubCategory, selectedSubMenu, price, learningPath, files) => {
    try {
        const categoryRef = db.collection('categories').doc(selectedCategory);
        const subCollectionRef = categoryRef.collection("subCategory").doc(selectedSubCategory);
        const subCollectionRef2 = subCollectionRef.collection("subMenu").doc(selectedSubMenu);
        const subCollectionRef3 = subCollectionRef2.collection("materi").doc();

        await subCollectionRef3.set({
            materi_id: subCollectionRef3.id,
            mentor_id: uid,
            mentor_name: mentorName,
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

        if (files && files.file[0] && files.file.length > 0) {
            const imgFile = files.file[0];
            const { appku } = require("../config");
            const storageGet = getStorage(appku);

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
            console.error('Image file is missing or empty.');
        }
        res.status(201).send('Berhasil tambah!');
        return subCollectionRef3;
    } catch (error) {
        console.error('Error creating materi document:', error);
        res.status(500).send('Internal Server Error');
        return null;
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








const getAllMaterial = async (req, res) => {
    try {
        const materiSnapshot = await db.collectionGroup('materi').get();

        const materiData = materiSnapshot.docs.map(doc => ({
            // category_id: doc.ref.parent.parent.parent.id,
            // subcategory_id: doc.ref.parent.parent.id,
            // submenu_id: doc.ref.parent.id,
            // document_id: doc.ref.id,
            ...doc.data()
        }));

        if (materiData.length > 0) {
            res.json({ materiData });
        } else {
            res.status(404).json({ error: 'data tidak ditemukan bray' });
        }

    } catch (error) {
        console.error('Error getting materi documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    addMateri,
    getMateriMentor,
    getAllMateriMentor,
    getAllMaterial

};