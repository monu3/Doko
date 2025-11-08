// // src/services/paymentApi.ts
// import axios from 'axios'

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// export interface CreateConfigRequest {
//   shopId: string
//   paymentMethod: string
//   credentials: { [key: string]: string }
// }

// export interface PaymentConfig {
//   id: string
//   shopId: string
//   paymentMethod: string
//   credentials: { [key: string]: string }
//   active: boolean
//   createdAt: string
//   updatedAt: string
// }

// export const paymentApi = {
//   createConfig: async (data: CreateConfigRequest) => {
//     const response = await axios.post(`${API_BASE_URL}/shop-gateway-config`, data)
//     return response
//   },

//   getConfigsByShop: async (shopId: string) => {
//     const response = await axios.get(`${API_BASE_URL}/shop-gateway-config/shop/${shopId}`)
//     return response
//   },

//   updateConfig: async (configId: string, data: Partial<CreateConfigRequest>) => {
//     const response = await axios.put(`${API_BASE_URL}/shop-gateway-config/${configId}`, data)
//     return response
//   },

//   deleteConfig: async (configId: string) => {
//     const response = await axios.delete(`${API_BASE_URL}/shop-gateway-config/${configId}`)
//     return response
//   }
// }

// src/services/paymentApi.ts
// src/services/paymentApi.ts
import api from "@/api";
import type {
  CreateConfigRequest,
  UpdateConfigRequest,
  PaymentConfig,
  PaymentConfigSummary,
  ApiResponse,
} from "@/setting/settings";

export const paymentApi = {
  createConfig: async (
    data: CreateConfigRequest
  ): Promise<ApiResponse<PaymentConfig>> => {
    const response = await api.post<ApiResponse<PaymentConfig>>(
      `/api/shop-gateway-config`,
      data
    );
    return response.data;
  },

  getConfigsByShop: async (
    shopId: string
  ): Promise<ApiResponse<PaymentConfigSummary[]>> => {
    const response = await api.get<ApiResponse<PaymentConfigSummary[]>>(
      `/api/shop-gateway-config/${shopId}`
    );
    return response.data;
  },

  getConfigDetail: async (
    shopId: string,
    paymentMethod: string
  ): Promise<ApiResponse<PaymentConfig>> => {
    const response = await api.get<ApiResponse<PaymentConfig>>(
      `/api/shop-gateway-config/${shopId}/${paymentMethod}`
    );
    return response.data;
  },

  updateConfig: async (
    configId: string,
    data: UpdateConfigRequest
  ): Promise<ApiResponse<PaymentConfig>> => {
    const response = await api.put<ApiResponse<PaymentConfig>>(
      `/api/shop-gateway-config/${configId}`,
      data
    );
    return response.data;
  },

  toggleActive: async (configId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.patch<ApiResponse<boolean>>(
      `/api/shop-gateway-config/${configId}/toggle-active`
    );
    return response.data;
  },

  deleteConfig: async (configId: string): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(
      `/api/shop-gateway-config/${configId}`
    );
    return response.data;
  },
};
