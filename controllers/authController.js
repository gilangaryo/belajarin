const firebase = require('firebase');
const signOut = require('firebase');
const db = require('../config');
const auth = require('../config');
const member = db.collection('member');

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
                        msg: "User Logged in",
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



const login2 = async (req, res) => {
    try {
        const { email, password } = req.body;
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
            return user.getIdToken().then(idToken => {
                const csrfToken = getCookie('csrfToken')
                return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
            });
        }).then(() => {
            return firebase.auth().signOut();
        }).then(() => {
            window.location.assign('/profile');
        });

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

module.exports = { signUp, login, logout };
