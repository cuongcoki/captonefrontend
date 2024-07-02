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
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Ghost } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
export default function FormSignIn() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // ** Hooks
  const router = useRouter();

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
        console.log("DATA", data);
        if (data.isSuccess) {
          const { user, accessToken, refreshToken } = data.data;
          auth.login(user, rememberMe, accessToken, refreshToken);
          console.log(data);
          toast.success(data.message);
          router.push("/dashboard/home");
        } else {
          if (data?.message?.includes("id is incorrect")) {
            form.setError("id", {
              type: "manual",
              message: data?.message,
            });
          } else if (data?.message?.includes("Password is incorrect")) {
            form.setError("password", {
              type: "manual",
              message: data?.message,
            });
          } else {
            // Handle other errors
          }
        }
      })
      .catch((err) => {
        // Handle catch error
        console.log("ERROR", err);
        toast.error(
          "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập!"
        );
        // console.error(err.response.data.message);
        // toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
    // window.addEventListener("beforeunload", function (e) {
    //   e.returnValue = false; // Chrome requires returnValue to be set.
    //   return false; // Standard-compliant browsers.
    // });
    // console.log(data);
  };

  return (
    <Form {...form}>
      {/* <Toaster /> */}

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
        {/* <div className="flex items-center space-x-2">
                    <Checkbox  id="terms" checked={rememberMe} onCheckedChange={handleClickRemember}  />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                        Nhớ tôi
                    </label>
                </div> */}
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
