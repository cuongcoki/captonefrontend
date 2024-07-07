import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  name: z.string().min(1, {
    message: "Vui lòng nhập tên của bạn",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
});
const idSchema = z
  .string()
  .refine((val) => /^\d+$/.test(val), {
    message: "Tài khoản phải là số",
  })
  .refine((val) => [9, 10, 12].includes(val.length), {
    message: "Tài khoản phải là CMND (9 số), CCCD (12 số) hoặc số điện thoại (10 số)",
  });

const passwordSchema = z
  .string()
  .min(1, { message: "Vui lòng nhập mật khẩu của bạn" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Mật khẩu phải có ít nhất một chữ cái viết hoa",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Mật khẩu phải có ít nhất một chữ số",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    message: "Mật khẩu phải có ít nhất một ký tự đặc biệt",
  });

export const SignInSchema = z.object({
  id: idSchema,
  password: passwordSchema,
});

export const RoleSchema = z.object({
  title: z.string().min(1, {
    message: "Hãy nhập vai trò",
  }),
  description: z.string().min(6, {
    message: "Hãy nhập mô tả vai trò",
  }),
});

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc." }),
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
  price: z.coerce
    .number({ message: "Giá thành phải là số" })
    .min(1, { message: "Giá thành là bắt buộc." }),
  size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
  description: z.string(),
});

const salaryRequestSchema = z.object({
  salary: z.coerce
    .number({ message: "Lương phải là số" })
    .min(1, { message: "Vui lòng nhập lương" }),
  startDate: z.string().min(1, { message: "Vui lòng nhập ngày bắt đầu" }),
});

export const UsersSchema = z.object({
  firstName: z.string().min(1, { message: "Yêu cầu nhập tên nhân viên" }),
  lastName: z.string().min(1, { message: "Yêu cầu nhập họ của nhân viên" }),
  dob: z.string().refine(
    (dob) => {
      const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      return dobPattern.test(dob);
    },
    { message: "Ngày sinh phải có định dạng dd/MM/yyyy" }
  ),

  gender: z.string(),
  address: z.string().min(1, { message: "Yêu cầu nhập địa chỉ của nhân viên" }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Số điện thoại phải đúng 10 chữ số" }
  ),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải dài ít nhất 6 ký tự" })
    .refine(
      (password) => {
        return /[A-Z]/.test(password);
      },
      { message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa" }
    )
    .refine(
      (password) => {
        return /[!@#$%^&*(),.?":{}|<>]/.test(password);
      },
      { message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt" }
    ),
  roleId: z.number().min(1, { message: "roleId là bắt buộc" }),
  isActive: z.boolean(),
  companyId: z.string().min(1, { message: "Vui lòng chọn công ty" }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^(?:\d{9}|\d{12})$/;
      return idPattern.test(id);
    },
    { message: "Phải đúng 9 chữ số là CMND và 12 chữ số là CCCD" }
  ),
  salaryByDayRequest: salaryRequestSchema,
  salaryOverTimeRequest: salaryRequestSchema,
  // salaryByDay: z.coerce
  //   .number({ message: "Lương phải là số" })
  //   .min(1, { message: "Vui lòng nhập lương theo ngày của nhân viên" }),
});

export const UsersUpdateSchema = z.object({
  firstName: z.string().min(1, { message: "Tên là bắt buộc" }),
  lastName: z.string().min(1, { message: "Họ là bắt buộc" }),
  dob: z.string().refine(
    (dob) => {
      const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      return dobPattern.test(dob);
    },
    { message: "Ngày sinh phải có định dạng dd/MM/yyyy" }
  ),

  gender: z.string().refine(
    (gender) => {
      return gender === "Male" || gender === "Female";
    },
    { message: "Giới tính phải là 'Nam' hoặc 'Nữ'" }
  ),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Số điện thoại phải đúng 10 chữ số" }
  ),

  roleId: z.number().min(1, { message: "roleId là bắt buộc" }),
  isActive: z.boolean(),
  facility: z.string().min(1, { message: "Công ty là bắt buộc" }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^(?:\d{9}|\d{12})$/;
      return idPattern.test(id);
    },
    { message: "phải đúng 9 chữ số là CMND và 12 chữ số là CCCD" }
  ),
  salaryByDay: z.coerce
    .number({ message: "Lương phải là số" })
    .min(1, { message: "Lương là bắt buộc." }),
});

export const UserUpdateSchema = UsersSchema.omit({
  password: true,
  isActive: true,
});

export type UserUpdateFormType = z.infer<typeof UserUpdateSchema>;

export const ForgetPasswordSchema = z.object({
  id: z.string().refine(
    (id) => {
      const idPattern = /^\d{12}$/;
      return idPattern.test(id);
    },
    { message: "Id phải đúng 12 chữ số" }
  ),
});

export type ForgetPasswordFormType = z.infer<typeof ForgetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    id: z.string().refine(
      (id) => {
        const idPattern = /^\d{12}$/;
        return idPattern.test(id);
      },
      { message: "Id phải đúng 12 chữ số" }
    ),
    verifyCode: z.string(),
    password: z
      .string()
      .refine(
        (password) => {
          return /[A-Z]/.test(password);
        },
        { message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa" }
      )
      .refine(
        (password) => {
          return /[!@#$%^&*(),.?":{}|<>]/.test(password);
        },
        { message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt" }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu phải khớp",
    path: ["confirmPassword"],
  });

export const UpdateUserForm = z.object({
  id: z.string().nonempty({ message: "ID không được để trống" }),
  firstName: z.string().nonempty({ message: "Tên không được để trống" }),
  lastName: z.string().nonempty({ message: "Họ không được để trống" }),
  phone: z
    .string()
    .nonempty({ message: "Số điện thoại không được để trống" })
    .regex(/^\d+$/, { message: "Số điện thoại không hợp lệ" }),
  address: z.string().nonempty({ message: "Địa chỉ không được để trống" }),
  gender: z.enum(["Male", "Female"], { message: "Giới tính không hợp lệ" }),
  dob: z
    .string()
    .nonempty({ message: "Ngày sinh không được để trống" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Ngày sinh không hợp lệ, định dạng đúng: DD/MM/YYYY",
    }),
  roleId: z.number().int({ message: "Vai trò không hợp lệ" }),
  companyId: z.string().nonempty({ message: "Cơ sở không được để trống" }),

  salaryHistoryResponse: z.object({
    salaryByDayResponses: salaryRequestSchema,
    salaryByOverTimeResponses: salaryRequestSchema,
  }),
});

export type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;
