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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
export default function FormSignIn() {
  //state
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // ** Hooks
  const router = useRouter();
  const auth = useAuth();

  const handleClickRemember = () => {
    setRememberMe(!rememberMe);
  };

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
          const { user, accessToken, refreshToken } = data.data;
          auth.login(user, rememberMe, accessToken, refreshToken);
          console.log(data);
          toast.success(data.message);
          router.push(`/profile/${data.data.user.id}`);
      })
      .catch((error) => {
        const errors = error.response.data.message
        console.log(error.data)
        toast.error(errors)
        
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return (
    <Form {...form}>

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
                TÀI KHOẢN
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
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
                MẬT KHẨU
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  className="bg-white text-black hover:bg-white absolute bottom-0 right-0 flex items-center text-sm leading-5"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </Button>
              </div>
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
