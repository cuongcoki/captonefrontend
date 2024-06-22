import * as z from "zod";



export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
  code: z.string().min(1, { message: "Mã sản phẩm là bắt buộc." }),
  price: z.coerce
    .number({ message: "Giá phải là số" })
    .min(1, { message: "Giá là bắt buộc." }),
  size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
  description: z.string().min(1, { message: "Mô tả là bắt buộc." }),
});



export const ProductUpdateSchema = z.object({
    id: z.string().uuid({ message: "ID phải là UUID." }),
    code: z.string().min(1, { message: "Mã sản phẩm là bắt buộc." }),
    price: z.coerce.number({ message: "Giá phải là số" }).min(1, { message: "Giá là bắt buộc." }),
    size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
    description: z.string().min(1, { message: "Mô tả là bắt buộc." }),
    name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
    isInProcessing: z.boolean({ message: "Trạng thái xử lý là bắt buộc." }),
    addImagesRequest: z.array(z.object({
        imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }),
        isBluePrint: z.boolean({ message: "Phải là giá trị boolean." }),
        isMainImage: z.boolean({ message: "Phải là giá trị boolean." }),
    })).nonempty({ message: "Phải có ít nhất một hình ảnh." }),
});





