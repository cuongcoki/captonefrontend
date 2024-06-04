import * as z from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    name: z.string().min(1, {
        message: "Please enter your name"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    })
})

export const SignInSchema = z.object({
    id: z.string().min(1,{
        message: "hãy nhập số CCCD/CMND"
    }),
    password: z.string().min(6, {
        message: "mật khẩu phải lớn hơn 6 ký tự"
    })
})


export const RoleSchema = z.object({
    title: z.string().min(1,{
        message: "hãy nhập vai trò"
    }),
    description: z.string().min(6, {
        message: "hãy nhập mô tả vai trò"
    })
})


export const UsersSchema = z.object({
    firstName: z.string().min(1,{ message: "First name is required." }),
    lastName: z.string().min(1,{ message: "Last name is required." }),
    dob: z.string(),
    gender:z.string(),
    address: z.string().min(1,{ message: "Address is required." }),
    phone: z.string().min(1,{ message: "Phone number is required." }),
    password: z.string().min(1,{ message: "Password is required." }),
    role: z.string().min(1,{ message: "Role is required." }),
    // isActive: z.string().optional(),
    facility: z.string().min(1,{ message: "Facility is required." }),
    
    pin: z.string().min(12).max(12, {
        message: "Your one-time password must be 12 characters.",
    }),
})