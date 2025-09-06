// src/api.jsx
import axios from "axios";

// Set up a base Axios instance (optional but useful)
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
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
export const loginUser = async (formData) => {
  try {
    const response = await api.post("/login", formData,{
      headers: {
        "Content-Type": "application/json",
      },
    }); // No need to manually set Content-Type
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getAllSections = async () => {
  try {
    const response = await api.get("/getallsections");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch sections" };
  }
};

export const getUsers = async (roleId, userId) => {
  try {
    const response = await api.get(`/getusers?role_id=${roleId}&user_id=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.post("/delete_user", { user_id: userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete user" };
  }
};

// Get User Profile API
export const getUserProfile = async (user_id) => {
  try {
    const response = await api.get(`/getProfiledetails`, {
      params: { user_id }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

export const updateUserDetails = async (formData: FormData) => {
  try {
    const response = await api.put("/updateProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to update user details" };
  }
};




