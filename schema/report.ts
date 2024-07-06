import { z } from "zod";

export const reportAddSchema = z.object({
  description: z
    .string()
    .min(1, "Vui lòng nhập nội dung báo cáo")
    .max(700, "Nội dung báo cáo không quá 700 ký tự"),
  reportType: z.string().min(1, "Loại báo cáo không được để trống"),
});

export type ReportAddSchemaType = z.infer<typeof reportAddSchema>;
