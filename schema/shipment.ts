import { z } from "zod";



export const ShipmentSchema = z.object({
    fromId: z.string().uuid({ message: "công ty gửi phải là UUID hợp lệ" }),
    toId: z.string().uuid({ message: "công ty nhận phải là UUID hợp lệ" }),
    shipperId: z.string().min(1, { message: "nhân viên vận chuyển không được rỗng" }),
    shipDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "ngày ship phải là ngày tháng hợp lệ (ISO 8601)",
    }),
  });