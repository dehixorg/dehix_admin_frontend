import { Api_Methods } from "@/utils/common/enum";
import { apiService } from "@/services/apiService";

export const streakRewardService = {
  getAllStreakRewards: (params = {}) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: "/admin/streak-rewards",
      params,
    });
  },

  getStreakRewardById: (id: string) => {
    return apiService({
      method: Api_Methods.GET,
      endpoint: `/admin/streak-rewards/${id}`,
    });
  },

  createStreakReward: (body: any) => {
    return apiService({
      method: Api_Methods.POST,
      endpoint: "/admin/streak-rewards",
      body,
    });
  },

  updateStreakReward: (id: string, body: any) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/admin/streak-rewards/${id}`,
      body,
    });
  },

  deleteStreakReward: (id: string) => {
    return apiService({
      method: Api_Methods.DELETE,
      endpoint: `/admin/streak-rewards/${id}`,
    });
  },

  toggleActiveStatus: (id: string, isActive: boolean) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/admin/streak-rewards/${id}`,
      body: { isActive },
    });
  },
};
