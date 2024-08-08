import { z } from "zod";



export const ShipmentSchema = z.object({
    fromId: z.string().uuid({ message: "Công ty gửi không hợp lệ" }),
    toId: z.string().uuid({ message: "Công ty nhận không hợp lệ" }),
    shipperId: z.string().min(1, { message: "Yêu cầu chọn nhân viên vận chuyển" }),
    shipDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Vui lòng chọn ngày vận đơn",
    }),
  });