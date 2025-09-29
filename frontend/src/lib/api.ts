import axios from "axios";
import { CustomerProfile } from "../types/types";

// Prefer relative path + Next.js rewrite in dev.
// If NEXT_PUBLIC_API_HOST is provided (e.g., in production), use it.
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "";

export async function analyzeCustomer(formData: CustomerProfile) {
  try {
    const url = API_HOST
      ? `${API_HOST}/api/analysis`
      : "/api/analysis"; // Next.js rewrites -> http://localhost:8000/api/analysis

    const response = await axios.post(url, formData);
    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
}
