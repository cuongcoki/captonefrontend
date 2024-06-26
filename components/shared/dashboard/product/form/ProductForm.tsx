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
import { Upload } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast, { Toaster } from "react-hot-toast";

import { productApi } from "@/apis/product.api";
import { filesApi } from "@/apis/files.api";

import { MyContext } from "../table/products/RenderTable";

interface ProductFormProps {
    setOpen: (open: boolean) => void;
}
const initialImageRequests = [
    {
        imageUrl: "", // Chỉ cần khởi tạo các trường cần thiết, nếu không có giá trị thực tế
        isBluePrint: false,
        isMainImage: false,
    },
];
export const ProductForm: React.FC<ProductFormProps> = ({ setOpen }) => {
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
        {   id:string
            imageUrl: string;
            isBluePrint: boolean;
            isMainImage: boolean
        }[]
    >([]);

    //    console.log('imageRequests',imageRequests)
    // console.log('imageUrls', imageUrls)

    console.log('imageRequests', imageRequests)


    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const maxTotalSize = 1200000; // 1200 KB

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
        }).map(file => ({
            file: file,
            imageUrl: URL.createObjectURL(file),
            isBluePrint: false,
            isMainImage: false,
        }));

        setImageRequests((prevImageRequests:any) => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageUrls((prevImageRequests: any) => [
            ...prevImageRequests,
            ...newImageRequests.map((item) => item.file)
        ]);
    };

    // ** hàm xóa ảnh theo index
    const handleDeleteImage = (index: number) => {
        setImageRequests(prevImageRequests =>
            prevImageRequests.filter((_, i) => i !== index)
        );
        setImageUrls((prevImageUrls: any) => prevImageUrls.filter((_: any, i: any) => i !== index));
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



    const handelGetImage = async () => {
        setLoading(true);
        try {
            const fileNames = imageUrls.map((imageUrl: any) => imageUrl.name);

            const nameImagePromises = fileNames.map(async (fileName: any) => {
                try {
                    const { data } = await filesApi.getFile(fileName);
                    return data.data; // Assuming data.data contains the image name
                } catch (error) {
                    console.error('Error getting file:', error);
                    throw error;
                }
            });

            const names = await Promise.all(nameImagePromises);
            setNameImage(names);
            console.log('Processed image names:', names);
        } catch (error) {
            console.error('Error getting image names:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log('nameImage', nameImage)

    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
        setLoading(true);
        try {
            await handlePostImage();

            // Wait for `handelGetImage` to complete
            await handelGetImage();

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
                        toast.error(response.data.message);
                        // window.location.href = '/dashboard/product';
                    }, 2000);
                } else {
                    toast.error(response.data.message);
                }

            } else {
                // Xử lý khi nameImage không có giá trị
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
                toast.error('Error submitting form');
            }

        } finally {
            setLoading(false);
        }
    };


    // console.log('imageRequests', imageRequests)

    const { pending } = useFormStatus();
    return (
        <Form {...form} >
            <Toaster />
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {/* Phần đăng hình ảnh */}
                <div className=" w-full col-span-2 relative">
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
            </div>

        </Form>
    );
}