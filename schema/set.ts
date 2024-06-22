import * as z from 'zod';

export const SetSchema = z.object({
  code: z.string().min(1, { message: "Mã sản phẩm là bắt buộc." }),
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
  description: z.string().min(1, { message: "Mô tả là bắt buộc." }),
 
});