import axios from "axios";
import { CustomerProfile } from "../types/types";

// const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";

const API_URL = 'https://customer-analysis-app.onrender.com'

export async function analyzeCustomer(formData: CustomerProfile) {
  try {
    const response = await axios.post(`${API_URL}/api/analysis`, formData);

    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
}
