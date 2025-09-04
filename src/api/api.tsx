// src/api.jsx
import axios from "axios";

// Set up a base Axios instance (optional but useful)
const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ replace with your actual backend URL
  withCredentials: true, // if you're using cookies or sessions
});

// Signup API
export const signupUser = async (formData) => {
  try {
    const response = await api.post("/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
