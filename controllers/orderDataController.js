const express = require('express');
const db = require("../config");
const member = db.collection("member");

// get all transactions
async function getTransactions({ status }) {
    let where = {};
    if (status) {
        where = {
            status
        }
    }

    return prisma.transaction.findMany({
        where,
        include: {
            transactions_items: {
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            image: true
                        }
                    }
                }
            },
        }
    });
}

// get transaction by id
async function getTransactionById({ transaction_id, res }) {
    try {
        const uid = transaction_id;
        const order = db.collection("order");

        const snapshot = await order.doc(uid).get();

        if (!snapshot.exists) {
            return res.status(404).json({ error: 'order not found' });
        }

        const orderData = { id: snapshot.id, ...snapshot.data() };
        console.log(orderData);
        console.log("Document successfully retrieved!");
    } catch (error) {
        console.error("Error getting document: ", error);

        // Check if 'res' is defined before trying to use 'json'
        if (res && typeof res.json === 'function') {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}


// update transaction status    
async function updateTransactionStatus({ transaction_id, status, payment_method = null }) {
    return prisma.transaction.update({
        where: {
            id: transaction_id
        },
        data: {
            status,
            payment_method
        }
    });
}


module.exports = {
    getTransactionById,
    updateTransactionStatus
};
