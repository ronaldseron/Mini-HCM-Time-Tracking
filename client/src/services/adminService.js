const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getAllEmployees = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
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

export const getEmployeePunches = async (uid, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/${uid}/attendance`, {
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

export const updateUserPunch = async (uid, token, punchId, updatedData) => {
  console.log(uid, token, punchId, updatedData);
  try {
    const response = await fetch(`${API_BASE_URL}/admin/${uid}/attendance/${punchId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Failed to update punch." };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
