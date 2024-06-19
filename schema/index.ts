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

export const SignInSchema = z.object({
  id: z.string().min(1, {
    message: "Hãy nhập số CCCD/CMND",
  }),
  password: z.string(),
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
  code: z.string().min(1, { message: "Mã sản phẩm là bắt buộc." }),
  price: z.coerce
    .number({ message: "Giá phải là số" })
    .min(1, { message: "Giá là bắt buộc." }),
  size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
  description: z.string().min(1, { message: "Mô tả là bắt buộc." }),
});

export const UsersSchema = z.object({
  firstName: z.string().min(1, { message: "Yêu cầu nhập Tên nhân viên." }),
  lastName: z.string().min(1, { message: "Yêu cầu nhập Họ của nhân viên." }),
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
  address: z
    .string()
    .min(1, { message: "Yêu cầu nhập địa chỉ của nhân viên." }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Số điện thoại phải đúng 10 chữ số" }
  ),
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
  roleId: z.number().min(1, { message: "roleId là bắt buộc." }),
  isActive: z.boolean(),
  companyId: z.string().min(1, { message: "Vui lòng chọn công ty." }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^\d{12}$/;
      return idPattern.test(id);
    },
    { message: "Id phải đúng 12 chữ số" }
  ),
  salaryByDay: z.coerce
    .number({ message: "Lương phải là số" })
    .min(1, { message: "Vui lòng nhập lương theo ngày của nhân viên." }),
});

export const UsersUpdateSchema = z.object({
  firstName: z.string().min(1, { message: "Tên là bắt buộc." }),
  lastName: z.string().min(1, { message: "Họ là bắt buộc." }),
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
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc." }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Số điện thoại phải đúng 10 chữ số" }
  ),

  roleId: z.number().min(1, { message: "roleId là bắt buộc." }),
  isActive: z.boolean(),
  facility: z.string().min(1, { message: "Công ty là bắt buộc." }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^\d{12}$/;
      return idPattern.test(id);
    },
    { message: "Id phải đúng 12 chữ số" }
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

export type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;
