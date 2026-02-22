import { Api_Methods } from "@/utils/common/enum"
import { apiService } from "./apiService"

export const apiHelperService = {

  updateConnectStatus: async (
    id: string,
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
  ) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/token-request/${id}/status`,
      body: { status },
    });
  },

  updateConnectAmount: async (id: string, amount: number) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/token-request/${id}`,
      body: { amount },
    });
  },

};