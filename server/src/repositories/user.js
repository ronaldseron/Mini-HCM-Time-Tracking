import { usersCollection } from "../config/db.js";

export const getUserById = async (uid) => {
    const userDoc = await usersCollection.doc(uid).get();
    return userDoc.exists ? { ...userDoc.data() } : null;
};