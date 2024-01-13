const express = require('express');
const midtransClient = require('midtrans-client');
const db = require("../config");

const member = db.collection("order");

const router = express.Router();
const crypto = require('crypto');
const { CANCELLED } = require('dns');
const { getTransactionById } = require('./orderDataController');
const serverKey = "SB-Mid-server-3WYrPmzCYkDDDC8DH4QJlqsf";


const addTransaction = async (req, res, transaction_id, price) => {
    try {
        const data = price;
        const uid = transaction_id;

        if (!uid) {


            return res.status(400).json({ error: 'Invalid request. Missing id parameter.' });
        }

        const newMemberDoc = await member.doc(uid).set({
            ...data
        });

    } catch (error) {
        console.error("Error add:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const pay = async (req, res) => {
    try {

        const { name } = req.body;
        const transaction_id = "aklsdja";
        const price = 50000;
        // addTransaction(transaction_id, price, name);



        if (!transaction_id || !name || !price) {
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
                "first_name": name,
            },
            item_details: {
                "id": transaction_id,
                "price": price,
                "quantity": 1,
                "name": "belajar javascript bersamakuh"
            },
        };

        snap.createTransaction(parameter).then((transaction) => {
            const dataPayment = {
                response: JSON.stringify(transaction)
            }
            const token = transaction.token



            res.status(200).json({ message: "berhasil", dataPayment, token: token })
        })

    } catch (error) {
        res.status(400).send(error.message);
    }
};



const updateTransactionStatus = async (req, res) => {
    const { transaction_id } = req.params;
    const { status } = req.body;
    const transaction = await transactionService.updateTransactionStatus({ transaction_id, status });

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

    getTransactionById({
        transaction_id: data.order_id
    })
        .then((transaction) => {
            if (transaction) {
                updateStatusResponseMidtrans(transaction.id, data).then(result => {
                    console.log('result', result);
                })
            }
        })
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