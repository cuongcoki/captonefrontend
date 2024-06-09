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
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { ProductSchema } from "@/schema";

import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
    setOpen: (open: boolean) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ setOpen }) => {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            productID: "",
            productName: "",
            Code: "",
            productPrice: "",
            isGroup: "",
            size: "",
            description: "",
            createdBy: "",
        },
    });

    const onSubmit = (data: z.infer<typeof ProductSchema>) => {
        setLoading(true);
        console.log(data);
        setOpen(false)
    };

    const { pending } = useFormStatus();
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="productID"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Mã sản phẩm</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Tên sản phẩm</FormLabel>
                                <div className="w-[70%]">

                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Code"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Mã Code</FormLabel>
                                <div className="w-[70%]">

                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="productPrice"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Giá sản phẩm</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>

                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isGroup"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Nhóm</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Kích cỡ</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Mô tả</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="createdBy"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Tạo bởi ai</FormLabel>
                                <div className="w-[70%]">
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </div>
                        </FormItem>
                    )}
                />
                <Separator className="h-1" />
                <FormLabel className="flex items-center "></FormLabel>
                <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={pending}>
                    {loading ? "Loading..." : "GỬI"}
                </Button>
            </form>
        </Form>
    );
}