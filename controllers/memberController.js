
const express = require('express');
const router = express.Router();
const db = require("../config");

const member = db.collection("member");
const getAllMember = async (req, res) => {
    try {
        const snapshot = await member.get();
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send(list);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getMember = async (req, res) => {
    try {
        const uid = req.params.id;
        const snapshot = await member.doc(uid).get();

        if (!snapshot.exists) {
            return res.status(404).json({ error: 'Member not found' });
        }

        const memberData = { id: snapshot.id, ...snapshot.data() };
        res.json(memberData);
    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// const updateMember = async (req, res) => {
//     const uid = req.params.id;

//     if (!uid) {
//         return res.status(400).json({ error: 'UID is required in the query parameters' });
//     }

//     try {
//         delete req.body.id;
//         const data = req.body;
//         await member.doc(uid).update(data);
//         res.send({ msg: "Updated" });

//     } catch (error) {
//         console.error("Error fetching member:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const deleteMember = async (req, res) => {

    const uid = req.params.id;

    if (!uid) {
        return res.status(400).json({ error: 'UID is required in the query parameters' });
    }

    try {
        await member.doc(uid).delete();
        res.send({ msg: "Deleted" });

    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addMember = async (req, res) => {
    try {
        const { uid, nama, email, profilePic } = req.body;

        const memberDocRef = member.doc(uid);

        // Use set to create or update the document with the specified ID
        await memberDocRef.set({
            uid: uid,
            nama: nama,
            email: email,
            profilePic: profilePic
        });

        res.send("makasih JEK");
    } catch (error) {
        res.status(400).send(error.message);
    }
};



module.exports = {
    getAllMember,
    getMember,
    // updateMember,
    deleteMember,
    addMember
};