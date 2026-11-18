import api from "./axios";

const permitApi = {
  create: async (permitData) => {
    const response = await api.post("/permits", permitData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/permits");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/permits/${id}`);
    return response.data;
  },
};

export default permitApi;