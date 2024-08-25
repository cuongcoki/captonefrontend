import { isBefore, isEqual, parse } from "date-fns";
import * as z from "zod";
const isLeapYear = (year: any) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getDaysInMonth = (month: any, year: any) => {
  switch (month) {
    case 1: // Tháng 1
    case 3: // Tháng 3
    case 5: // Tháng 5
    case 7: // Tháng 7
    case 8: // Tháng 8
    case 10: // Tháng 10
    case 12: // Tháng 12
      return 31;
    case 4: // Tháng 4
    case 6: // Tháng 6
    case 9: // Tháng 9
    case 11: // Tháng 11
      return 30;
    case 2: // Tháng 2
      return isLeapYear(year) ? 29 : 28;
    default:
      throw new Error("Tháng không hợp lệ");
  }
};

// Hàm kiểm tra định dạng ngày "DD/MM/YYYY"
const dateFormat = (date: any) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

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
    message:
      "Tài khoản phải là CMND (9 số), CCCD (12 số) hoặc số điện thoại (10 số)",
  });

const passwordSchema = z
  .string()
  .min(1, { message: "Vui lòng nhập mật khẩu của bạn" })


export const SignInSchema = z.object({
  id: idSchema,
  password: passwordSchema,
});

export const RoleSchema = z.object({
  title: z.string().min(1, {
    message: "Hãy nhập vai trò",
  }),
  description: z.string().min(6, {
    message: "Hãy nhập miêu tả vai trò",
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
  priceFinished: z.coerce
    .string()
    .min(1, { message: "Giá là bắt buộc." }),
  pricePhase1: z.coerce.string().min(1, { message: "Giá là bắt buộc." }),
  pricePhase2: z.coerce.string().min(1, { message: "Giá là bắt buộc." }),
  size: z.string().min(1, { message: "Kích thước là bắt buộc." }),
  description: z.string(),
});

const salaryRequestSchema = z.object({
  salary: z.coerce.string().min(1, { message: "Vui lòng nhập lương" }),
  startDate: z
    .string()
    .min(1, { message: "Vui lòng nhập ngày bắt đầu" })
    .refine(
      (dateStr) => {
        // Parse the date string
        const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date());

        // Check if the parsed date is before or equal to the current date
        const now = new Date();
        return isBefore(parsedDate, now) || isEqual(parsedDate, now);
      },
      { message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày hiện tại" }
    ),
});

const salaryRequestSchemaForUpdate = z.object({
  salary: z.coerce.string().min(1, { message: "Vui lòng nhập lương" }),
  startDate: z.string().refine(dateFormat, {
    message: "Ngày phải theo định dạng DD/MM/YYYY",
  }), // Kiểm tra chuỗi với định dạng DD/MM/YYYY
});

export const UsersSchema = z.object({
  firstName: z.string().min(1, { message: "Yêu cầu nhập họ của nhân viên" }),
  lastName: z.string().min(1, { message: "Yêu cầu nhập tên của nhân viên" }),
  dob: z
    .string()
    .nonempty({ message: "Ngày sinh không được để trống" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Ngày sinh không hợp lệ, định dạng đúng: DD/MM/YYYY",
    })
    .refine((dob) => {
      const [day, month, year] = dob.split("/").map(Number);
      if (month < 1 || month > 12) {
        return false;
      }
      if (day < 1) {
        return false;
      }
      if (year <= 1900) {
        return false;
      }
      const daysInMonth = getDaysInMonth(month, year);
      return day <= daysInMonth;
    }, {
      message: "Ngày sinh không hợp lệ, tháng này không có ngày đó.",
    }),

  gender: z.string(),
  address: z.string().min(1, { message: "Yêu cầu nhập địa chỉ của nhân viên" }),
  phone: z.string().refine(
    (phone) => {
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phone);
    },
    { message: "Số điện thoại phải đúng 10 chữ số" }
  ),
  roleId: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
  isActive: z.boolean(),
  companyId: z.string().min(1, { message: "Vui lòng chọn cơ sở" }),
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

  roleId: z.number().min(1, { message: "Vui lòng chọn vai trò" }),
  isActive: z.boolean(),
  facility: z.string().min(1, { message: "Vui lòng chọn cơ sở" }),
  id: z.string().refine(
    (id) => {
      const idPattern = /^(?:\d{9}|\d{12})$/;
      return idPattern.test(id);
    },
    { message: "Phải đúng 9 chữ số là CMND và 12 chữ số là CCCD" }
  ),
  salaryByDay: z.coerce
    .number({ message: "Lương phải là số" })
    .min(1, { message: "Lương là bắt buộc." }),
});

export const UserUpdateSchema = UsersSchema.omit({
  // password: true,
  isActive: true,
});

export type UserUpdateFormType = z.infer<typeof UserUpdateSchema>;

export const ForgetPasswordSchema = z.object({
  id: z.string().refine(
    (id) => {
      const idPattern = /^(\d{9}|\d{12}|\d{10})$/;
      return idPattern.test(id);
    },
    { message: "CCCD/CMND 9 hoặc 12 số, Số điện thoại 10 số" }
  ),
});


export type ForgetPasswordFormType = z.infer<typeof ForgetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    id: z.string().refine(
      (id) => {
        const idPattern = /^(\d{9}|\d{12}|\d{10})$/;
        return idPattern.test(id);
      },
      { message: "CCCD/CMND 9 hoặc 12 số, Số điện thoại 10 số" }
    ),
    verifyCode: z.string(),
    password: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu của bạn" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu phải khớp",
    path: ["confirmPassword"],
  });

export const UpdateUserForm = z.object({
  id: z.string().nonempty({ message: "CCCD/CMND không được để trống" }),
  firstName: z.string().nonempty({ message: "Họ không được để trống" }),
  lastName: z.string().nonempty({ message: "Tên không được để trống" }),
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
    })
    .refine((dob) => {
      const [day, month, year] = dob.split("/").map(Number);
      if (month < 1 || month > 12) {
        return false;
      }
      if (day < 1) {
        return false;
      }
      if (year <= 1900) {
        return false;
      }
      const daysInMonth = getDaysInMonth(month, year);
      return day <= daysInMonth;
    }, {
      message: "Ngày sinh không hợp lệ, tháng này không có ngày đó.",
    }),
  roleId: z.number().int({ message: "Vai trò không hợp lệ" }),
  companyId: z.string().nonempty({ message: "Cơ sở không được để trống" }),

  salaryHistoryResponse: z.object({
    salaryByDayResponses: salaryRequestSchemaForUpdate,
    salaryByOverTimeResponses: salaryRequestSchemaForUpdate,
  }),
});

export type ChangePasswordFormType = z.infer<typeof ChangePasswordSchema>;
