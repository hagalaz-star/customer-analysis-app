import axios from "axios";
import { CustomerProfile } from "../types/types";

const LOCAL_HOST = "http://localhost:3000/";

export async function analyzeCustomer(formData: CustomerProfile) {
  try {
    const response = await axios.post(`${LOCAL_HOST}/api/analysis`, formData);

    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
}
