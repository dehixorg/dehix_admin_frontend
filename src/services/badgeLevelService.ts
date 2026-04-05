import { Api_Methods } from "../utils/common/enum";
import { apiService } from "./apiService";

export interface BadgeLevelImageUploadResponse {
  Location?: string;
  Key?: string;
  Bucket?: string;
  ETag?: string;
  key?: string;
  url?: string;
  secure_url?: string;
  imageUrl?: string;
  message?: string;
  error?: string;
  status?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export const badgeLevelService = {
  /**
   * Uploads a badge or level image to the server
   * @param formData FormData containing the image file
   * @returns Promise with upload response including file URL and metadata
   */
  uploadBadgeLevelImage: async (
    formData: FormData
  ): Promise<BadgeLevelImageUploadResponse> => {
    try {
      const response = await apiService({
        method: Api_Methods.POST,
        endpoint: "/register/upload-image",
        body: formData,
        isFileUpload: true,
      });

      const responseData = response.data;

      if (!responseData) {
        throw new Error("No data received from server");
      }

      // Extract the image URL from the response
      const location =
        responseData.Location ||
        responseData.url ||
        responseData.secure_url ||
        responseData.imageUrl;
      const key = responseData.Key || responseData.key;

      if (!location) {
        throw new Error("No image URL found in response");
      }

      return {
        Location: location,
        Key: key,
        Bucket: responseData.Bucket,
        ETag: responseData.ETag,
        url: location,
        key: key,
        message: responseData.message,
        error: responseData.error,
        status: responseData.status,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image. Please try again.";

      throw new Error(errorMessage);
    }
  },
};
