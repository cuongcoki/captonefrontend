"use client";

import { X } from "lucide-react";
import { describe } from "node:test";
import { z } from "zod";

export const materialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  unit: z.string(),
  image: z.string().nullable(),
  description: z.string(),
  quantityPerUnit: z
    .string()
    .min(1, "Số lượng từng đơn vị không được để trống")
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: "Số lượng từng đơn vị phải lớn hơn 0",
      }
    ),
  quantityInStock: z
    .string()
    .min(1, "Số lượng không được để trống")
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: "Số lượng phải lớn hơn 0",
      }
    ),
});

export type materialType = z.infer<typeof materialSchema>;

export const AddMaterialSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string(),
  unit: z.string(),
  quantityPerUnit: z
    .string()
    .min(1, "Số lượng từng đơn vị không được để trống")
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: "Số lượng phải lớn hơn 0",
      }
    ),
  image: z.string().nullable(),
  quantityInStock: z
    .string()
    .min(1, "Số lượng không được để trống")
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      },
      {
        message: "Số lượng phải lớn hơn 0",
      }
    ),
});

export type AddMaterialType = z.infer<typeof materialSchema>;

export const materialHistorySchema = z.object({
  materialHistoryID: z.string(),
  materialID: z.string(),
  quantity: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Số lượng phải lớn hơn 0",
    }
  ),
  price: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Giá phải lớn hơn 0",
    }
  ),
  importAt: z.string(),
  importBy: z.string(),
  material: materialSchema,
});

export type materialHistoryType = z.infer<typeof materialHistorySchema>;

export const materialHistoryFormSchema = z.object({
  materialID: z.string().min(1, "Vui lòng chọn nguyên liệu"),
  quantity: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Số lượng phải lớn hơn 0",
    }
  ),
  price: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Giá phải lớn hơn không",
    }
  ),
  importAt: z.string().min(1, "Vui lòng chọn ngày nhập"),
});

export type materialHistoryFormType = z.infer<typeof materialHistoryFormSchema>;

export const materialHistoryFilterSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export type materialHistoryFilterType = z.infer<
  typeof materialHistoryFilterSchema
>;

//---------------------------------------------- Material API ----------------------------------------------
