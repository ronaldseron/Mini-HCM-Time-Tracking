import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { punchInService, punchOutService, getTodayStatus } from "../services/attendanceService";
import { createDailySummary } from "../services/dailySummaryService";
export const useAttendance = () => {
      const { getUserToken } = useAuth();
      const [loading, setLoading] = useState(false);
      const [lastPunch, setLastPunch] = useState(null);
      const [isPunchedIn, setIsPunchedIn] = useState(false);
      const [todaysStatus, setTodaysStatus] = useState(null);
    
      useEffect(() => {
        fetchTodayStatus();
      }, []);   
    
      const fetchTodayStatus = async () => {
        try {
          const token = await getUserToken();
          const status = await getTodayStatus(token);
          setLastPunch(status.data.lastPunch);
          setIsPunchedIn(status.data.isPunchedIn);
          setTodaysStatus(status.data);
          console.log("Fetched status:", status.data);
        } catch (error) {
          console.error("Error fetching status:", error);
        }
      };
    
      const handlePunchIn = async () => {
        setLoading(true);
        try {
          const token = await getUserToken();
          const result = await punchInService(token);
          
          if (!result.success) throw new Error(result.error || "Punch in failed");
    
          await fetchTodayStatus();
        } catch (error) {
          alert("Failed to punch in. Please try again.");
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
          const { isPunchedIn } = await createDailySummary(token);
          setIsPunchedIn(isPunchedIn);
        } catch (error) {
          alert("Failed to punch out. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      return {
        loading,
        lastPunch,
        isPunchedIn,
        todaysStatus,
        handlePunchIn,
        handlePunchOut,
      };
};