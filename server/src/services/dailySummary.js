import * as DailySummaryRepo from "../repositories/dailySummary.js";
import * as AttendanceRepo from "../repositories/attendance.js";
import * as UserRepo from "../repositories/user.js";
import { getMetricsStatus } from "./attendanceService.js";
import { convertMetricsToHMS, formatDate } from "../utils/formatUtils.js";

export const createDailySummary = async (uid) => {
  // Get today’s attendance data
  const attendanceRecord = await AttendanceRepo.getAttendanceByUserAndDate(uid);
  if (!attendanceRecord.exists) return { message: "No attendance record found today." };

  const user = await UserRepo.getUserById(uid);
  const schedule = user?.schedule || null;

  // Calculate metrics
  const todayMetrics = await getMetricsStatus({ data: attendanceRecord.data, schedule });

  // Save in daily summary
  await DailySummaryRepo.createDailySummary(uid, todayMetrics);

  return todayMetrics;
};

export const getUserPunches = async (uid) => {
  const punches = await DailySummaryRepo.getPunchesByUserId(uid);
  if (!punches.length) return [];

  // Convert to readable format
  return punches.map((punch) => {
    const metricsHMS = convertMetricsToHMS(punch.data);
    return {
      id: punch.id,
      uid: punch.uid,
      createdAt: formatDate(punch.createdAt),
      ...metricsHMS,
    };
  });
};

export const updateSummary = async (summaryId, todayMetrics) => {
  return await DailySummaryRepo.updateEmployeeSummaryById(summaryId, todayMetrics);
};
