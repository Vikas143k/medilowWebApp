// src/api/symptom.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5010"; // adjust your backend port

export const searchSymptom = async (symptomName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search_symptom`, {
      params: { query: symptomName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching symptom alternatives:", error);
    return { alternatives: [] };
  }
};
