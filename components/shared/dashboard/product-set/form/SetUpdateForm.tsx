// ** import UI
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import * as Dialog from "@radix-ui/react-dialog";

// ** import ICON
import {
    Eye,
    ImageUp,
    Minus,
    PackagePlus,
    PencilLine,
    Trash2,
} from "lucide-react";
import { X } from "lucide-react";

// ** import REACT
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormStatus } from "react-dom";

import { SetUpdateSchema } from "@/schema/set";
import { setApi } from "@/apis/set.api";
import Image from "next/image";
import { filesApi } from "@/apis/files.api";
import toast from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import ImageDisplayDialog from "./imageDisplayDialog";

interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}

interface SetID {
    setId: string;
}

interface Product {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: ImageResponse[];
}

interface SetProduct {
    setId: string;
    productId: string;
    quantity: number;
    product: Product;
}



export const SetUpdateForm: React.FC<SetID> = ({ setId }) => {
    // console.log('setId',setId)
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };
    //state
    const [loading, setLoading] = useState<boolean>(false);
    const [setProductId, setProductSetId] = useState<any>([]);
    const [nameImage, setNameImage] = useState<any>("");
    const [imageRequests, setImageRequests] = useState<string>("");
    const [imageUrls, setImageUrls] = useState<File | null>(null);
    const [linkImg, setLinkImg] = useState<string>("");

    console.log("nameImage", nameImage);
    // ** các hàm để sử lý đăng ảnh

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
    // ** Xử lý khi người dùng tải lên 1 hình ảnh mới
    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setLoading(true);
        try {
            if (file) {
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
                setNameImage(changedFileName);
                if (!newFile) {
                    toast.error("No image selected");
                    return;
                }
                const formData = new FormData();
                formData.append("receivedFiles", newFile);

                await filesApi.postFiles(formData);

                const fileName = newFile.name;
                const { data } = await filesApi.getFile(fileName);
                const names = data.data;

                setImageRequests(names);
                toast.success("Image uploaded successfully");
            } else toast.error("No image selected");
        } catch (error) {
            console.error("Error uploading image", error);
            toast.error("Error uploading image");
        } finally {
            setLoading(false);
        }
    };

    // console.log('imageUrls', imageUrls)
    // console.log('imageRequests', imageRequests)

    // ** Xử lý khi người dùng xóa một hình ảnh đã có
    const handleDeleteImage = () => {
        setImageRequests("");
        setImageUrls(null);
    };

    useEffect(() => {
        const fetchDataProductId = async () => {
            setLoading(true);
            try {
                const res = await setApi.getSetId(setId);
                const userData = res.data.data;
                const productData = userData.setProducts;
                console.log('productData', productData)

                // Fetch image responses for each product in setProducts
                const updatedSetProducts: SetProduct[] = await Promise.all(productData.map(async (setProduct: any) => {
                    const productData: Product = setProduct.product;

                    // Fetch image response for the first image only
                    const firstImageResponse: ImageResponse = productData.imageResponses[0];

                    try {
                        // Fetch image response for the first image
                        const { data } = await filesApi.getFile(firstImageResponse.imageUrl);
                        const updatedFirstImageResponse: ImageResponse = {
                            ...firstImageResponse,
                            imageUrl: data.data // Assuming data.data is the updated image URL
                        };

                        // Update the product with updated first image response
                        const updatedProduct: Product = {
                            ...productData,
                            imageResponses: [updatedFirstImageResponse] // Replace with the updated first image response
                        };

                        return {
                            ...setProduct,
                            product: updatedProduct
                        };
                    } catch (error) {
                        console.error('Error getting file:', error);

                        // Handle error case if needed, return original setProduct
                        return setProduct;
                    }
                }));

                setGetDetailsProUpdate(updatedSetProducts);
                setProductSetId(userData);

                // Call filesApi.getFile using async/await
                const fileResponse = await filesApi.getFile(userData.imageUrl);
                const imageData = fileResponse.data.data;

                // Process imageData as needed, e.g., set state with image data
                setImageRequests(imageData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataProductId();
    }, [setId]);
    // console.log('setProductId', setProductId)

    // useForm hook for managing form state and validation
    const form = useForm({
        resolver: zodResolver(SetUpdateSchema),
        defaultValues: {
            code: "",
            description: "",
            name: "",
            imageUrl: "",
        },
    });

    useEffect(() => {
        if (setProductId) {
            form.reset({
                code: setProductId.code,
                description: setProductId.description,
                name: setProductId.name,
                imageUrl: setProductId.imageUrl,
            });
        }
    }, [setProductId, form]);

    // console.log('nameImage', nameImage)

    // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    // console.log('searchTerm', searchTerm)
    // console.log('searchResults', searchResults)

    const handleSearch = () => {
        setLoading(true);
        productApi
            .searchProduct(searchTerm)
            .then(({ data }) => {
                setSearchResults(data.data);
            })
            .catch((error) => {
                toast.error("không tìm thấy");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    // ** các hàm để thêm sản phẩm  và số lượng vào bộ sản phẩm

    // console.log('getDetailsProUpdate', getDetailsProUpdate)
    const [getDetailsPro, setGetDetailsPro] = useState<any[]>([]);
    const [productsRequest, setProductsRequest] = useState<
        {
            productId: string;
            quantity: number;
        }[]
    >([]);

    const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);
    const [addProducts, setAddProducts] = useState<
        { productId: string; quantity: number }[]
    >([]);
    const [updateProducts, setUpdateProducts] = useState<
        {
            productId: string;
            quantity: number;
        }[]
    >([]);

    // ** hàm update số lượng danh sách sản phẩm
    const handleChangeUpdate = (productId: string, newQuantity: number) => {
        const existingProductIndex = updateProducts.findIndex(
            (product) => product.productId === productId
        );

        let updatedProductsRequest;

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong danh sách, cập nhật số lượng
            updatedProductsRequest = updateProducts.map((product) => {
                if (product.productId === productId) {
                    return { ...product, quantity: newQuantity };
                }
                return product;
            });
        } else {
            // Nếu sản phẩm chưa tồn tại trong danh sách, thêm sản phẩm vào danh sách với số lượng mới
            updatedProductsRequest = [
                ...updateProducts,
                { productId, quantity: newQuantity },
            ];
        }

        setUpdateProducts(updatedProductsRequest);
    };

    // ** hàm thêm vào danh sách sản phẩm
    const handleAddProducts = (product: any) => {
        console.log("product", product);
        setSearchTerm("");

        // Kiểm tra xem sản phẩm đã có trong danh sách getDetailsPro chưa
        const existingDetailProduct = getDetailsPro.find(
            (item) => item.id === product.id
        );

        if (!existingDetailProduct) {
            // Nếu chưa có, thêm sản phẩm vào danh sách getDetailsPro
            const updatedDetailsPro = [...getDetailsPro, product];
            setGetDetailsPro(updatedDetailsPro);
        }

        // Kiểm tra xem sản phẩm đã có trong danh sách productsRequest chưa
        const existingProduct = productsRequest.find(
            (item) => item.productId === product.id
        );

        if (existingProduct) {
            // Nếu đã có, tăng số lượng lên 1
            const updatedProductsRequest = productsRequest.map((item) =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setProductsRequest(updatedProductsRequest);
        } else {
            // Nếu chưa có, thêm sản phẩm vào danh sách với số lượng là 1
            setProductsRequest([
                ...productsRequest,
                { productId: product.id, quantity: 1 },
            ]);
        }
    };

    // ** hàm xóa khỏi danh sách sản phẩm

    const [removeProductIds, setRemoveProductIds] = useState<string[]>([]);

    const handleDeleteProducts = (productID: string) => {
        setRemoveProductIds([...removeProductIds, productID]);
        const updatedProductsRequest = updateProducts.filter(
            (item) => item.productId !== productID
        );
        setUpdateProducts(updatedProductsRequest);
        const updateProUpdate = getDetailsProUpdate.filter(
            (item) => item.productId !== productID
        );
        setGetDetailsProUpdate(updateProUpdate);
        toast.success("Đã xóa sản phẩm khỏi danh sách");
    };

    const handleMinusProducts = (productId: string) => {
        const updatedDetailsPro = getDetailsPro.filter(
            (product) => product.id !== productId
        );
        setGetDetailsPro(updatedDetailsPro);

        // Lọc sản phẩm cần xóa khỏi productsRequest
        const updatedProductsRequest = productsRequest.filter(
            (product) => product.productId !== productId
        );
        setProductsRequest(updatedProductsRequest);

        // Nếu sản phẩm có trong danh sách updateProducts, loại bỏ nó
        const updatedUpdateProducts = updateProducts.filter(
            (product) => product.productId !== productId
        );
        setUpdateProducts(updatedUpdateProducts);

        toast.success("Đã xóa sản phẩm khỏi danh sách");
    };

    // ** hàm thay đổi số lượng khỏi danh sách sản phẩm
    const handleChange = (productId: string, newQuantity: number) => {
        const existingProductIndex = productsRequest.findIndex(
            (product) => product.productId === productId
        );

        let updatedProductsRequest;

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong danh sách, cập nhật số lượng
            updatedProductsRequest = productsRequest.map((product) => {
                if (product.productId === productId) {
                    return { ...product, quantity: newQuantity };
                }
                return product;
            });
        } else {
            // Nếu sản phẩm chưa tồn tại trong danh sách, thêm sản phẩm vào danh sách với số lượng mới
            updatedProductsRequest = [
                ...productsRequest,
                { productId, quantity: newQuantity },
            ];
        }

        setProductsRequest(updatedProductsRequest);
    };


    console.log("productsRequest", productsRequest);
    console.log("removeProductIds", removeProductIds);
    console.log("updateProducts", updateProducts);

    const onSubmit = async (data: z.infer<typeof SetUpdateSchema>) => {
        // Ensure `nameImage` has been updated
        const requestBody = {
            setId: setProductId.id,
            code: data.code,
            description: data.description,
            name: data.name,
            imageUrl: nameImage === "" ? data.imageUrl : nameImage,
            add: productsRequest,
            update: updateProducts,
            removeProductIds: removeProductIds,
        };
    
        try {
            console.log("requestBody", requestBody);
            const response = await setApi.updateSet(requestBody, setProductId.id);
            console.log("Update Successful:", response);
            
            // Display success message and redirect after 2 seconds
            toast.success(response.data.message);
            setTimeout(() => {
                // window.location.href = "/dashboard/set";
            }, 2000);
        } catch (error) {
            console.error("Error updating set:", error);
            toast.error("Failed to update set. Please try again.");
        }
    };

    useEffect(() => {
    }, [onSubmit])

    console.log('getDetailsProUpdate', getDetailsProUpdate)
    const { pending } = useFormStatus();
    return (
        <Dialog.Root open={open} onOpenChange={handleOnDialog}>
            <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                <PencilLine onClick={handleOnDialog} />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                    <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[900px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
                        <div className="bg-slate-100  flex flex-col overflow-y-auto">
                            <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary  rounded-t-md">
                                <h2 className="text-2xl text-white">Chỉnh sửa bộ sản phẩm</h2>
                                <Button variant="outline" size="icon">
                                    <X className="w-4 h-4" onClick={handleOffDialog} />
                                </Button>
                            </div>
                            <div className="grid gap-4 p-4">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Chi tiết bộ sản phẩm
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col gap-5">
                                                        <FormField
                                                            control={form.control}
                                                            name="code"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                                                        Mã CODE
                                                                    </FormLabel>
                                                                    <Input type="text" {...field} />
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                                                        Mô tả
                                                                    </FormLabel>
                                                                    <Textarea {...field} />
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="name"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                                                        Tên sản phẩm
                                                                    </FormLabel>
                                                                    <Input type="text" {...field} />
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                                <Card
                                                    className="overflow-hidden"
                                                    x-chunk="dashboard-07-chunk-4"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Ảnh đặt sản phẩm
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid gap-2">
                                                            <Image
                                                                alt="Product image"
                                                                className="aspect-square w-full rounded-md object-contain"
                                                                height={900}
                                                                src={imageRequests}
                                                                width={900}
                                                            />
                                                        </div>

                                                        <div className="flex gap-4 justify-center items-center p-4">
                                                            <Trash2
                                                                className="h-6 w-6 text-red-600"
                                                                onClick={handleDeleteImage}
                                                            />
                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                <input
                                                                    id="image"
                                                                    type="file"
                                                                    style={{ display: "none" }}
                                                                    accept="image/*"
                                                                    onChange={(e) => handleUploadPhoto(e)}
                                                                />
                                                                <label htmlFor="image">
                                                                    <ImageUp className="h-6 w-6" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            Chi tiết sản phẩm trong bộ
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center my-4">
                                                            <Input
                                                                placeholder="Mã code, tên sản phẩm ..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className=""
                                                            />
                                                        </div>
                                                        {searchResults !== null ? (
                                                            <Card className="my-4">
                                                                <CardHeader className="font-semibold text-xl">
                                                                    <span>Thông tin sản phẩm</span>
                                                                </CardHeader>
                                                                <CardContent className="overflow-y-auto">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead className="w-[100px]">
                                                                                    Ảnh
                                                                                </TableHead>
                                                                                <TableHead>Tên</TableHead>
                                                                                <TableHead>Mã Code</TableHead>
                                                                                <TableHead className="text-right">
                                                                                    Thêm
                                                                                </TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {searchResults !== null ? (
                                                                                searchResults.map((product) => (
                                                                                    <TableRow key={product.id}>
                                                                                        <TableCell className="font-medium">
                                                                                            <ImageDisplayDialog
                                                                                                images={product?.imageUrl}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            {product?.name}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            {product?.code}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                size="icon"
                                                                                                onClick={() =>
                                                                                                    handleAddProducts(product)
                                                                                                }
                                                                                            >
                                                                                                <PackagePlus className="h-4 w-4" />
                                                                                            </Button>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))
                                                                            ) : (
                                                                                <TableRow className="text-center flex justify-center items-center w-full">
                                                                                    không thấy sản phẩm nào
                                                                                </TableRow>
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </CardContent>
                                                            </Card>
                                                        ) : (
                                                            ""
                                                        )}

                                                        <div className="md:col-span-1  md:mt-0">
                                                            <Card>
                                                                <CardHeader className="font-semibold text-xl">
                                                                    <span>Thông tin sản phẩm hiện tại</span>
                                                                </CardHeader>
                                                                <CardContent className="overflow-auto">
                                                                    {getDetailsProUpdate.map((product, index) => (
                                                                        <div
                                                                            className="flex justify-between items-center py-4"
                                                                            key={index}
                                                                        >
                                                                            <div className="flex  gap-4">
                                                                                {product.product.imageResponses.length > 0 && (
                                                                                    <Image
                                                                                        src={product.product.imageResponses[0].imageUrl} // Lấy ảnh đầu tiên từ mảng imageResponses
                                                                                        alt="Ảnh mẫu"
                                                                                        className="w-[100px] h-[100px] object-cover"
                                                                                        width={900}
                                                                                        height={900}
                                                                                    />
                                                                                )}
                                                                                <div className="font-medium dark:text-white">
                                                                                    <div>
                                                                                        <b>Tên: </b>
                                                                                        {product?.product.name}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                        <b>Code: </b>
                                                                                        {product?.product.code}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                        <i>{product?.product.description}</i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>


                                                                            <input
                                                                                type="number"
                                                                                defaultValue={product.quantity || 0}
                                                                                onChange={(e) =>
                                                                                    handleChangeUpdate(
                                                                                        product.productId,
                                                                                        parseInt(e.target.value)
                                                                                    )
                                                                                }
                                                                                className="w-16 text-center outline-none"
                                                                            />


                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                onClick={() =>
                                                                                    handleDeleteProducts(
                                                                                        product.productId
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Minus className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </CardContent>
                                                            </Card>
                                                            <Card className="mt-4">
                                                                <CardHeader className="font-semibold text-xl">
                                                                    <span>Thông tin sản phẩm đã thêm</span>
                                                                </CardHeader>
                                                                <CardContent className="overflow-auto">
                                                                    {getDetailsPro.map((product, index) => (
                                                                        <div
                                                                            className="flex justify-between items-center py-4"
                                                                            key={index}
                                                                        >
                                                                            <div className="flex  gap-4">
                                                                                {/* <Image
                                                                                    alt="ảnh mẫu"
                                                                                    className="w-[100px] h-[100px] object-cover"
                                                                                    width={900}
                                                                                    height={900}
                                                                                    src={
                                                                                        product?.imageResponses[0].imageUrl
                                                                                    }
                                                                                /> */}


                                                                                <div className="font-medium dark:text-white">
                                                                                    <div>
                                                                                        <b>Tên: </b>
                                                                                        {product.name}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                        <b>Code: </b>
                                                                                        {product.code}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                        <i>{product.description}</i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <input
                                                                                type="number"
                                                                                value={
                                                                                    productsRequest.find(
                                                                                        (item) =>
                                                                                            item.productId === product.id
                                                                                    )?.quantity || 0
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleChange(
                                                                                        product.id,
                                                                                        parseInt(e.target.value)
                                                                                    )
                                                                                }
                                                                                className="w-16 text-center outline-none"
                                                                            />
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                onClick={() =>
                                                                                    handleMinusProducts(product.id)
                                                                                }
                                                                            >
                                                                                <Minus className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>

                                        <Card>
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
                                                disabled={pending}
                                            >
                                                {pending ? "Loading..." : "GỬI"}
                                            </Button>
                                        </Card>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
