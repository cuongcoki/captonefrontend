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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { SetSchema } from "@/schema/set";

import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast, { Toaster } from "react-hot-toast";

interface SetFormProps {
    setOpen: (open: boolean) => void;
}

export const SetForm: React.FC<SetFormProps> = ({ setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [imageRequests, setImageRequests] = useState<string[]>([]);
    const form = useForm({
        resolver: zodResolver(SetSchema),
        defaultValues: {
            code: "",
            description: "",
            name: "",
        },
    });


    // Xử lý khi người dùng tải lên hình ảnh mới
    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImageRequests = files.map((file) => URL.createObjectURL(file));
        setImageRequests((prevImageRequests) => [...prevImageRequests, ...newImageRequests]);
    };

    // Xử lý khi người dùng xóa một hình ảnh đã có
    const handleDeleteImage = (index: number) => {
        const newImageRequests = [...imageRequests];
        newImageRequests.splice(index, 1);
        setImageRequests(newImageRequests);
    };

    // Xử lý khi người dùng gửi form
    const onSubmit = async (data: z.infer<typeof SetSchema>) => {
        setLoading(true);
        console.log('Submitted data:', data);

        try {
            // Thực hiện gửi dữ liệu đi (chẳng hạn gọi API)
            // const response = await productApi.createProduct(data);
            // toast.success(response.data.message); // Hiển thị thông báo thành công
            toast.success('Product created successfully'); // Ví dụ sử dụng toast khi thành công
            setOpen(false); // Đóng form sau khi gửi thành công
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product'); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false);
        }
    };




    const { pending } = useFormStatus();
    return (
        <Form {...form} >
            <Toaster />
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* Phần đăng hình ảnh */}
                <div className="md:w-[60%] flex items-center justify-between relative">
                    <div>
                        {/* nếu không có ảnh nào thì hiện input này */}
                        {imageRequests.length < 1 && (
                            <div style={{ width: '100%', height: '100%' }}>
                                <input
                                    id='image'
                                    type='file'
                                    style={{ display: 'none' }}
                                    accept='image/*'
                                    onChange={e => handleUploadPhotos(e)}

                                />
                                <label htmlFor='image' className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Upload size={100} className="text-white flex items-center justify-center bg-primary-backgroudPrimary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto" />
                                    <span className="text-l text-gray-500 font-medium">Hãy tải ảnh sản phẩm lên</span>
                                </label>
                            </div>
                        )}

                        {/* nếu có trên 1 ảnh thì hiện input này */}
                        {imageRequests.length > 0 && (
                            <div className="relative w-full h-full">
                                {/* phần hiển thị ảnh xem trước */}
                                <ImageDisplay
                                    images={imageRequests}
                                    onDelete={handleDeleteImage}
                                />

                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[40%]">
                    {/* Phần nhập dữ liệu thông tin */}
                    <div className="w-full flex flex-col gap-4">
                        {/* code */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Mã CODE</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Tên sản phẩm</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* setProductsRequest */}
                    

                        <Separator className="h-1" />
                        <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={pending}>
                            {loading ? "Loading..." : "GỬI"}
                        </Button>
                    </div>
                </form>
            </div>

        </Form>
    );
}