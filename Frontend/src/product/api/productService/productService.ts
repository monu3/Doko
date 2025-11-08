
import { ProductFormData } from '../../types/product';
import { Product } from '../../types/product';
import api from "../../../api"



export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await api.post<Product>('/products', productData);
  return response.data;
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  }

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};