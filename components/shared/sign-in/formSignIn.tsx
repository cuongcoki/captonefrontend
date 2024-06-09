"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInSchema } from "@/schema";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/auth.api";
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
export default function FormSignIn() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState<boolean>(true);

    // ** Hooks
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            id: "",
            password: "",
        },
    });
    
    const onSubmit = (data: z.infer<typeof SignInSchema>) => {
        const { id, password } = data;
        setLoading(true);
        authApi
            .login({ id, password })
            .then(({ data }) => {
                if (data.isSuccess) {
                    const { user, accessToken, refreshToken } = data.data;
                    auth.login(user, rememberMe, accessToken, refreshToken);
                    console.log(data)
                    toast.success(data.message)
                    router.push('/dashboard/home')
                } else {
                    if (data?.message?.includes('id is incorrect')) {
                        form.setError('id', {
                            type: 'manual',
                            message: data?.message,
                        });
                    } else if (data?.message?.includes('Password is incorrect')) {
                        form.setError('password', {
                            type: 'manual',
                            message: data?.message,
                        });
                    } else {
                        // Handle other errors

                    }
                }
            })
            .catch(err => {
                // Handle catch error
                console.error(err.response.data.message);
                toast.error(err.response.data.message);
            })
            .finally(() => {
                setLoading(false);

            });
        console.log(data);
    };

    return (
        <Form {...form}>
            <Toaster />
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-md w-full flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-secondary-backgroudPrimary">
                                CCCD/CMND
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-secondary-backgroudPrimary">
                                NHẬP MẬT KHẨU
                            </FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormLabel className="flex items-center text-secondary-backgroudPrimary"></FormLabel>
                <Button
                    type="submit"
                    className="w-full bg-secondary-backgroudPrimary text-primary-backgroudPrimary hover:bg-yellow-300"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "ĐĂNG NHẬP"}

                </Button>
            </form>
        </Form>
    );
}
