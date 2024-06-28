import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import ImageDisplay from './ImageDisplay';
import { ProductUpdateSchema } from '@/schema/product';
import toast, { Toaster } from 'react-hot-toast';
import { productApi } from '@/apis/product.api';
import { z } from 'zod';
import { MyContext } from "../table/products/RenderTable";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { filesApi } from '@/apis/files.api';

interface ProductData {
    code: string;
    description: string;
    id: string;
    imageResponses: {
        id: string;
        imageUrl: string;
        isBluePrint: boolean;
        isMainImage: boolean;
    }[];
    isInProcessing: boolean;
    name: string;
    price: number;
    size: string;
}

interface ProductID {
    productId?: ProductData;
    setOpen1: (open: boolean) => void;
}

export const ProductUpdateForm: React.FC<ProductID> = ({ productId, setOpen1 }) => {
    const [loading, setLoading] = useState(false);
    const { forceUpdate } = useContext(MyContext);
    console.log('productId', productId)
    const [updatedProduct, setUpdatedProduct] = useState<ProductData | undefined>(undefined);
    const [imageRequests, setImageRequests] = useState<any[]>([]);

    useEffect(() => {
        const fetchUpdatedProduct = async () => {
            if (productId) {
                try {
                    const updatedData = await Promise.all(productId.imageResponses.map(async (image) => {
                        try {
                            const { data } = await filesApi.getFile(image.imageUrl);
                            return {
                                ...image,
                                imageUrl: data.data,
                            };
                        } catch (error) {
                            console.error('Error getting file:', error);
                            return {
                                ...image,
                                imageUrl: '', // Handle error case if needed
                            };
                        }
                    }));
                    setUpdatedProduct({ ...productId, imageResponses: updatedData });
                    setImageRequests(updatedData);
                } catch (error) {
                    console.error('Error fetching updated product data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUpdatedProduct();
    }, [productId]);


    // Initialize image requests from productId if available
    const initialImageRequests = updatedProduct?.imageResponses.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        isBluePrint: image.isBluePrint,
        isMainImage: image.isMainImage,
    })) || [];
    console.log('initialImageRequests', initialImageRequests)

    // State to manage image requests

    console.log('imageRequests', imageRequests)

    // useForm hook for managing form state and validation
    const form = useForm({
        resolver: zodResolver(ProductUpdateSchema),
        defaultValues: {
            id: productId?.id || '',
            code: productId?.code || '',
            price: productId?.price || 0,
            size: productId?.size || '',
            description: productId?.description || '',
            name: productId?.name || '',
            isInProcessing: productId?.isInProcessing || false,
            addImagesRequest: initialImageRequests,
        },
    });

    const [imageUrls, setImageUrls] = useState<any>([]);
    const [nameImage, setNameImage] = useState<string[]>([]);
    const [imageAddRequests, setImageAddRequests] = useState<
        {
            imageUrl: string;
            isBluePrint: boolean;
            isMainImage: boolean
        }[]
    >([]);


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

    // Handle uploading new photos
    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const maxTotalSize = 2000000; // 2000 KB

        let currentTotalSize = files.reduce((total, file) => total + file.size, 0);

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

        setImageRequests(prevImageRequests => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageAddRequests((prevImageRequests: any) => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageUrls((prevImageRequests: any) => [
            ...prevImageRequests,
            ...newImageRequests.map((item) => item.file)
        ]);
        setNameImage((prevNameImage: any) => [
            ...prevNameImage,
            ...newImageRequests.map((item) => item.changedFileName)
        ]);
    };
    const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);


    // Handle deleting an image
    const handleDeleteImage = (index: number, imageID: string) => {
        if (imageID !== undefined) {
            setRemoveImageIds([...removeImageIds, imageID]);
        }

        setImageRequests((prevImageRequests) => {
            return prevImageRequests.filter((_, i) => i !== index);
        });
        setImageUrls((prevImageUrls: any) => prevImageUrls.filter((_: any, i: any) => i !== index));
    };
    console.log('removeImageIds', removeImageIds)


    // Handle toggling blueprint flag for an image
    const handleToggleBlueprint = (index: number) => {
        setImageRequests((prevImageRequests) =>
            prevImageRequests.map((req, i) =>
                i === index ? { ...req, isBluePrint: !req.isBluePrint } : req
            )
        );
    };

    // Handle toggling main image flag for an image
    const handleToggleMainImage = (index: number) => {
        setImageRequests((prevImageRequests) =>
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



    const [isSubmitting, setIsSubmitting] = useState(false);
    // Handle form submission
    const onSubmit = async (formData: z.infer<typeof ProductUpdateSchema>) => {
        if (isSubmitting) return; // Ngăn chặn việc submit nhiều lần
        setIsSubmitting(true);
        setLoading(true);
        try {
            await handlePostImage();

            const requestBody = {
                id: formData.id,
                code: formData.code,
                price: formData.price,
                size: formData.size,
                description: formData.description,
                name: formData.name,
                isInProcessing: formData.isInProcessing,
                addImagesRequest: imageAddRequests.map((image, index) => ({
                    imageUrl: nameImage[index],
                    isBluePrint: image.isBluePrint,
                    isMainImage: image.isMainImage,
                })),
                removeImageIds: removeImageIds === null ? removeImageIds : null,
            };
            console.log('============requestBody', requestBody);

            try {
                const response = await productApi.updateProduct(requestBody, formData.id);
                toast.success(response.data.message); // Assuming your API returns a message field in the response
                console.log('Update Successful:', response);
                setTimeout(() => {
                    setOpen1(false);
                    forceUpdate();
                    // window.location.href = '/dashboard/product';
                }, 2000);
            } catch (error:any) {
                if (error.response && error.response.data && error.response.data.message) {
                    // Xử lý lỗi từ server
                    toast.error(`Update error: ${error.response.data.message}`);
                } else if (error.request) {
                    // Xử lý lỗi khi không có phản hồi từ server
                    toast.error('No response from server while updating. Please try again later.');
                } else {
                    // Xử lý các lỗi khác
                    toast.error(`Unexpected error during update: ${error.message}`);
                }
                throw error; // Re-throw the error to stop further execution
            }

        } catch (error: any) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
            setIsSubmitting(false); // Reset trạng thái submit
        }
    };


    useEffect(() => {
    }, [removeImageIds])

    return (
        <Form {...form}>
            <Toaster />
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* Image upload/display section */}


                <div className="md:w-[60%] flex items-center justify-between relative">
                    <div>
                        {imageRequests.length < 1 && (
                            <div style={{ width: '100%', height: '100%' }}>
                                <input
                                    id="image"
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => handleUploadPhotos(e)}
                                    multiple
                                />
                                <label htmlFor='image' className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Upload size={100} className="text-white flex items-center justify-center bg-primary-backgroudPrimary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto" />
                                    <span className="text-l text-gray-500 font-medium">Hãy tải ảnh sản phẩm lên</span>
                                </label>
                            </div>
                        )}

                        {imageRequests.length > 0 && (
                            <div className="relative w-full h-full">
                                <ImageDisplay
                                    images={imageRequests}
                                    onDelete={handleDeleteImage}
                                    onToggleBlueprint={handleToggleBlueprint}
                                    onToggleMainImage={handleToggleMainImage}
                                />

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



                {/* Form input section */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[40%]">
                    <div className="w-full flex flex-col gap-4">
                        {/* Code */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Mã CODE</FormLabel>
                                    <Input type="text" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Giá sản phẩm</FormLabel>
                                    <Input type="number" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Size */}
                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Kích cỡ</FormLabel>
                                    <Input type="text" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Mô tả</FormLabel>
                                    <Textarea {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">Tên sản phẩm</FormLabel>
                                    <Input type="text" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* IsProse */}
                        <FormField
                            control={form.control}
                            name="isInProcessing"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary-backgroudPrimary">
                                        Trạng thái *
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                        value={field.value !== undefined ? String(field.value) : undefined}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Đang xử lý</SelectItem>
                                            <SelectItem value="false">Không xử lý</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
                        <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={isSubmitting}>
                            {isSubmitting ? 'Loading...' : 'GỬI'}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
};
