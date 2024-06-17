import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const SignInSchema = z.object({
  id: z.string().min(1, {
    message: "hãy nhập số CCCD/CMND",
  }),
  // password: z.string().min(6, {
  //   message: "mật khẩu phải lớn hơn 6 ký tự",
  // }),
  password: z.string(),
});

export const RoleSchema = z.object({
  title: z.string().min(1, {
    message: "hãy nhập vai trò",
  }),
  description: z.string().min(6, {
    message: "hãy nhập mô tả vai trò",
  }),
});

export const ProductSchema = z.object({
  productID: z.string().min(1, { message: "Product ID is required." }),
  productName: z.string().min(1, { message: "Product Name is required." }),
  Code: z.string().min(1, { message: "Code is required." }),
  productPrice: z.string(),
  isGroup: z.string(),
  size: z.string().min(1, { message: "Size is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  createdBy: z.string().min(1, { message: "Created By is required." }),
});

export const UsersSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  dob: z.string().refine(
    (dob) => {
      const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      return dobPattern.test(dob);
    },
    { message: "Date of birth must be in the format dd/MM/yyyy" }
  ),

  gender: z.string().refine(
    (gender) => {
      return gender === "Male" || gender === "Female";
    },
    { message: "Gender must be either 'Male' or 'Female'" }
  ),
  address: z.string().min(1, { message: "Address is required." }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Phone number must be exactly 10 digits" }
  ),
  password: z
    .string()
    .refine(
      (password) => {
        return /[A-Z]/.test(password);
      },
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (password) => {
        return /[!@#$%^&*(),.?":{}|<>]/.test(password);
      },
      { message: "Password must contain at least one special character" }
    ),
  roleId: z.number().min(1, { message: "roleId is required." }),
  isActive: z.boolean(),
  facility: z.string().min(1, { message: "Facility is required." }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^\d{12}$/;
      return idPattern.test(id);
    },
    { message: "Id must be exactly 12 digits" }
  ),
  salaryByDay: z.coerce
    .number({ message: "Lương phải là số" })
    .min(1, { message: "roleId is required." }),
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
    { message: "Id must be exactly 12 digits" }
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
      { message: "Id must be exactly 12 digits" }
    ),
    verifyCode: z.string(),
    password: z
      .string()
      .refine(
        (password) => {
          return /[A-Z]/.test(password);
        },
        { message: "Password must contain at least one uppercase letter" }
      )
      .refine(
        (password) => {
          return /[!@#$%^&*(),.?":{}|<>]/.test(password);
        },
        { message: "Password must contain at least one special character" }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;
