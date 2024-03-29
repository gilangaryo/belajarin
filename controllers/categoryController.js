
const express = require('express');
const router = express.Router();
const db = require("../config");

const getAllcategory = async (req, res) => {
    const categoryCollection = db.collection("categories");

    try {
        const categoriesSnapshot = await categoryCollection.get();
        const allCategories3 = [];

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

            allCategories3.push(categoryWithSubMenu);
        }

        res.send(allCategories3);
    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};



const getAllCat = async (req, res) => {
    const categoryCollection = db.collection("categories");

    try {
        const categoriesSnapshot = await categoryCollection.get();
        const allCategories = [];
        const allCategories2 = [];

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

            allCategories2.push(categoryWithSubMenu);


        }
        res.send(allCategories2);
    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};

const getAllSubCategory = async (req, res) => {
    const categoryCollection = db.collection("categories");

    try {
        const categoriesSnapshot = await categoryCollection.get();
        const allCategories = [];
        const allSubCat = [];

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

            allSubCat.push(subCollection);
        }

        res.send(allSubCat);
    } catch (error) {
        // Handle errors, e.g., by sending an error response
        res.status(500).send("Internal Server Error");
    }
};

const getAllSubMenu = async (req, res) => {
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
            return res.status(404).json({ error: 'Category not foundaa' });
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

const getCategorySubMenuAllMateri = async (req, res) => {
    const { category, subMenu } = req.params;

    try {
        const materiSnapshot = await db
            .collectionGroup("materi")
            .where("category", "==", category)
            .where("subMenu", "==", subMenu)
            .get();

        const materi = materiSnapshot.docs.map(doc => ({
            document_id: doc.ref.parent.parent.id,
            materi_id: doc.id,
            ...doc.data()
        }));

        if (materi.length > 0) {
            res.json({ materi });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error getting documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





const getMateribyCategory = async (req, res) => {
    try {
        const { category, subMenu } = req.params;


        const subCategory = "mobile-app-development";
        const categoryDoc2 = await db.collection("categories").doc(category).get();

        if (!categoryDoc2.exists) {
            return res.status(404).json({ error: 'Category not foundaa' });
        }
        const subcategoriesSnapshot2 = await categoryDoc2.ref.collection("subCategory").get();
        const subcategories2 = [];

        for (const subCategoryDoc of subcategoriesSnapshot2.docs) {
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

            subcategories2.push(subcategoryWithSubMenu);
        } subcategories2.push(subMenu);
        console.log(subcategories2);

        const categoryDoc = await db.collection("categories").doc(category).get();
        if (!categoryDoc.exists) {
            return res.status(404).json({ error: 'Category not foundss' });
        }

        const subcategoriesSnapshot = await categoryDoc.ref.collection("subCategory").get();
        const subcategories = subcategoriesSnapshot.docs.map(doc => ({
            id: doc.id,
            header: doc.data().title,
            ...doc.data()
        }));

        const submenuSnapshot = await categoryDoc.ref.collection(`subCategory/${subCategory}/subMenu`).get();
        const submenus = submenuSnapshot.docs.map(doc => ({
            header: doc.data().title,
            id: doc.id,
            ...doc.data()
        }));

        const materiSnapshot = await categoryDoc.ref.collection(`subCategory/${subCategory}/subMenu/${subMenu}/materi`).get();
        const materi = materiSnapshot.docs.map(doc => ({
            ...doc.data()
        }));

        const response = {
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
    getMateribyCategory,
    getAllCat,
    getAllSubCategory,
    getAllSubMenu,

    getCategorySubMenuAllMateri

};