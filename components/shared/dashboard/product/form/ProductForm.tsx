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
import { Upload } from "lucide-react";
import ImageDisplay from "./ImageDisplay";
import storage from "@/lib/storage";

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
    const [imageUrls, setImageUrls] = useState<string[]>([]); 
    const form = useForm({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            code: "",
            price: "",
            size: "",
            description: "",
            name: "",
            imageRequests: initialImageRequests,
        },
    });


    const [imageRequests, setImageRequests] = useState<
        {
            imageUrl: string;
            isBluePrint: boolean;
            isMainImage: boolean
        }[]
    >([]);

    // const fetchImageUpload = async (file: File): Promise<string> => {
    //     const formData = new FormData();
    //     formData.append("image", file);
      
    //     try {
    //         const response = await fetch("https://capstone-backend.online/api/files", {
    //             method: "POST",
    //             body: formData,
    //         });
    
    //         if (!response.ok) {
    //             throw new Error("Failed to upload image");
    //         }
    
    //         const data = await response.json();
    //         return data.imageUrl; // Trả về link ảnh từ phản hồi của server
    //     } catch (error) {
    //         console.error("Error uploading image", error);
    //         throw error; // Xử lý lỗi khi gửi yêu cầu lên server
    //     }
    // };

    // ** hàm đăng ảnh
    // Hàm xử lý upload ảnh lên backend
    // const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = Array.from(e.target.files || []);

    //     // Lưu các link ảnh từ backend
    //     const uploadedImageUrls: string[] = [];

    //     // Duyệt từng file ảnh để upload
    //     for (const file of files) {
    //         try {
    //             const imageUrl = await fetchImageUpload(file); // Gửi file ảnh lên backend và nhận link ảnh về
    //             uploadedImageUrls.push(imageUrl); // Lưu link ảnh vào mảng
    //         } catch (error) {
    //             console.error("Error uploading image", error);
    //             // Xử lý lỗi khi upload ảnh
    //         }
    //     }

    //     setImageUrls(uploadedImageUrls); // Lưu các link ảnh vào state để sử dụng khi submit form
    // };

    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImageRequests = files.map(file => ({
            imageUrl: URL.createObjectURL(file),
            isBluePrint: false,
            isMainImage: false,
        }));

        setImageRequests(prevImageRequests => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
    };


    // ** hàm xóa ảnh theo index
    const handleDeleteImage = (index: number) => {
        setImageRequests(prevImageRequests =>
            prevImageRequests.filter((_, i) => i !== index)
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

    const stogae = localStorage.getItem('accessToken');

    // ** hàm Submit
    // const onSubmit = async (data: any) => {
    //     console.log('data', data)
    //     setLoading(true);
    //     const formData = new FormData();

    //     // Thêm các giá trị từ form vào formData
    //     formData.append('code', data.code);
    //     formData.append('price', data.price.toString()); // Chuyển price sang string để tránh lỗi
    //     formData.append('size', data.size);
    //     formData.append('description', data.description);
    //     formData.append('name', data.name);

    //     // Thêm các hình ảnh từ imageRequests vào formData
    //     imageRequests.forEach((image, index) => {
    //         formData.append(`imageRequests[${index}][imageUrl]`, image.imageUrl);
    //         formData.append(`imageRequests[${index}][isBluePrint]`, String(image.isBluePrint));
    //         formData.append(`imageRequests[${index}][isMainImage]`, String(image.isMainImage));
    //     });

    //     console.log('formData',formData)
    //     try {
    //         // Gửi formData đến server hoặc xử lý formData ở đây
    //         // Ví dụ:
    //         // const response = await fetch('url_api', {
    //         //     method: 'POST',
    //         //     body: formData,
    //         //     // headers: {'Content-Type': 'multipart/form-data'}, // Thêm header nếu cần thiết
    //         // });
    //         // const responseData = await response.json();
    //         // console.log(responseData);

          
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    //     // setOpen(false)
    // };

    const onSubmit = async (data: any) => {
        setLoading(true);

        try {
            // Tạo object JSON để gửi lên server
            const requestBody = {
                code: data.code,
                price: data.price,
                size: data.size,
                description: data.description,
                name: data.name,
                imageRequests: imageRequests.map(image => ({
                    imageUrl: image.imageUrl,
                    isBluePrint: image.isBluePrint,
                    isMainImage: image.isMainImage
                }))
            };
            console.log('requestBody',requestBody)
            

            // Gửi requestBody lên server bằng fetch hoặc axios
            const response = await fetch('https://capstone-backend.online/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${stogae}`,
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();
            console.log(responseData);

            // setOpen(false); // Đóng form sau khi submit thành công
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    // console.log('imageRequests', imageRequests)

    const { pending } = useFormStatus();
    return (
        <Form {...form} >


            <div className="flex justify-between gap-4 ">
                {/* Phần đăng hình ảnh  */}
                <div className="w-[70%]  flex items-center justify-between relative ">
                    <div>
                        {/* nếu không có ảnh nào thì hiện input này  */}

                        {
                            imageRequests.length < 1 && (
                                <div style={{ width: '100%', height: '100%' }}>
                                    <input id='image'
                                        type='file'
                                        style={{ display: 'none' }}
                                        accept='image/*'
                                        onChange={e => handleUploadPhotos(e)}
                                        multiple
                                    />
                                    <label htmlFor='image' className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >
                                        <Upload size={100} className="text-white flex items-center justify-center bg-primary-backgroudPrimary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto" />
                                        <span className="text-l text-gray-500 font-medium">Hãy tải ảnh sản phẩm lên</span>
                                    </label>
                                </div>
                            )
                        }

                        {/* nếu có trên 1 ảnh thì hiện input này */}

                        {
                            imageRequests.length > 0 && (
                                <div className="relative w-[100%] h-[100%]">

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
                            )
                        }
                    </div>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-[30%] "
                >

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
                                        <Input type="text" {...field} />
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
                        <FormLabel className="flex items-center "></FormLabel>
                        <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={pending}>
                            {loading ? "Loading..." : "GỬI"}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
}