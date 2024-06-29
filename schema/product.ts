import * as z from "zod";



export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
  code: z.string()
  .min(1, { message: "Mã sản phẩm là bắt buộc." })
  .refine((code) => {
    const firstTwoChars = code.slice(0, 2);
    const restChars = code.slice(2);
    const isLetterFirstTwo = /^[a-zA-Z]+$/.test(firstTwoChars);
    const isDigitsRest = /^\d+$/.test(restChars);
    return isLetterFirstTwo && isDigitsRest;
  }, { message: "Hai ký tự đầu tiên phải là chữ cái và phần còn lại là số." }),
  price: z.coerce
    .number({ message: "Giá phải là số" })
    .min(1, { message: "Giá là bắt buộc." }),
  size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
  description: z.string()
});



export const ProductUpdateSchema = z.object({
    id: z.string().uuid({ message: "ID phải là UUID." }),
    code: z.string()
    .min(1, { message: "Mã sản phẩm là bắt buộc." })
    .refine((code) => {
      const firstTwoChars = code.slice(0, 2);
      const restChars = code.slice(2);
      const isLetterFirstTwo = /^[a-zA-Z]+$/.test(firstTwoChars);
      const isDigitsRest = /^\d+$/.test(restChars);
      return isLetterFirstTwo && isDigitsRest;
    }, { message: "Hai ký tự đầu tiên phải là chữ cái và phần còn lại là số." }),
    price: z.coerce.number({ message: "Giá phải là số" }).min(1, { message: "Giá là bắt buộc." }),
    size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
    description: z.string(),
    name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
    isInProcessing: z.boolean({ message: "Trạng thái xử lý là bắt buộc." }),
    // addImagesRequest: z.array(z.object({
    //     imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }),
    //     isBluePrint: z.boolean({ message: "Phải là giá trị boolean." }),
    //     isMainImage: z.boolean({ message: "Phải là giá trị boolean." }),
    // })).nonempty({ message: "Phải có ít nhất một hình ảnh." }),
});





