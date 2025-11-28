// apiService.tsx
import { Api_Methods } from "../utils/common/enum"; // Importing Api_Methods

import { axiosInstance } from "@/lib/axiosinstance";

interface ApiRequest {
  method: Api_Methods; // Use the Api_Methods enum directly
  endpoint: string;
  body?: any;
  params?: Record<string, any>;
  authToken?: string;
}

export const apiService = async ({
  method,
  endpoint,
  body = null,
  params = {},

}: ApiRequest): Promise<{ success: boolean; data: any }> => {
  try {
    let response;
    switch (method) {
      case Api_Methods.GET:
        response = await axiosInstance.get(endpoint, { params });
        break;
      case Api_Methods.POST:
        response = await axiosInstance.post(endpoint, body, { params });
        break;
      case Api_Methods.PUT: {
        // For PUT requests, ensure the endpoint includes the ID if it's in the body
        let putEndpoint = endpoint;
        if (body?.ads_id && !endpoint.endsWith(`/${body.ads_id}`)) {
          putEndpoint = endpoint.endsWith('/') 
            ? `${endpoint}${body.ads_id}`
            : `${endpoint}/${body.ads_id}`;
        }
        response = await axiosInstance.put(putEndpoint, body, { params });
        break;
      }
      case Api_Methods.DELETE:
        response = await axiosInstance.delete(endpoint, { params });
        break;
      case Api_Methods.PATCH:
        response = await axiosInstance.patch(endpoint, body, { params });
        break;
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }

    return {
      success: response.status >= 200 && response.status < 400,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      data: error.response ? error.response.data : error.message,
    };
  }
};
