const express = require('express');
const midtransClient = require('midtrans-client');
const db = require("../config");

const orderCollection = db.collection("order"); // Change variable name for clarity

const router = express.Router();
const crypto = require('crypto');
const serverKey = process.env.MIDTRANS_SERVER_KEY;

const addTransaction = async (transaction_id, price, materi_id, uid) => {
    try {
        const transaction_uid = transaction_id;
        const harga = price;
        await orderCollection.doc(transaction_uid).set({
            order_id: transaction_uid,
            price: harga,
            materi_id: materi_id,
            id_member: uid

        });
        console.log("order tambah!");
    } catch (error) {
        console.error("Error writing document: ", error);
    }
};

const pay = async (req, res) => {
    try {
        const random_uid = crypto.randomUUID();

        const { title, totalAmount, materi_id, uid } = req.body;
        const { selectedTime } = req.body;
        const price = totalAmount;
        // req body materi_id
        // DUMMY TOLONG DIGANTI

        const transaction_id = random_uid;
        console.log(price);

        await addTransaction(transaction_id, price, materi_id, uid);

        if (!transaction_id || !title || !price) {
            throw new Error("Invalid request. Missing required parameters.");
        }

        const clientKey = "SB-Mid-client-fxxfR1HkBON9Jw1t";
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: serverKey,
            clientKey: clientKey,
        });

        const parameter = {
            transaction_details: {
                "order_id": transaction_id,
                "gross_amount": price,
            },
            customer_details: {
                "first_name": "dummy nama",
            },
            item_details: {
                "id": transaction_id,
                "price": price,
                "quantity": 1,
                "name": title,
                "merchant_name": "BELAJARIN"
            },
        };

        snap.createTransaction(parameter)
            .then((transaction) => {
                const dataPayment = {
                    response: JSON.stringify(transaction)
                }
                const token = transaction.token;

                res.status(200).json({ message: "berhasil", dataPayment, token })
            });

    } catch (error) {
        res.status(400).send(error.message);
    }
};

const updateStatus = async (transaction_id, status,) => {
    try {
        // const data = price; // Ensure that you have 'price' defined somewhere in your code
        await orderCollection.doc(transaction_id).update({
            order_id: transaction_id,
            status: status
        });
        console.log("Document successfully written!");
    } catch (error) {
        console.error("Error writing document: ", error);
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { transaction_id, status, payment_method } = req.body;
        if (!transaction_id || !status) {
            return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
        }

        await updateStatus(transaction_id, status);

        res.json({
            status: 'success',
            data: { transaction_id, status, payment_method } // Adjust with the actual data you want to return
        });

    } catch (error) {
        console.error('Error updating transaction status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateStatusResponseMidtrans = async (transaction_id, data) => {
    try {
        const hash = crypto.createHash('sha512').update(`${transaction_id}${data.status_code}${data.gross_amount}${serverKey}`).digest('hex');
        if (data.signature_key !== hash) {
            return {
                status: 'error',
                message: 'Invalid signature key'
            };
        }

        let responseData = null;
        let transactionStatus = data.transaction_status;
        let fraudStatus = data.fraudStatus;

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'accept') {
                console.log(transaction_id);
                await updateStatus(transaction_id, "PAID");

                console.log("update member mentor");
                // UPDATE KELAS DI MEMBER DAN MENTOR
                await updateMentorMember(transaction_id);

                responseData = { transaction_id, status: "PAID", payment_method: data.payment_type };
            }
        } else if (transactionStatus == 'settlement') {
            await updateStatus(transaction_id, "PAID");
            responseData = { transaction_id, status: "PAID", payment_method: data.payment_type };
        } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire') {
            await updateStatus(transaction_id, "CANCELLED");
            responseData = { transaction_id, status: "CANCELLED" };
        } else if (transactionStatus == 'pending') {
            await updateStatus(transaction_id, "PENDING_PAYMENT");
            responseData = { transaction_id, status: "PENDING_PAYMENT" };
        }

        return {
            status: 'success',
            data: responseData
        };
    } catch (error) {
        console.error('Error updating status response from Midtrans:', error);
        return {
            status: 'error',
            message: 'Internal Server Error'
        };
    }
};

const trxNotif = async (req, res) => {
    try {
        const data = req.body;
        const transaction_id = data.order_id;
        console.log(data.order_id);
        console.log(data.transaction_id);
        console.log(data.status_code);

        if (transaction_id) {
            const result = await updateStatusResponseMidtrans(transaction_id, data);
            console.log('result', result);
        }

        res.status(200).json({
            status: 'success',
            message: 'OK'
        });

    } catch (error) {
        console.error('Error processing Midtrans notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const updateMentorMember = async (req) => {
    try {
        const db = require("../config");
        // tinggal ini diganti
        const transaction_id = req.body.transaction_id;
        const userSnapshot = await db.collection("order").where("order_id", "==", transaction_id).get();

        if (!userSnapshot.empty) {
            // const uid = userSnapshot.docs[0].data().uid;
            const materi_id = userSnapshot.docs[0].data().materi_id;

            const id_member = "id_member";
            const member = db.collection('member').doc(id_member);
            const memberSub = member.collection('listClass').doc(materi_id);

            await memberSub.set({
                cek: "masuk ga ?",
                materi_id: materi_id
            });

            const id_mentor = "id_mentor";
            const mentor = db.collection('mentor').doc(id_mentor);
            const mentorSub = mentor.collection('listClass').doc(materi_id);

            await mentorSub.set({
                cek: "masuk ya?",
                materi_id: materi_id
            });

            console.log("Order updated successfully!");
        } else {
            console.log("No matching documents found for the given transaction_id.");
        }
    } catch (error) {
        console.error("Error updating mentor and member:", error);
    }
};


module.exports = {
    pay,
    updateTransactionStatus,
    trxNotif
};




