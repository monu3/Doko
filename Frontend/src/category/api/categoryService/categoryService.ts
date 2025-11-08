
import type { CategoryFormData, Category } from "../../types/category";
import api from "../../../api"



// Category API endpoints
export const createCategory = async (
  categoryData: CategoryFormData
): Promise<Category> => {
  const response = await api.post<Category>(
    "/products/categories",
    categoryData
  );
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/products/categories");
  return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get<Category>(`/products/categories/${id}`);
  return response.data;
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<CategoryFormData>
): Promise<Category> => {
  const response = await api.put<Category>(
    `/products/categories/${id}`,
    categoryData
  );
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/products/categories/${id}`);
};

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchCategories } from "@/category/slice/categorySlice";

export const useCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  return { categories, status, error };
};
