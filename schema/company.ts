import { z } from "zod";

export const companyAddSchema = z.object({
  name: z.string().min(1, "Tên công ty không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  directorName: z
    .string()
    .min(1, "Tên giám đốc không được để trống")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Tên giám đốc chỉ được chứa ký tự chữ cái và khoảng trắng"
    ),
  directorPhone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  companyType: z.string().min(1, "Loại công ty không được để trống"),
});

export type CompanyAddSchemaType = z.infer<typeof companyAddSchema>;
