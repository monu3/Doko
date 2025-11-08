"use server"

import type { ProductFormData } from "../types/product"

export async function createProduct(data: ProductFormData) {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Here you would typically save to a database
  // For now, we'll just return the data
  return {
    success: true,
    data: {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
    },
  }
}

