"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";

import { LogoSignIn } from "@/constants/images/index.js";
import { ChangePasswordFormType, ChangePasswordSchema } from "@/schema";
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
import { authApi } from "@/apis/auth.api";
import { ConfirmChangePassword } from "@/types/userTypes";

export default function ChangePasswod() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      id: params.id,
      verifyCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    const body: ConfirmChangePassword = {
      userId: data.id,
      verifyCode: data.verifyCode,
      password: data.password,
    };
    authApi
      .confirmChangePassword(body)
      .then((response) => {
        console.log(">>> change password", response.data.message);
        router.push("/sign-in");
      })
      .catch((error) => {
        console.log(">>> change pass error", error);
      });
  };
  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-primary-backgroudPrimary">
      <div className="flex items-center justify-center py-10">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Image
              src={LogoSignIn}
              alt="Logo May Tre Dan Tien Huy"
              width={800}
              height={800}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel className="text-secondary-backgroudPrimary">
                      CĂN CƯỚC CÔNG DÂN
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Cccd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-backgroudPrimary">
                      MÃ XÁC THỰC
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="xxxxx" {...field} />
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
                    <FormLabel className="text-secondary-backgroudPrimary">
                      MẬT KHẨU MỚI
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-backgroudPrimary">
                      NHẬP LẠI MẬT KHẨU
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-secondary-backgroudPrimary text-primary-backgroudPrimary hover:bg-yellow-300"
              >
                GỬI MÃ XÁC NHẬN
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-between text-secondary-backgroudPrimary">
            <Link href="/sign-in" className="text-sm underline">
              QUAY LẠI ĐĂNG NHẬP
            </Link>

            <Link href="/#" className=" inline-block text-sm underline">
              TRỢ GIÚP ?
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
