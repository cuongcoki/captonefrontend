"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

import { LogoSignIn } from "@/constants/images/index.js";
import { ForgetPasswordFormType, ForgetPasswordSchema } from "@/schema";
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
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function ForgetPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ForgetPasswordFormType>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = (data: ForgetPasswordFormType) => {
    setLoading(true);
    authApi
      .forgetPassword(data)
      .then((response) => {
        console.log(">>> forget pass", response.data.message);
        toast.success(response.data.message);
        setTimeout(() => {
          router.push(`/change-password/${data.id}`);
        }, 2000);
      })
      .catch((error) => {
        console.log(">>> forget pass error", error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-primary-backgroudPrimary">
      {/* <Toaster /> */}
      <div className="flex items-center justify-center py-12">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
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
