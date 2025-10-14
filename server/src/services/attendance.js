import admin from "../config/firebase.js";
import * as AttendanceRepo from "../repositories/attendance.js";
import * as UserRepo from "../repositories/user.js";
import { getMetricsStatus } from "./attendanceService.js";
import { convertMetricsToHMS } from "../utils/formatUtils.js";

export const punchIn = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);

   if (record.exists && record.data.timeIn) {
       return { message: "Already puched in today." };
   }

   await AttendanceRepo.createAttendance(uid);

   return { message: "Punched in successfully." };
};

export const punchOut = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);
 
   if (!record.exists) return { message: "Cannot punch out before punching in." };
   if (record.data.timeOut) return { message: "Already punched out today." };
 
   await AttendanceRepo.updateAttendance(uid, {
     timeOut: admin.firestore.FieldValue.serverTimestamp(),
   });
 
   return { message: "Punched out successfully." };
};

export const getTodayStatus = async (uid) => {
   const record = await AttendanceRepo.getAttendanceByUserAndDate(uid);
   if (!record.exists) return null;
 
   const user = await UserRepo.getUserById(uid);
   const schedule = user?.schedule || null;
 
   const { timeIn, timeOut } = record.data;
   const metrics = await getMetricsStatus({ data: record.data, schedule });
   const hms = convertMetricsToHMS(metrics);
 
   return {
     ...hms,
     timeIn,
     timeOut,
     schedule,
   };
};