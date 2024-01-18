
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
const getAllClassMember = async (req, res) => {
    try {
        const documentId = req.params.uid;
        const listClassRef = db.collection("member").doc(documentId).collection("listClassMember");
        const snapshot_class = await listClassRef.get();
        const list_class = [];

        for (const doc of snapshot_class.docs) {
            const materi_id = doc.data().materi_id;
            const material = await getMateriMentor(materi_id);

            list_class.push({
                id: doc.id,
                materi_id: doc.data().materi_id,
                ...doc.data(),
                material
            });
        }

        res.send(list_class);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getMateriMentor = async (materi_id) => {
    try {
        const material = [];

        const mentorSnapshot = await db.collection("mentor").get();

        for (const mentorDoc of mentorSnapshot.docs) {
            const materiSnapshot = await mentorDoc.ref.collection("materi_mentor").where("materi_id", "==", materi_id).get();

            materiSnapshot.forEach((doc2) => {
                const currentMaterial = {
                    mentorName: mentorDoc.data().nama,
                    photoURL: mentorDoc.data().photoURL,
                    title: doc2.data().title,
                    image: doc2.data().image
                };

                material.push(currentMaterial);
            });
        }

        return material;
    } catch (error) {
        console.error('Error getting documents:', error);
        return [];
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
    addMember,
    getAllClassMember
};