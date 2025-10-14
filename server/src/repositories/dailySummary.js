import admin from "../config/firebase.js";
import { dailySummaryCollection } from "../config/db.js";
import { dateKey } from "../utils/timeUtils.js";

const date = dateKey();

export const createDailySummary = async (uid, todayMetrics) => {
  const docId = `${uid}_${date}`;
  const docRef = dailySummaryCollection.doc(docId);

  await docRef.set({
    uid,
    ...todayMetrics,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docId };
};

export const getPunchesByUserId = async (uid) => {
  const snapshot = await dailySummaryCollection.where("uid", "==", uid).get();
  if (snapshot.empty) return [];

  const punches = snapshot.docs.map((doc) => {
    const data = doc.data();
    const { createdAt, uid: userId, ...metrics } = data;
    return {
      id: doc.id,
      uid: userId,
      data: metrics,
      createdAt,
    };
  });

  punches.sort((a, b) => b.createdAt - a.createdAt);
  return punches;
};

export const updateEmployeeSummaryById = async (summaryId, todayMetrics) => {
  await dailySummaryCollection.doc(summaryId).update({
    ...todayMetrics,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: summaryId };
};
