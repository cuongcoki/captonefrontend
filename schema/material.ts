"use client";

import { z } from "zod";
import { parse, isValid } from "date-fns";

// Create a custom date validation
const importAtSchema = z.string().min(1, "Vui lòng chọn ngày nhập"); // Check for non-empty string
// .refine(
//   (val) => {
//     const selectedDate = parse(val, "dd/MM/yyyy", new Date());
//     const today = new Date();

//     // Remove time part for comparison
//     today.setHours(0, 0, 0, 0);
//     console.log("Selected date: ", selectedDate);
//     console.log("Today: ", today);

//     return isValid(selectedDate) && selectedDate <= today;
//   },
//   {
//     message: "Ngày nhập không được vượt quá ngày hiện tại hoặc không hợp lệ",
//   }
// );

export const materialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  unit: z.string().min(1, "Đơn vị không được để trống"),
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
  unit: z.string().min(1, "Đơn vị không được để trống"),
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
        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: "Số lượng phải lớn hơn bằng 0",
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
  importAt: importAtSchema,
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
      message: "Giá phải lớn hơn 0",
    }
  ),
  importAt: importAtSchema,
  description: z.string(),
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
