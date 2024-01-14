

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
        const subCategoryRef = "mobile-app-development";

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

            header: doc.title,
            id: doc.id,
            ...doc.data()

        }));


        res.send(list2);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};