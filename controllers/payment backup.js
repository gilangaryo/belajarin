const express = require('express');
const midtransClient = require('midtrans-client');
const db = require("../config");

const member = db.collection("order");

const router = express.Router();
const crypto = require('crypto');
const { CANCELLED } = require('dns');
const { getTransactionById } = require('./orderDataController');
const serverKey = process.env.MIDTRANS_SERVER_KEY;

const addTransaction = async (req, res, transaction_id, price) => {

    const data = price;
    const uid = transaction_id;

    console.log(transaction_id);

    db.collection("order").doc(uid).set({
        order_id: uid,
        price: data
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
};



const pay = async (req, res) => {
    try {
        const uid = crypto.randomUUID();
        const { title, price, selectedDate } = req.body;
        const { startTime, endTime, label, value } = req.body.selectedTime;

        const transaction_id = uid;
        console.log(selectedDate);
        console.log(startTime);
        console.log(endTime);
        console.log(label);
        console.log(value);

        addTransaction(req, res, transaction_id, price);


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
                // "mentor": nama,
                "merchant_name": "BELAJARIN"
            },
        };

        snap.createTransaction(parameter)
            .then((transaction) => {
                const dataPayment = {
                    response: JSON.stringify(transaction)
                }
                const token = transaction.token



                res.status(200).json({ message: "berhasil", dataPayment, token })
            })

    } catch (error) {
        res.status(400).send(error.message);
    }
};



const updateTransactionStatus = async (req, res) => {
    const { transaction_id } = req.params;
    const { status } = req.body;
    const transaction = await transactionService.updateTransactionStatus({ transaction_id, status });

    const data = price;
    const uid = transaction_id;

    console.log(transaction_id);

    db.collection("order").doc(uid).set({
        order_id: uid,
        price: data,
        status: status
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    res.json({
        status: 'success',
        data: transaction
    })
};

const updateStatusResponseMidtrans = async (transaction_id, data) => {
    const hash = crypto.createHash('sha512').update(`${transaction_id}${data.status_code}${data.gross_amount}${serverKey}`).digest('hex');
    if (data.signature_key !== hash) {
        return {
            status: 'error',
            message: 'Invalid signature key'
        }
    }
    let responseData = null;
    let transactionStatus = data.transaction_status;
    let fraudStatus = data.fraudStatus;


    if (transactionStatus == 'capture') {
        if (fraudStatus == 'accept') {
            const transaction = await transactionService.updateTransactionStatus({ transaction_id, status: PAID, payment_method: data.payment_type });
            responseData = transaction;
        }
    } else if (transactionStatus == 'settlement') {
        const transaction = await transactionService.updateTransactionStatus({ transaction_id, status: PAID, payment_method: data.payment_type });
        responseData = transaction;
    } else if (transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire') {
        const transaction = await transactionService.updateTransactionStatus({ transaction_id, status: CANCELLED });
        responseData = transaction;
    } else if (transactionStatus == 'pending') {
        const transaction = await transactionService.updateTransactionStatus({ transaction_id, status: PENDING_PAYMENT });
        responseData = transaction;
    }

    return {
        status: 'success',
        data: responseData
    }
}

const trxNotif = async (req, res) => {
    const data = req.body;
    const transaction_id = data.transaction_id;
    console.log(data);
    console.log(data.transaction_id);
    console.log(data.status_code);
    // getTransactionById({
    //     transaction_id: data.order_id
    // })

    // .then((transaction_id) => {
    if (transaction_id) {
        updateStatusResponseMidtrans(transaction_id, data).then(result => {
            console.log('result', result);
        })
    }
    // })
    res.status(200).json({
        status: 'success',
        message: 'OK'
    })

}

module.exports = {
    pay,
    updateTransactionStatus,
    trxNotif
};