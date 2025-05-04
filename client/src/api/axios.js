import axios from "axios";

// Create an instance of axios with a base URL and headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to include the token in the Authorization header if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or Zustand state, if you're using it)
    const token = localStorage.getItem("token"); // You can replace this with Zustand or other state management solutions

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle errors (e.g., token expiration or invalid token)
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as is
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration or unauthorized access
      // For example, you can redirect to login page
      console.log("Unauthorized, please log in again.");
      // Clear the token from localStorage or state
      localStorage.removeItem("token");
      // Redirect to login page or show a login modal
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
