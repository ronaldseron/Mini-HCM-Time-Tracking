import { createContext, useContext, useEffect, useState } from "react";
import { getTodayAttendance } from "../services/attendanceService";
import { useAuth } from "./AuthContext";

const TodayStatusContext = createContext(null);

export const useTodayStatus = () => {
  const context = useContext(TodayStatusContext);
  if (!context) {
    throw new Error("useTodayStatus must be used within TodayStatusProvider");
  }
  return context;
};

export const TodayStatusProvider = ({ children }) => {
  const { user, getUserToken } = useAuth();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);

      if (!user) {
        setIsPunchedIn(false);
        setLoading(false);
        return;
      }

      try {
        const token = await getUserToken();
        if (!token) throw new Error("No valid auth token");

        const result = await getTodayAttendance(token, user.uid);
        const data = result?.data || null;
        console.log("Tday Context:", result.data)
        setIsPunchedIn(data?.timeIn && !data?.timeOut);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        setIsPunchedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user, getUserToken]);

  const markPunchedIn = () => setIsPunchedIn(true);
  const markPunchedOut = () => setIsPunchedIn(false);

  const value = {
    loading,
    isPunchedIn,
    markPunchedIn,
    markPunchedOut
  }

  return (
    <TodayStatusContext.Provider value={value}>
      {!loading && children}
    </TodayStatusContext.Provider>
  );
};