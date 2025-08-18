import { Api_Methods } from "@/utils/common/enum"
import { apiService } from "./apiService"

export const apiHelperService = {
 
   updateConnectStatus: async (
    id: string,
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
  ) => {
    return apiService({
      method: Api_Methods.PUT,
      endpoint: `/token-request/${id}/status`, // The specific endpoint from your backend
      body: { status }, // The status is sent in the request body
    });
  },

};