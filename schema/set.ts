import * as z from "zod";

export const SetSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Mã bộ sản phẩm là bắt buộc." })
    .refine(
      (code) => {
        const firstTwoChars = code.slice(0, 2);
        const restChars = code.slice(2);
        const isLetterFirstTwo = /^[a-zA-Z]+$/.test(firstTwoChars);
        const isDigitsRest = /^\d+$/.test(restChars);
        return isLetterFirstTwo && isDigitsRest;
      },
      { message: "Hai ký tự đầu tiên phải là chữ cái và phần còn lại là số." }
    ),
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
  description: z.string().min(1, { message: "Mô tả sản phẩm là bắt buộc." }),
});

export const SetUpdateSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Mã sản phẩm là bắt buộc." })
    .refine(
      (code) => {
        const firstTwoChars = code.slice(0, 2);
        const restChars = code.slice(2);
        const isLetterFirstTwo = /^[a-zA-Z]+$/.test(firstTwoChars);
        const isDigitsRest = /^\d+$/.test(restChars);
        return isLetterFirstTwo && isDigitsRest;
      },
      { message: "Hai ký tự đầu tiên phải là chữ cái và phần còn lại là số." }
    ),
  description: z.string(),
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
  imageUrl: z.string().min(1, { message: "Chưa có ảnh" }),
});
