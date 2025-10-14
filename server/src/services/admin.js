import * as AdminRepo from "../repositories/admin.js";
import { getMetricsStatus } from "./attendanceService.js";
import { updateEmployeeSummaryById } from "../repositories/dailySummary.js";

export const getAllEmployees = () => AdminRepo.fetchAllEmployees();

export const getEmployeePunches = (uid) => AdminRepo.fetchEmployeePunches(uid);

export const editEmployeePunch = async (uid, punchId, updatedData) => {
  const punch = await AdminRepo.updateEmployeePunch(punchId, updatedData);
  const attendanceData = await AdminRepo.fetchEmployeeAttendanceById(uid, punch.id);
  const metrics = await getMetricsStatus(attendanceData);
  await updateEmployeeSummaryById(punch.id, metrics);
  return punch;
};

export const getUsersWithDailySummary = (limit) => AdminRepo.fetchAllUsersWithDailySummaries(limit);
export const getUsersWithWeeklySummary = (limit) => AdminRepo.fetchAllUsersWithWeeklySummaries(limit);
