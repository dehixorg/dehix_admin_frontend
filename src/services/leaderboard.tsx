import { Api_Methods } from "../utils/common/enum";
import { apiService } from "./apiService";

export const apiHelperService = {
  getAllLeaderboards: async (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/admin/leaderboard/get-all",
      params,
    });
  },

  createLeaderboard: async (body: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/admin/leaderboard/create",
      body,
    });
  },

  updateLeaderboard: async (id: string, body: any) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/admin/leaderboard/update/${id}`,
      body,
    });
  },

  getLeaderboardById: async (id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/admin/leaderboard/get/${id}`,
    });
  },

  calculateLeaderboard: async (id: string) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: `/admin/leaderboard/calculate/${id}`,
    });
  },

  distributeRewards: async (id: string) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: `/admin/leaderboard/distribute-rewards/${id}`,
    });
  },

  getGamificationDefinitions: async () => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/admin/gamification/levelsandbadges",
    });
  },
};
