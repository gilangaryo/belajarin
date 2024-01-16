const express = require('express');
const router = express.Router();
const db = require("../config");
const { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } = require('@firebase/storage');

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
        // const { category, subCategory, subMenu } = req.params;
        const { title, category, subCategory, subMenu, price, rating, description, mentor_id, mentor_name } = req.body;
        const imgFile = req.files.img[0];

        const categoryRef = db.collection('categories').doc(category);
        const subCollectionRef = categoryRef.collection("subCategory").doc(subCategory);
        const subCollectionRef2 = subCollectionRef.collection("subMenu").doc(subMenu);
        const subCollectionRef3 = subCollectionRef2.collection("materi").doc();


        if (imgFile) {
            // const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/imagess%2Fpythonnn.png?alt=media&token=b7910944-9334-4a39-aeab-20fe011f289a";

            uploadssss(imgFile, portfolioFile, regis_id);
            await subCollectionRef3.set({
                materi_id: subCollectionRef3.id,
                title: title,
                description: description,
                image: img
            });

            const { appku } = require("../config");
            const storageGet = getStorage(appku);

            // Handle the img file
            const imgFilename = `materi/${subCollectionRef3.id}/${imgFile.originalname}`;
            const imgStorageRef = ref(storageGet, imgFilename);
            await uploadBytes(imgStorageRef, imgFile.buffer, { contentType: imgFile.mimetype });
            const imgDownloadURL = await getDownloadURL(imgStorageRef);

            // Update the document in Firestore with download URLs
            await mentorCollection.doc(regis_id).update({
                img: imgDownloadURL,
                portfolio: portfolioDownloadURL
            });

            console.log('Files successfully uploaded. img Download URL:', imgDownloadURL, 'Portfolio Download URL:', portfolioDownloadURL);

            res.status(201).send('SUKSES ANJAYY!!');
        } else {
            res.status(400).send('Subcollection name is missing in the request body');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

};


const getMateriMentor = async (req, res) => {
    const { uid } = req.params;

    try {
        // Perform a collection group query to find the document with the matching uid
        const querySnapshot = await db.collectionGroup('materi').where('uid', '==', uid).get();

        if (!querySnapshot.empty) {
            // If documents are found, return the data
            const materiData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))[0]; // Use [0] to get the first element because it's an array

            // Check if materiData contains mentor_id
            if (materiData && materiData.mentor_id) {
                // Perform a query to get the mentor data
                const queryMentor = await db.collection('mentor').where('uid', '==', materiData.mentor_id).get();

                if (!queryMentor.empty) {
                    // If mentor documents are found, return the data
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



const getMateriMentor2 = async (req, res) => {

    try {
        const { uid } = req.params;
        // const { uid, nama, email, profilePic } = req.body;
        const { category, subCategory, subMenu } = req.body;
        // const category = req.body.category;
        console.log(category);

        // console.log(subCategory);
        // console.log(subMenu);
        // ambil kategori
        const categoryRef = db.collection('categories').doc(category);


        // // ambil subkategori
        const subCategoryRef = categoryRef.collection("subCategory").doc(subCategory);

        // // ambil submenu
        const subMenuRef = subCategoryRef.collection("subMenu").doc(subMenu);

        // // ambil materi
        const materiRef = subMenuRef.collection("materi").doc(uid);

        const snapshot = await materiRef.get();

        if (snapshot) {
            const submenu = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            res.send(submenu);
        }

    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};


module.exports = {
    addMateri,
    getMateriMentor

};