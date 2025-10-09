const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const punchInService = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/punchin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      if (!response.ok) {
        return { success: false, error: response.error };
      }
      const { data } = await response.json();

      return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const punchOutService = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/punchout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getTodayStatus = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/today-status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: response.error };
    }
    const { data } = await response.json();


    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
