"use client";

import { X } from "lucide-react";
import { describe } from "node:test";
import { z } from "zod";

export const materialSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  unit: z.string(),
  image: z.string(),
  description: z.string(),
  quantityPerUnit: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Quantity must be a number greater than 0",
    }
  ),
});

export type materialType = z.infer<typeof materialSchema>;

export const materialHistorySchema = z.object({
  materialHistoryID: z.string(),
  materialID: z.string(),
  quantity: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Quantity must be a number greater than 0",
    }
  ),
  price: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Price must be a number greater than 0",
    }
  ),
  importAt: z.string(),
  importBy: z.string(),
  material: materialSchema,
});

export type materialHistoryType = z.infer<typeof materialHistorySchema>;

export const materialHistoryFormSchema = z.object({
  materialID: z.string(),
  quantity: z.string(),

  price: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "Price must be a number greater than 0",
    }
  ),
  importAt: z.string(),
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
