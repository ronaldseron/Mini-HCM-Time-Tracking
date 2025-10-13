import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { punchInService, punchOutService, getTodayStatus } from "../services/attendanceService";
import { createDailySummary, getHistoryPunches } from "../services/dailySummaryService";

export const useAttendance = () => {
  const { getUserToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [todaysStatus, setTodaysStatus] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const fetchTodayStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getUserToken();
      const result = await getTodayStatus(token);

      if (!result || !result.data) {
        setTodaysStatus(null);
        setIsPunchedIn(false);
        return;
      }

      console.log("Today's Attendance:", result.data);

      const { timeIn, timeOut } = result.data;

      if (timeIn && !timeOut) {
        setIsPunchedIn(true);
      } else if (timeOut) {
        setIsPunchedIn(false); 
      } else {
        setIsPunchedIn(false);
      }

      setTodaysStatus(result.data);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserToken]);

   const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getUserToken();
      const result = await getHistoryPunches(token);
      console.log("Fetched Punch History:", result);

      if (result.success) {
        setHistoryData(result.data);
      } else {
        setHistoryData([]);
      }

    } catch (error) {
      console.error("Error fetching punch history:", error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  }, [getUserToken]);

  useEffect(() => {
    fetchTodayStatus();
    fetchHistory();
  }, [fetchTodayStatus]);

  const handlePunchIn = async () => {
    setLoading(true);
    try {
      const token = await getUserToken();
      const result = await punchInService(token);

      if (!result.success) throw new Error(result.error || "Punch in failed");

      await fetchTodayStatus();
    } catch (error) {
      alert("Failed to punch in. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setLoading(true);
    try {
      const token = await getUserToken();
      const result = await punchOutService(token);

      if (!result.success) throw new Error(result.error || "Punch out failed");

      await fetchTodayStatus();
      await createDailySummary(token);
      await fetchHistory();
    } catch (error) {
      alert("Failed to punch out. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isPunchedIn,
    todaysStatus,
    historyData,
    handlePunchIn,
    handlePunchOut,
    refresh: fetchTodayStatus,
  };
};
