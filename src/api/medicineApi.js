import axios from "axios";
const API_BASE_URL = "http://localhost:5000"; 
export const searchMedicine = async (medicineName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { name: medicineName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching alternatives:", error);
    return { error: "Failed to fetch medicine alternatives" };
  }
};
