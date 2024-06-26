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
import { useContext, useEffect, useState } from "react";
import { ProductSchema } from "@/schema";

import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";
import { PencilLine, Plus, Upload, X } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast, { Toaster } from "react-hot-toast";

import { productApi } from "@/apis/product.api";
import { filesApi } from "@/apis/files.api";

import { MyContext } from "../table/products/RenderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as Dialog from "@radix-ui/react-dialog";


const initialImageRequests = [
    {
        imageUrl: "", // Chỉ cần khởi tạo các trường cần thiết, nếu không có giá trị thực tế
        isBluePrint: false,
        isMainImage: false,
    },
];
export const ProductForm = () => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };


    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<any>([]);
    const [nameImage, setNameImage] = useState<string[]>([]);
    const form = useForm({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            code: "",
            price: 1,
            size: "",
            description: "",
            name: "",
            imageRequests: initialImageRequests,
        },
    });
    const { forceUpdate } = useContext(MyContext);

    const [imageRequests, setImageRequests] = useState<
        {
            id: string
            imageUrl: string;
            isBluePrint: boolean;
            isMainImage: boolean
        }[]
    >([]);

    //    console.log('imageRequests',imageRequests)
    console.log('imageUrls', imageUrls)

    console.log('imageRequests', imageRequests)

    const generateRandomString = (length: number = 5) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const maxTotalSize = 2000000; // 2000 KB

        let currentTotalSize = imageRequests.reduce((total, req: any) => total + req.file.size, 0);

        const newImageRequests = files.filter(file => {
            if (!validImageTypes.includes(file.type)) {
                toast.error(`File ${file.name} is not a valid image type.`);
                return false;
            }
            if (file.size > 1000000) { // 1000 KB
                toast.error(`File ${file.name} exceeds the size limit of 1000 KB.`);
                return false;
            }
            if (currentTotalSize + file.size > maxTotalSize) {
                toast.error(`Adding file ${file.name} exceeds the total size limit of 1200 KB.`);
                return false;
            }
            currentTotalSize += file.size;
            return true;
        }).map(file => {
            const extension = file.name.substring(file.name.lastIndexOf("."));

            const randomString = generateRandomString();
            const date = new Date();
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hour = date.getHours().toString().padStart(2, "0");
            const minute = date.getMinutes().toString().padStart(2, "0");
            const second = date.getSeconds().toString().padStart(2, "0");

            const changedFileName = `images-${randomString}-${year}${month}${day}${hour}${minute}${second}${extension}`;
            const newFile = new File([file], changedFileName, { type: file.type });

            return {
                file: newFile,
                imageUrl: URL.createObjectURL(newFile),
                isBluePrint: false,
                isMainImage: false,
                changedFileName: changedFileName,
            };
        });

        setImageRequests((prevImageRequests: any) => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageUrls((prevImageUrls: any) => [
            ...prevImageUrls,
            ...newImageRequests.map((item) => item.file)
        ]);
        setNameImage((prevNameImage: any) => [
            ...prevNameImage,
            ...newImageRequests.map((item) => item.changedFileName)
        ]);
    };

    // ** hàm xóa ảnh theo index
    const handleDeleteImage = (index: number) => {
        setImageRequests(prevImageRequests =>
            prevImageRequests.filter((_, i) => i !== index)
        );
        setImageUrls((prevImageUrls: any) => prevImageUrls.filter((_: any, i: any) => i !== index));
        setNameImage((prevNameImage: any) =>
            prevNameImage.filter((_: any, i: any) => i !== index)
        );
    };

    // ** hàm set true false cho Blueprint
    const handleToggleBlueprint = (index: number) => {
        setImageRequests(prevImageRequests =>
            prevImageRequests.map((req, i) =>
                i === index ? { ...req, isBluePrint: !req.isBluePrint } : req
            )
        );
    };

    // ** hàm set true false cho MainImage
    const handleToggleMainImage = (index: number) => {
        setImageRequests(prevImageRequests =>
            prevImageRequests.map((req, i) =>
                i === index ? { ...req, isMainImage: !req.isMainImage } : req
            )
        );
    };


    const handlePostImage = async () => {
        setLoading(true);
        const formData = new FormData();
        imageUrls.forEach((imageUrl: any) => {
            formData.append('receivedFiles', imageUrl); // Đảm bảo rằng tên trường tương ứng với server
        });
        try {
            const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
            console.log('Upload successful:', response.data);
            // Xử lý các hành động sau khi tải lên thành công
        } catch (error) {
            console.error('Error uploading files:', error);
            // Xử lý lỗi khi tải lên không thành công
        } finally {
            setLoading(false);
        }
    };





    console.log('nameImage', nameImage)

    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
        setLoading(true);
        try {
            await handlePostImage();



            // Ensure `nameImage` has been updated
            if (imageRequests && nameImage) {
                const requestBody = {
                    code: data.code,
                    price: data.price,
                    size: data.size,
                    description: data.description,
                    name: data.name,
                    imageRequests: imageRequests.map((image, index) => ({
                        imageUrl: nameImage[index],
                        isBluePrint: image.isBluePrint,
                        isMainImage: image.isMainImage,
                    }))
                };

                console.log('requestBody', requestBody);

                const response = await productApi.createProduct(requestBody);
                if (response.data.isSuccess) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        setOpen(false);
                        forceUpdate();
                        // window.location.href = '/dashboard/product';
                    }, 2000);
                } else {
                    toast.error(response.data.message);
                }

            } else {
                toast.error('imageUrl (nameImage) is not valid');
            }


        } catch (error: any) {
            // Handle errors from form submission or API calls
            if (error.response && error.response.data && error.response.data.error) {
                if (error.response.data.error.ImageRequests && error.response.data.error.Code) {
                    toast.error(error.response.data.error.ImageRequests);
                    toast.error(error.response.data.error.Code);
                } else if (error.response.data.error.Code) {
                    toast.error(error.response.data.error.Code);
                } else {
                    toast.error(error.response.data.error.ImageRequests);
                }
            } else {
                console.error('Error submitting form:', error);
            }

        } finally {
            setLoading(false);
        }
    };


    // console.log('imageRequests', imageRequests)

    const { pending } = useFormStatus();
    return (
        <Dialog.Root open={open} onOpenChange={handleOnDialog}>
            <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                <Plus onClick={handleOnDialog} />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                    <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
                        <div className="bg-slate-100  flex flex-col ">
                            <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary  rounded-t-md">
                                <h2 className="text-2xl text-white">Thêm sản phẩm</h2>
                                <Button variant="outline" size="icon"  onClick={handleOffDialog} >
                                    <X className="w-4 h-4"/>
                                </Button>
                            </div>
                            <div className="grid gap-4 p-4 overflow-y-auto h-[650px]">
                                <Form {...form} >
                                    <Toaster />

                                    {/* Phần đăng hình ảnh */}

                                    <Card>
                                        <CardHeader className="flex items-center justify-between">
                                            <CardTitle className="text-primary-backgroudPrimary">Thông tin sản phẩm</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6">
                                            <Card className=" relative border-none shadow-none">
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
                                                                multiple
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
                                                                onToggleBlueprint={handleToggleBlueprint}
                                                                onToggleMainImage={handleToggleMainImage}
                                                            />

                                                            {/* Phần add thêm image */}
                                                            <input
                                                                id='image'
                                                                type='file'
                                                                style={{ display: 'none' }}
                                                                accept='image/*'
                                                                onChange={e => handleUploadPhotos(e)}
                                                                multiple
                                                            />
                                                            <label htmlFor='image' className="absolute bottom-0">
                                                                <Upload size={35} className="flex items-center justify-center text-primary-backgroudPrimary bg-white rounded-md p-2 m-5" />
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                            <form onSubmit={form.handleSubmit(onSubmit)} >
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
                                                    {/* price */}
                                                    <FormField
                                                        control={form.control}
                                                        name="price"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Giá sản phẩm</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {/* size */}
                                                    <FormField
                                                        control={form.control}
                                                        name="size"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Kích cỡ</FormLabel>
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
                                                    <Separator className="h-1" />
                                                    <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={pending}>
                                                        {loading ? "Loading..." : "GỬI"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>


                                </Form>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}






