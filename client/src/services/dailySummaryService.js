const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const createDailySummary = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/daily-summary`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: response.error };
    }
    const { data } = await response.json();

    console.log("Daily Summary created:", data);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
