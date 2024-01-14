
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



// fixxxxxxx
const getCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const categoryDoc = await db.collection("categories").doc(category).get();

        if (!categoryDoc.exists) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const subcategoriesSnapshot = await categoryDoc.ref.collection("subCategory").get();
        const subcategories = [];

        for (const subCategoryDoc of subcategoriesSnapshot.docs) {
            const subCategoryData = subCategoryDoc.data();

            const subMenuSnapshot = await subCategoryDoc.ref.collection("subMenu").get();
            const subMenu = subMenuSnapshot.docs.map(subMenuDoc => ({ uid: subMenuDoc.id, ...subMenuDoc.data() }));

            const subcategoryWithSubMenu = {
                id: subCategoryDoc.id,
                // title: subCategoryData.title,
                // header: subCategoryData.title,
                ...subCategoryData,
                subMenu: subMenu,
            };

            subcategories.push(subcategoryWithSubMenu);
        }

        res.send({ category, subcategories });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getMateri = async (req, res) => {
    try {
        const { category, subMenu } = req.params;
        const subCategory = "mobile-app-development";
        // Get the category document
        const categoryDoc = await db.collection("categories").doc(category).get();

        if (!categoryDoc.exists) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Get subcategories of the category
        const subcategoriesSnapshot = await categoryDoc.ref.collection("subCategory").get();
        const subcategories = subcategoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            header: doc.data().title,
            ...doc.data()
        }));

        // Get submenus of the specified subcategory
        const submenuSnapshot = await categoryDoc.ref.collection(`subCategory/${subCategory}/subMenu`).get();
        const submenus = submenuSnapshot.docs.map(doc => ({
            header: doc.data().title,
            id: doc.id,
            ...doc.data()
        }));

        // Get materi of the specified submenu
        const materiSnapshot = await categoryDoc.ref.collection(`subCategory/${subCategory}/subMenu/${subMenu}/materi`).get();
        const materi = materiSnapshot.docs.map(doc => ({
            ...doc.data()
        }));

        // Combine the results into a response object
        const response = {
            // category,
            // subCategory,
            // subMenu,
            // subcategories,
            // submenus,
            materi
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching data:", error);
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

    updatecategory,
    deletecategory,
    addSubcategory,
    getMateri

};