import admin from "../config/firebase.js";
import { usersCollection, attendanceCollection, dailySummaryCollection } from "../config/db.js";
import { dateKey, getMondayAndFridayKeys } from "../utils/timeUtils.js";
import { toTimestamp } from "../utils/formatUtils.js";

export const fetchAllEmployees = async () => {
  const snapshot = await usersCollection.where("role", "==", "employee").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchEmployeePunches = async (uid) => {
  const snapshot = await attendanceCollection.where("uid", "==", uid).get();
  const punches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return punches.sort((a, b) => b.createdAt - a.createdAt);
};

export const updateEmployeePunch = async (punchId, updatedData) => {
  const docRef = attendanceCollection.doc(punchId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) throw new Error("Punch record not found!");
  const baseDate = docSnap.data().createdAt.toDate();

  const updatedFields = {
    ...(updatedData.timeIn && { timeIn: toTimestamp(updatedData.timeIn, baseDate, admin) }),
    ...(updatedData.timeOut && { timeOut: toTimestamp(updatedData.timeOut, baseDate, admin) }),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await docRef.update(updatedFields);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const fetchEmployeeAttendanceById = async (uid, punchId) => {
  const punchSnap = await attendanceCollection.doc(punchId).get();
  if (!punchSnap.exists) return null;

  const userSnap = await usersCollection.doc(uid).get();
  return { data: punchSnap.data(), schedule: userSnap.data()?.schedule || null };
};

export const fetchAllUsersWithDailySummaries = async (limitCount = 10) => {
  const todayStr = dateKey();
  const usersSnap = await usersCollection.where("role", "==", "employee").limit(limitCount).get();
  const summariesSnap = await dailySummaryCollection.get();

  const todaySummaries = summariesSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(summary => summary.createdAt.toDate().toISOString().split("T")[0] === todayStr);

  const summariesMap = Object.fromEntries(
    todaySummaries.map(s => [s.uid, s])
  );

  return usersSnap.docs.map(doc => ({
    name: doc.data().name,
    summary: summariesMap[doc.id] || null,
  }));
};

export const fetchAllUsersWithWeeklySummaries = async (limitCount = 10) => {
  const { mondayKey, fridayKey } = getMondayAndFridayKeys();
  const usersSnap = await usersCollection.where("role", "==", "employee").limit(limitCount).get();
  const summariesSnap = await dailySummaryCollection.get();

  const summaries = summariesSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(s => {
      const d = s.createdAt.toDate().toISOString().split("T")[0];
      return d >= mondayKey && d <= fridayKey;
    });

  const userSummariesMap = {};
  for (const s of summaries) {
    const { uid, regular, late, overtime, undertime, nightDifferential } = s;
    if (!userSummariesMap[uid]) {
      userSummariesMap[uid] = { regular: 0, late: 0, overtime: 0, undertime: 0, nightDifferential: 0 };
    }
    userSummariesMap[uid].regular += parseFloat(regular || 0);
    userSummariesMap[uid].late += parseFloat(late || 0);
    userSummariesMap[uid].overtime += parseFloat(overtime || 0);
    userSummariesMap[uid].undertime += parseFloat(undertime || 0);
    userSummariesMap[uid].nightDifferential += parseFloat(nightDifferential || 0);
  }

  return usersSnap.docs.map(userDoc => ({
    name: userDoc.data().name,
    summary: userSummariesMap[userDoc.id] || null,
  }));
};
