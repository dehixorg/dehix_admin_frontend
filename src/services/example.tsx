// USE these example api as refrence for creating different resource api helper service
// eslint-disable-next-line prettier/prettier

import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { apiService } from "./apiService";

export const apiHelperService = {
  getAllFreelancers: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/freelancer/allfreelancer",
      params,
    });
  },

  createFaq: async (body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/faq/createfaq",
      body,
    });
  },

  updateItem: async (itemId: string, body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/items/${itemId}`,
      body,
    });
  },

  deleteItem: async (itemId: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/items/${itemId}`,
    });
  },

  patchItem: async (itemId: string, body: Record<string, any>) => {
    return apiService({
      method: Api_Methods.PATCH,
      endpoint: `/items/${itemId}`,
      body,
    });
  },

  getCategories: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/categories",
      params,
    });
  },
};
