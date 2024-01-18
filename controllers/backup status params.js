
const getAllClassMember = async (req, res) => {
    try {
        const documentId = req.params.uid;
        const listClassRef = db.collection("member").doc(documentId).collection("listClassMember");
        const snapshot_class = await listClassRef.get();
        const list_class = [];

        for (const doc of snapshot_class.docs) {
            const materi_id = doc.data().materi_id;
            const material = await getMateriMentor(materi_id);

            list_class.push({
                id: doc.id,
                materi_id: doc.data().materi_id,
                status: doc.data().status,
                material
            });
        }

        const statusToFilter = req.params.status;

        const filteredList = list_class.filter(item => item.status === statusToFilter);

        res.send(filteredList);
    } catch (error) {
        res.status(400).send(error.message);
    }
};




const getMateriMentor = async (materi_id) => {
    try {
        const material = [];

        const mentorSnapshot = await db.collection("mentor").get();

        for (const mentorDoc of mentorSnapshot.docs) {
            const materiSnapshot = await mentorDoc.ref.collection("materi_mentor").where("materi_id", "==", materi_id).get();

            materiSnapshot.forEach((doc2) => {
                const currentMaterial = {
                    mentorName: mentorDoc.data().nama,
                    photoURL: mentorDoc.data().photoURL,
                    title: doc2.data().title,
                    image: doc2.data().image
                };

                material.push(currentMaterial);
            });
        }

        return material;
    } catch (error) {
        console.error('Error getting documents:', error);
        return [];
    }
};
