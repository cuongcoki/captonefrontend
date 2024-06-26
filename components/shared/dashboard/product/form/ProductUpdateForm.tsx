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

export const ProductUpdateForm: React.FC<ProductID> = ({ productId,setOpen1 }) => {
    const [loading, setLoading] = useState(false);
    const { forceUpdate } = useContext(MyContext);

    // Initialize image requests from productId if available
    const initialImageRequests = productId?.imageResponses.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        isBluePrint: image.isBluePrint,
        isMainImage: image.isMainImage,
    })) || [];

    const initialAddImageRequests = [
        {
            imageUrl: "", // Chỉ cần khởi tạo các trường cần thiết, nếu không có giá trị thực tế
            isBluePrint: false,
            isMainImage: false,
        },
    ];

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

    // State to manage image requests
    const [imageRequests, setImageRequests] = useState(initialImageRequests);
    const [idsImageDelete, setIdsImageDelete] = useState<string[]>([]);
  
    // Handle uploading new photos
    const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const maxTotalSize = 1200000; // 1200 KB

        let currentTotalSize = imageAddRequests.reduce((total, req: any) => total + req.file.size, 0);

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
            id: '',
            file: file,
            imageUrl: URL.createObjectURL(file),
            isBluePrint: false,
            isMainImage: false,
        }));

        setImageRequests(prevImageRequests => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageAddRequests(prevImageRequests => [
            ...prevImageRequests,
            ...newImageRequests
        ]);
        setImageUrls((prevImageRequests: any) => [
            ...prevImageRequests,
            ...newImageRequests.map((item) => item.file)
        ]);
    };
    const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);

    // const handleDeleteImage = (index:number,imageID: string) => {
    //     setRemoveImageIds([...removeImageIds, imageID]);
    //     setImageUrls((prevImageUrls: any) => prevImageUrls.filter((_: any, i: any) => i !== index));
    // };
    // Handle deleting an image
    const handleDeleteImage = (index:number,imageID: string) => {
        setRemoveImageIds([...removeImageIds, imageID]);
        setImageRequests((prevImageRequests) => {
            const imageToDelete = prevImageRequests[index];
            // Filter out the image at the specified index
            return prevImageRequests.filter((_, i) => i !== index);
        });
        setImageUrls((prevImageUrls: any) => prevImageUrls.filter((_: any, i: any) => i !== index));
    };
    console.log('removeImageIds',removeImageIds)
   
    // const handleDeleteProducts = (productID: string) => {
    //     setRemoveProductIds([...removeProductIds, productID]);
    //     const updatedProductsRequest = updateProducts.filter(
    //         (item) => item.productId !== productID
    //     );
    //     setUpdateProducts(updatedProductsRequest);
    //     const updateProUpdate = getDetailsProUpdate.filter(
    //         (item) => item.productId !== productID
    //     );
    //     setGetDetailsProUpdate(updateProUpdate);
    //     toast.success("Đã xóa sản phẩm khỏi danh sách");
    // };

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Handle form submission
    const onSubmit = async (formData: z.infer<typeof ProductUpdateSchema>) => {
        if (isSubmitting) return; // Ngăn chặn việc submit nhiều lần
        setIsSubmitting(true);
        setLoading(true);
        try {
            await handlePostImage();

            // Wait for `handelGetImage` to complete
            await handelGetImage();

            // Ensure `nameImage` has been updated
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
                removeImageIds: removeImageIds,
            };
            console.log('requestBody', requestBody);
     
                const response = await productApi.updateProduct(requestBody, formData.id);
                toast.success(response.data.message); // Assuming your API returns a message field in the response
                console.log('Update Successful:', response);
                setTimeout(() => {
                    setOpen1(false);
                    forceUpdate();
                    // window.location.href = '/dashboard/product';
                }, 2000);
              
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        } finally {
            setLoading(false);
            setIsSubmitting(false); // Reset trạng thái submit
        }
    };
    
   
    useEffect(() => {
    },[removeImageIds])

    return (
        <Form {...form}>
            <Toaster />
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* Image upload/display section */}
                <div className="md:w-[60%] flex items-center justify-between relative">
                    <div>
                        {/* Show upload input if no images */}
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

                        {/* Display images if there are any */}
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
