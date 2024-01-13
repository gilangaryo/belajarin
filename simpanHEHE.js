

const member = db.collection("member");

router.post("/signup", async (req, res) => {
    try {
        const uid = db.collection("member").doc().id; // Generate a random ID
        const data = req.body;

        await member.doc(uid).set({
            uid: uid,
            ...data
        });

        res.status(200).json({ id: uid, msg: "member Added" });
    } catch (error) {
        console.error("Error adding member:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/update", async (req, res) => {
    const id = req.params.id;
    delete req.body.id;
    const data = req.body;
    await member.doc(id).update(data);
    res.send({ msg: "Updated" });
});

router.post("/delete", async (req, res) => {
    const id = req.body.id;
    await member.doc(id).delete();
    res.send({ msg: "Deleted" });
});

const idku = req.params.id;;
const snapshot = await member.where('uid', '==', idku.id).get();

if (snapshot.empty) {
    return res.status(404).json({ error: 'Member not found' });
}

const memberData = snapshot.docs[0].data();

res.json(memberData);