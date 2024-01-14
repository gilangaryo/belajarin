const express = require('express');
const router = express.Router();
const db = require("../config");


const addMateri = async (req, res) => {
    try {
        // const { category, subCategory, subMenu } = req.params;
        const { title, category, subCategory, subMenu, price, rating, description, mentor_id, mentor_name } = req.body;

        const categoryRef = db.collection('categories').doc(category);
        const subCollectionRef = categoryRef.collection("subCategory").doc(subCategory);
        const subCollectionRef2 = subCollectionRef.collection("subMenu").doc(subMenu);
        const subCollectionRef3 = subCollectionRef2.collection("materi").doc();

        if (title) {

            const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/imagess%2Fpythonnn.png?alt=media&token=b7910944-9334-4a39-aeab-20fe011f289a";

            await subCollectionRef3.set({
                materi_id: subCollectionRef3.id,
                title: title,
                description: description,
                image: img
            });

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
            }));

            res.json(materiData);
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