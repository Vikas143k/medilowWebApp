import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; 
const AXIOS_TIMEOUT = 7000; // 7 seconds

export const searchMedicine = async (medicineName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { name: medicineName },
      timeout: AXIOS_TIMEOUT,
    });
    return response.data;
  } catch (error) {
    let errorMsg = "Failed to fetch medicine alternatives";
    if (error.response && error.response.data && error.response.data.detail) {
      errorMsg = error.response.data.detail;
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = "Request timed out. Please try again.";
    }
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching alternatives:", error);
    }
    return { error: errorMsg };
  }
};

export const getMedicineDetails = async (medicineId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicine/${medicineId}`, {
      timeout: AXIOS_TIMEOUT,
    });
    return response.data;
  } catch (error) {
    let errorMsg = "Failed to fetch medicine details";
    if (error.response && error.response.data && error.response.data.detail) {
      errorMsg = error.response.data.detail;
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = "Request timed out. Please try again.";
    }
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching medicine details:", error);
    }
    return { error: errorMsg };
  }
};


