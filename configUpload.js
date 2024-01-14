// // Import Firebase SDK
// const { initializeApp } = require("firebase/app");
// const { getAuth } = require("@firebase/auth");
// const { Firestore, CollectionReference } = require("@firebase/firestore");
// require('dotenv').config();

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = new Firestore();

// // Export the auth and db for use in other files
// module.exports = { db };
// exports.auth = auth;
