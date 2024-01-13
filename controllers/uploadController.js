import firebase from "firebase/app";
import "firebase/compat/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAx_TjUwKVveiyLjlmKuQHayjLMNhyYaMw",
    authDomain: "belajarin-ac6fd.firebaseapp.com",
    projectId: "belajarin-ac6fd",
    storageBucket: "gs://belajarin-ac6fd.appspot.com",
    messagingSenderId: "256761147201",
    appId: "1:256761147201:web:f360f4bb7b1d82ad0fbbc0",
    measurementId: "G-367E7RGK43"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Create a root reference
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'
var mountainsRef = storageRef.child('mountains.jpg');

// Create a reference to 'images/mountains.jpg'
var mountainImagesRef = storageRef.child('images/mountains.jpg');

// While the file names are the same, the references point to different files
mountainsRef.name === mountainImagesRef.name;           // true
mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 