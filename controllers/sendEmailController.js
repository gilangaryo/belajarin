const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = require("../config");


const serviceAccount = require("../routes/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://belajarin-ac6fd.firebaseio.com"
});


const sendEmail = async (email) => {
    // const { email } = req.body;
    admin
        .firestore()
        .collection("mail")
        .add({
            to: email,
            message: {
                subject: "Status Mentor",
                text: "Hi sayang tunggu 5 hari ya buat ketemu hehehehehe",
                html: `
                <html>
                    <head>
                        <style>
                            /* Add your CSS styles here if needed */
                        </style>
                    </head>
                    <body>
                        <h1>Hello from Belajarin</h1>
                        <p>This is the HTML section of the email body.</p>
                        <code>This is a code snippet.</code>
                    </body>
                </html>
            `,
            },
        })
        .then(() => {
            console.log("Queued email for delivery!");

        })
        .catch((error) => {
            console.error("Error sending email:", error);

        });
};




const sendEmails = async (req, res) => {
    const { emails } = req.body;
    const emailPromises = [];

    emails.forEach(async (email) => {
        try {

            const userSnapshot = await admin.firestore().collection("register").where("email", "==", email).get();

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                const { name } = userData;

                const emailPromise = admin.firestore().collection("mail").add({
                    to: email,
                    message: {
                        subject: "Status Mentor multiple",
                        text: "text ???",
                        html: `
                            <html>
                                <head>
                                    <style>
                                        /* Add your CSS styles here if needed */
                                    </style>
                                </head>
                                <body>
                                    <h1>Hello from Belajarin!</h1>
                                    <p>Hai ${name || 'User'}, stay tune in belajarin yaa!</p>
                                    <code>This is a code snippet.</code>
                                </body>
                            </html>
                        `,
                    },
                });

                emailPromises.push(emailPromise);
            } else {
                console.error(`User not found for email: ${email}`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });


    Promise.all(emailPromises)
        .then(() => {
            console.log("Emails for delivery!");
            res.send("Emails sent successfully.");
        })
        .catch((error) => {
            console.error("Error sending emails:", error);
            res.status(500).send("Internal Server Error");
        });
};


module.exports = {
    sendEmail,
    sendEmails
};
