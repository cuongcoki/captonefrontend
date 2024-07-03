import { z } from 'zod';

// Hàm kiểm tra định dạng ngày "DD/MM/YYYY"
const dateFormat = (date: any) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

export const OrderSchema = z.object({
  companyId: z.string().uuid("ID công ty không hợp lệ"), // Kiểm tra chuỗi UUID hợp lệ với thông báo lỗi
  status: z.number(),
  startOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
  endOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
  vat: z.coerce
    .number({ message: "Vat phải là số" })
    .min(0, { message: "Vat phải lớn hơn 0" })
});


export const CompanyRequestSchema = z.object({
  name: z.string().nonempty({
    message: "Tên công ty không được để trống"
  }),
  address: z.string().nonempty({
    message: "Địa chỉ không được để trống"
  }),
  directorName: z.string().nonempty({
    message: "Tên giám đốc không được để trống"
  }),
  directorPhone: z.string().regex(/^\d{10}$/, {
    message: "Số điện thoại phải gồm 10 chữ số"
  }),
  email: z.string().email({
    message: "Email không hợp lệ"
  }),
  // companyType: z.number().min(1, {
  //   message: "Loại công ty không hợp lệ"
  // }).max(2, {
  //   message: "Loại công ty không hợp lệ"
  // })
});


export const OrderDetailRequestSchema = z.object({
  productIdOrSetId: z.string().uuid("ID sản phẩm hoặc bộ không hợp lệ"), 
  quantity: z.number().min(1, "Số lượng phải lớn hơn hoặc bằng 1"), 
  unitPrice: z.number().min(0, "Đơn giá phải lớn hơn hoặc bằng 0"), 
  note: z.string().optional(), 
  isProductId: z.boolean(),
});

export const UpdateOrderSchema =  z.object({
  companyId: z.string(),
  startOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
  endOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
  vat: z.coerce
    .number({ message: "Vat phải là số" })
    .min(0, { message: "Vat phải lớn hơn 0" })
});