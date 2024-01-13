
const express = require('express');
const router = express.Router();
const db = require("../config");

const getAllcategory = async (req, res) => {
    const categoryCollection = db.collection("categories");

    try {
        const categoriesSnapshot = await categoryCollection.get();
        const allCategories = [];

        for (const categoryDoc of categoriesSnapshot.docs) {
            const categoryId = categoryDoc.id;
            const subCollectionRef = categoryDoc.ref.collection('subCategory');

            const subCollectionSnapshot = await subCollectionRef.get();
            const subCollection = subCollectionSnapshot.docs.map((doc) => ({
                key: categoryId,
                label: categoryDoc.title,
                id: doc.id,
                ...doc.data()
            }));

            const categoryWithSubMenu = {
                key: categoryId,
                label: categoryDoc.data().title,
                subMenu: []
            };

            for (const subCatItem of subCollection) {
                const subMenuRef = subCollectionRef.doc(subCatItem.id).collection('subMenu');
                const subMenuSnapshot = await subMenuRef.get();

                const submenu = subMenuSnapshot.docs.map((doc) => ({

                    id: doc.id,
                    ...doc.data()
                }));

                const subCategoryWithMenu = {
                    key: subCatItem.id,
                    label: subCatItem.title,

                    sub_image: subCatItem.image,
                    children: submenu,
                };

                categoryWithSubMenu.subMenu.push(subCategoryWithMenu);
            }

            allCategories.push(categoryWithSubMenu);
        }

        res.send(allCategories);
    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};




const getCategory = async (req, res) => {
    const categoryCollection = db.collection("categories");
    try {
        const categoryRef = req.params.category;
        const categoriesSnapshot = await categoryCollection.doc(categoryRef).get();
        const allCategories = [];

        for (const categoryDoc of categoriesSnapshot.docs) {
            const categoryId = categoryDoc.id;
            const subCollectionRef = categoryDoc.ref.collection('subCategory');

            const subCollectionSnapshot = await subCollectionRef.get();
            const subCollection = subCollectionSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            const categoryWithSubMenu = {
                category_id: categoryId,
                category_title: categoryDoc.data().title,
                subCategory: []
            };

            for (const subCatItem of subCollection) {
                const subMenuRef = subCollectionRef.doc(subCatItem.id).collection('subMenu');
                const subMenuSnapshot = await subMenuRef.get();

                const submenu = subMenuSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const subCategoryWithMenu = {
                    sub_title: subCatItem.title,
                    sub_id: subCatItem.id,
                    sub_image: subCatItem.image,
                    subMenu: submenu,
                };

                categoryWithSubMenu.subCategory.push(subCategoryWithMenu);
            }

            allCategories.push(categoryWithSubMenu);
        }

        res.send(allCategories);
    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};



const getSubCategory = async (req, res) => {
    try {
        const categories = db.collection("categories");
        const categoryRef = req.params.category;
        const snapshot = await categories.doc(categoryRef).get();

        if (!snapshot.exists) {
            return res.status(404).json({ error: 'subcategory not found' });

        }
        // ambil all sub kategori
        const sub = snapshot.ref.collection("subCategory");
        const subCategory = await sub.get();
        const list = subCategory.docs.map((doc) => ({
            id: doc.id,
            header: doc.title,
            ...doc.data()
        }));
        // end

        // ambil sub menu = anaknya
        const snapshot2 = await sub.doc(subCategoryRef).get();

        const subMenu = snapshot2.ref.collection("subMenu");
        const allSub = await subMenu.get();
        const list2 = allSub.docs.map((doc) => ({

            subCategory: list,
            SubMenuu: {
                header: doc.title,
                id: doc.id,
                ...doc.data()
            }
        }));


        res.send(list2);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSubMenu = async (req, res) => {
    try {
        const categoryRef = req.params.category;
        const subCategoryRef = req.params.subCategory;

        // ambil kategori programming
        const categories = db.collection("categories");
        const snapshot = await categories.doc(categoryRef).get();

        // ceking
        if (!snapshot.exists) {
            return res.status(404).json({ error: 'category not found' });
        }

        // ambil all sub kategori
        const sub = snapshot.ref.collection("subCategory");
        const subCategory = await sub.get();
        const list = subCategory.docs.map((doc) => ({
            id: doc.id,
            header: doc.title,
            ...doc.data()
        }));
        // end

        // ambil sub menu = anaknya
        const snapshot2 = await sub.doc(subCategoryRef).get();

        const subMenu = snapshot2.ref.collection("subMenu");
        const allSub = await subMenu.get();
        const list2 = allSub.docs.map((doc) => ({

            subCategory: list,
            SubMenuu: {
                header: doc.title,
                id: doc.id,
                ...doc.data()
            }
        }));


        res.send(list2);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const updatecategory = async (req, res) => {
    const uid = req.params.id;

    if (!uid) {
        return res.status(400).json({ error: 'UID is required in the query parameters' });
    }

    try {
        delete req.body.id;
        const data = req.body;
        await category.doc(uid).update(data);
        res.send({ msg: "Updated" });

    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const addSubcategory = async (req, res) => {
    try {
        const { category, subCategory } = req.params;
        const categoryRef = db.collection('categories').doc(category);
        const { title, judul } = req.body;

        if (title) {
            const subCollectionRef = categoryRef.collection("subCategory").doc(subCategory);
            const subCollectionRef2 = subCollectionRef.collection("subMenu");

            await subCollectionRef2.doc(judul).set({

                image: 'http',
                title: title

            });
            res.status(201).send('Subcollection created successfully');
        } else {
            res.status(400).send('Subcollection name is missing in the request body');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

};



const deletecategory = async (req, res) => {

    const uid = req.params.id;

    if (!uid) {
        return res.status(400).json({ error: 'UID is required in the query parameters' });
    }

    try {
        await category.doc(uid).delete();
        res.send({ msg: "Deleted" });

    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllcategory,
    getCategory,
    getSubCategory,
    getSubMenu,
    updatecategory,
    deletecategory,
    addSubcategory

};