import api from "./axios";

const permitApi = {
  create: async (permitData) => {
    const response = await api.post("/permits", permitData);
    return response.data;
  },

getAll: async (params = {}) => {
  const response = await api.get("/permits", { params });
  return response.data;
},

  getById: async (id) => {
    const response = await api.get(`/permits/${id}`);
    return response.data;
  },

  getNextNumber: async () => {
  const response = await api.get("/permits/next-number");
  return response.data;
},
getNextOccupancyNumber: async () => {
  const response = await api.get("/permits/next-occupancy-number");
  return response.data;
},
delete: async (id) => {
  const response = await api.delete(`/permits/${id}`);
  return response.data;
},
getSignatories: async () => {
  const response = await api.get("/settings/signatories");
  return response.data;
},

updateSignatories: async (data) => {
  const response = await api.put("/settings/signatories", data);
  return response.data;
},

getUsers: async (params = {}) => {
  const response = await api.get("/auth/users", { params });
  return response.data;
},

createUser: async (data) => {
  const response = await api.post("/auth/users", data);
  return response.data;
},

updateUser: async (id, data) => {
  const response = await api.patch(`/auth/users/${id}`, data);
  return response.data;
},

updateUserStatus: async (id, isActive) => {
  const response = await api.patch(`/auth/users/${id}/status`, {
    isActive,
  });
  return response.data;
},

resetUserPassword: async (id, newPassword) => {
  const response = await api.patch(
    `/auth/users/${id}/reset-password`,
    { newPassword },
  );
  return response.data;
},

};



export default permitApi;