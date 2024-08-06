import { z } from "zod";


export const ShipOrderDetailRequestSchema = z.object({
    itemId: z.string().uuid({ message: "ID mục không hợp lệ" }),
    quantity: z.number().int().min(1, { message: "Số lượng phải lớn hơn 0" }),
    itemKind: z.number().int().min(0, { message: "Loại mục không hợp lệ" })
  });

export const ShipOrderSchema = z.object({
  shipperId: z.string({ message: "ID người giao hàng không hợp lệ" }),
  kindOfShipOrder: z.number().int().min(0, { message: "Loại đơn giao hàng không hợp lệ" }),
  shipDate: z.string()
//   orderId: z.string().uuid({ message: "ID đơn hàng không hợp lệ" }),
//   shipOrderDetailRequests: z.array(ShipOrderDetailRequestSchema).nonempty({ message: "Danh sách chi tiết đơn giao hàng không được rỗng" })
});
