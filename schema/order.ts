import { z } from 'zod';

// Hàm kiểm tra định dạng ngày "DD/MM/YYYY"
const dateFormat = (date: any) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

export const OrderSchema = z.object({
  companyId: z.string().uuid("ID công ty không hợp lệ"), // Kiểm tra chuỗi UUID hợp lệ với thông báo lỗi
  status: z.string().min(1, "Trạng thái không được để trống"), // Kiểm tra chuỗi không rỗng với thông báo lỗi
  startOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
  endOrder: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY"
  }) // Kiểm tra chuỗi với định dạng DD/MM/YYYY
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