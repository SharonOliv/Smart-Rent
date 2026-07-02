import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartrent_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};

// ---- Auth ----
export const signup = (data) => api.post("/auth/signup", data).then((r) => r.data);
export const login = (data) => api.post("/auth/login", data).then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);
export const requestPasswordReset = (username) =>
  api.post("/auth/forgot-password", { username }).then((r) => r.data);
export const resetPassword = (data) => api.post("/auth/reset-password", data).then((r) => r.data);

// ---- Profile ----
export const updateProfile = (formData) =>
  api.put("/users/me", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
export const savePersonality = (personality) =>
  api.put("/users/me/personality", { personality }).then((r) => r.data);

// ---- Properties ----
export const fetchProperties = (params) => api.get("/properties", { params }).then((r) => r.data);
export const fetchMyProperties = () => api.get("/properties/mine").then((r) => r.data);
export const fetchProperty = (id) => api.get(`/properties/${id}`).then((r) => r.data);
export const createProperty = (formData) =>
  api.post("/properties", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

// ---- Bookings ----
export const createBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const fetchMyBookings = () => api.get("/bookings/mine").then((r) => r.data);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data);

// ---- Matches ----
export const fetchMatches = () => api.get("/matches").then((r) => r.data);

// ---- Chat ----
export const sendChatMessage = (message, history) =>
  api.post("/chat", { message, history }).then((r) => r.data);

export default api;
