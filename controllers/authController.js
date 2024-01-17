const firebase = require('firebase');
const signOut = require('firebase');
const db = require('../config');
const auth = require('../config');
const { sendEmail } = require('./sendEmailController');
const member = db.collection('member');
const mentor = db.collection('mentor');

const signUp = async (req, res) => {
    try {
        const { nama, email, password } = req.body;


        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const uid = userCredential.user.uid;
        // const userCred = userCredential.user;
        const data = req.body;
        const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/profile%2Fprofile.png?alt=media&token=1205b9f2-ba31-4787-834d-1d47ef60b9d3";

        const user = firebase.auth().currentUser;
        await user.updateProfile({
            displayName: nama,
            photoURL: img
        });
        await member.doc(uid).set({
            uid: uid,
            displayName: nama,
            photoURL: img,
            role: "member",
            ...data
        });
        const updatedUser = firebase.auth().currentUser;
        res.send(updatedUser);
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            res.status(400).send("Email anda sudah terdaftar!");
        } else {
            res.status(400).send(error.message);
        }
    }
};


const login = async (req, res) => {
    try {
        if (!req.body) {
            res.send("halo jek");
            return;
        }

        const { email, password } = req.body;
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const userCred = userCredential.user;

        // Retrieve user document from Firestore
        const userRef = member.doc(userCred.uid);
        const userDoc = await userRef.get();

        if (userCred) {
            // Get the user's ID token
            const idToken = await userCred.getIdToken(true);

            // Access the user document and role
            const role = userDoc.data().role;

            res.send({
                uid: userCred.uid,
                user: userCred.displayName,
                email: userCred.email,
                img: userCred.photoURL,
                role: role,
                msg: "User Logged in",
                accessToken: idToken
            });
        } else {
            res.status(401).send({
                error: 'User not authenticated'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
};



const loginMentor = async (req, res) => {
    try {

        if (!req.body) {
            res.send("halo jek");
        };
        const { email, password } = req.body;
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const userCred = userCredential.user;
        const user = await firebase.auth().currentUser;


        if (user) {
            user.getIdToken(true)
                .then((idToken) => {
                    res.send({
                        uid: userCred.uid,
                        user: userCred.displayName,
                        email: userCred.email,
                        img: userCred.photoURL,
                        msg: "Mentor Logged in",
                        accessToken: idToken
                    });

                })
                .catch((error) => {
                    res.status(500).send({
                        error: error.message
                    });
                });
        } else {
            res.status(401).send({
                error: 'User not authenticated'
            });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
};



const daftarMentorByAdmin = async (req, res) => {
    try {

        const { nama, email, password, id } = req.body;
        const registerDoc = await db.collection("register").doc(id).get();

        if (registerDoc.exists) {
            const registerData = {
                id: registerDoc.id,
                ...registerDoc.data()
            };
            console.log(registerData);
            res.json({ registerData });
        } else {
            res.status(404).json({ error: 'Register data not found' });
        }

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const uid = userCredential.user.uid;
        const data = req.body;


        const user = firebase.auth().currentUser;
        await user.updateProfile({
            displayName: nama,
            photoURL: img
        });
        await mentor.doc(uid).set({
            uid: uid,
            displayName: nama,
            photoURL: img,
            role: "mentor",
            ...data
        });
        const updatedUser = firebase.auth().currentUser;
        res.send(updatedUser);
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            res.status(400).send("Email sudah terdaftar!");
        } else {
            res.status(400).send(error.message);
        }
    }
};

const accMentor = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.body;
        const registerDoc = await db.collection("register").doc(id).get();

        console.log(registerDoc.data());
        if (!registerDoc.exists) {
            return res.status(404).json({ error: 'Mentor reg not found' });
        }

        const nama = registerDoc.data().name;
        const email = registerDoc.data().email;

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const member = db.collection('member');
        await member.doc(id).set({
            uid: id,
            displayName: nama,
            photoURL: img,
            role: "mentor",
            ...data
        });
        const uid = userCredential.user.uid;
        const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/profile%2Fprofile.png?alt=media&token=1205b9f2-ba31-4787-834d-1d47ef60b9d3";
        const mentorCollection = db.collection('mentor').doc(id);
        const registerSubcollectionRef = mentorCollection.collection('register').doc(id);
        await mentorCollection.set({
            uid: id,
            displayName: nama,
            photoURL: img,
            role: "mentor",

        });
        await registerSubcollectionRef.set({
            ...registerDoc.data()
        });

        // FUNGSI DELETE

        // db.collection("register").doc(id).delete().then(() => {
        //     console.log("Document successfully deleted!");
        // }).catch((error) => {
        //     console.error("Error removing document: ", error);
        // });

        res.status(200).json({ message: 'Mentor account created successfully' });
    } catch (error) {
        // Handle different error cases
        console.error('Error in accMentor:', error);

        if (error.code === 'auth/email-already-in-use') {
            res.status(400).send('Email sudah terdaftar!');
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};


const logout = async (req, res) => {
    try {
        signOut(auth)
            .then(() => {
                res.send("LOGOUT");
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { signUp, login, daftarMentorByAdmin, loginMentor, accMentor };
