
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://codementor-backend-nz6s.onrender.com"
).replace(/\/+$/, "");

export function apiUrl(endpoint: string) {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

export default API_BASE_URL;
