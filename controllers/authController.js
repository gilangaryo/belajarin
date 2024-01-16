const firebase = require('firebase');
const signOut = require('firebase');
const db = require('../config');
const auth = require('../config');
const member = db.collection('member');
const mentor = db.collection('mentor');

const signUp = async (req, res) => {
    try {
        const { nama, email, password } = req.body;
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const uid = userCredential.user.uid;
        const userCred = userCredential.user;
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



const signUpMentor = async (req, res) => {
    try {

        const { nama, email, password } = req.body;
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        const uid = userCredential.user.uid;
        const data = req.body;
        const img = "https://firebasestorage.googleapis.com/v0/b/belajarin-ac6fd.appspot.com/o/profile%2Fprofile.png?alt=media&token=1205b9f2-ba31-4787-834d-1d47ef60b9d3";

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

module.exports = { signUp, login, signUpMentor, loginMentor };
