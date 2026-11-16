import api from "./axios";

export const authApi = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.patch("/auth/change-password", passwordData);

    return response.data;
  },
};

export default authApi;
