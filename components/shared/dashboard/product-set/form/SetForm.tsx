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
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { CardHeader, CardTitle, CardFooter, Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { SetSchema } from "@/schema/set";

import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";
import { Minus, PackagePlus, Phone, Upload, icons } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast, { Toaster } from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import { error } from "console";
import ImageDisplayDialog from "./imageDisplayDialog";
import Image from "next/image";
import { Facebook, Youtube } from "lucide-react";
import { filesApi } from "@/apis/files.api";
import { setApi } from "@/apis/set.api";


interface SetFormProps {
    setOpen: (open: boolean) => void;
}

export const SetForm: React.FC<SetFormProps> = ({ setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [imageRequests, setImageRequests] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<File | null>(null);
    const [nameImage, setNameImage] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(SetSchema),
        defaultValues: {
            code: "",
            description: "",
            name: "",
        },
    });
    // ** các hàm để sử lý đăng ảnh


    // ** Xử lý khi người dùng tải lên hình ảnh mới
    const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const newImageRequest = URL.createObjectURL(file);
            setImageRequests(newImageRequest);
            setImageUrls(file);
        }
    };

    // ** Xử lý khi người dùng xóa một hình ảnh đã có
    const handleDeleteImage = () => {
        setImageRequests(null);
        setImageUrls(null);
    };
    // ** Xử lý khi đăng ảnh
    const handlePostImage = async () => {
        if (!imageUrls) {
            console.error('No image selected');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('receivedFiles', imageUrls); // Đảm bảo rằng tên trường tương ứng với server và chỉ đăng một ảnh

        try {
            const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
            // console.log('Upload successful:', response.data);
            // Xử lý các hành động sau khi tải lên thành công
            const fileName = imageUrls.name; // Lấy tên tệp của ảnh đầu tiên
            const { data } = await filesApi.getFile(fileName);

            // Assuming data.data contains the image name
            const names = data.data;
            setNameImage(names);
        } catch (error) {
            console.error('Error uploading files:', error);
            // Xử lý lỗi khi tải lên không thành công
        } finally {
            setLoading(false);
        }
    };

    // ** Xử lý khi đăng ảnh xong và lấy ảnh về
    const handleGetImage = async () => {
        if (!imageUrls) {
            console.error('No image selected');
            return;
        }

        setLoading(true);
        try {
            const fileName = imageUrls.name; // Lấy tên tệp của ảnh đầu tiên
            const { data } = await filesApi.getFile(fileName);

            // Assuming data.data contains the image name
            const names = data.data;
            setNameImage(names);
            console.log('Processed image names:', names);
        } catch (error) {
            console.error('Error getting image names:', error);
        } finally {
            setLoading(false);
        }
    };

    // console.log('imageRequests', imageRequests)
    // console.log('imageUrls', imageUrls)

    // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    // console.log('searchTerm', searchTerm)
    // console.log('searchResults', searchResults)

    const handleSearch = () => {
        setLoading(true)
        productApi.searchProduct(searchTerm)
            .then(({ data }) => {
                setSearchResults(data.data);
            })
            .catch(error => {
                toast.error('không tìm thấy')
            })
            .finally(() => {
                setLoading(false);
            })
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm])

    // ** các hàm để thêm sản phẩm  và số lượng vào bộ sản phẩm 
    const [getIdsProduct, setGetIdsProduct] = useState<any[]>([]);
    const [getDetailsPro, setGetDetailsPro] = useState<any[]>([]);
    const [productsRequest, setProductsRequest] = useState<
        {
            productId: string;
            quantity: number;
        }[]
    >([]);
    // ** hàm thêm vào danh sách sản phẩm
    const handleAddProducts = (product: any) => {

        if (getIdsProduct.includes(product.id)) {
            toast.error('Sản phẩm đã được thêm vào');
            return; // Nếu sản phẩm đã có trong mảng IDs, dừng hàm ở đây
        }

        const updatedIds = [...getIdsProduct, product.id];
        const updatedDetailsPro = [...getDetailsPro, product];

        setGetIdsProduct(updatedIds);
        setGetDetailsPro(updatedDetailsPro);
    };
    // ** hàm xóa khỏi danh sách sản phẩm
    const handleMinusProducts = (productId: string) => {
        // Xóa sản phẩm khỏi danh sách getDetailsPro và getIdsProduct
        const updatedDetailsPro = getDetailsPro.filter(product => product.id !== productId);
        const updatedIds = getIdsProduct.filter(id => id !== productId);

        // Cập nhật state mới
        setGetDetailsPro(updatedDetailsPro);
        setGetIdsProduct(updatedIds);

        // Hiển thị thông báo hoặc thực hiện các thao tác cần thiết sau khi xóa
        toast.success('Đã xóa sản phẩm khỏi danh sách');
    };
    // ** hàm thay đổi số lượng khỏi danh sách sản phẩm
    const handleChange = (productId: string, newQuantity: number) => {
        const updatedProductsRequest = productsRequest.map(product => {
            if (product.productId === productId) {
                return { ...product, quantity: newQuantity };
            }
            return product;
        });

        setProductsRequest(updatedProductsRequest);
    };
    // ** hàm khởi tạo giá chị cho Sản Phầm là id và quastity
    useEffect(() => {
        if (getIdsProduct && getIdsProduct.length > 0) {
            const initialProductsRequest = getIdsProduct.map(id => ({
                productId: id,
                quantity: 0 // Khởi tạo quantity theo nhu cầu của bạn
            }));
            setProductsRequest(initialProductsRequest);
        } else {
            // Nếu getIdsProduct rỗng, đảm bảo setProductsRequest([]) để xóa hết sản phẩm
            setProductsRequest([]);
        }
    }, [getIdsProduct]);


    // Xử lý khi người dùng gửi form
    const onSubmit = async (data: z.infer<typeof SetSchema>) => {
        setLoading(true);
        // console.log('Submitted data:', data);

        try {
            await handlePostImage();
            await handleGetImage();


            if (nameImage) {
                // Thực hiện các hành động khi nameImage có giá trị
                const requestBody = {
                    code: data.code,
                    description: data.description,
                    name: data.name,
                    imageUrl: nameImage,
                    setProductsRequest: productsRequest
                };
                console.log('requestBody', requestBody);
                const response = await setApi.createSet(requestBody);
                if (response.data.isSuccess) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        setOpen(false);
                        toast.error(response.data.message);
                        // window.location.href = '/dashboard/product';
                    }, 2000);
                } else {
                    toast.error(response.data.message);
                }
                // Xử lý response
            } else {
                // Xử lý khi nameImage không có giá trị
                toast.error('imageUrl (nameImage) is not valid');
            }

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

            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {/* Phần đăng hình ảnh */}
                <div className=" w-full col-span-2 relative">
                    <div>
                        {/* nếu không có ảnh nào thì hiện input này */}
                        {imageRequests === null && (
                            <div style={{ width: '100%', height: '100%' }}>
                                <input
                                    id='image'
                                    type='file'
                                    style={{ display: 'none' }}
                                    accept='image/*'
                                    onChange={e => handleUploadPhoto(e)}

                                />
                                <label htmlFor='image' className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Upload size={100} className="text-white flex items-center justify-center bg-primary-backgroudPrimary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto" />
                                    <span className="text-l text-gray-500 font-medium">Hãy tải ảnh sản phẩm lên</span>
                                </label>
                            </div>
                        )}

                        {/* nếu có trên 1 ảnh thì hiện input này */}
                        {imageRequests !== null && (
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
                
                <div className="w-full flex flex-col gap-4 ">
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        {/* Phần nhập dữ liệu thông tin */}
                        <div className="w-full flex flex-col gap-4 ">
                            {/* code */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center text-primary-backgroudPrimary ">Mã CODE</FormLabel>
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
                                        <FormLabel className="flex items-center text-primary-backgroudPrimary">Tên Bộ sản phẩm</FormLabel>
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

                    {/* setProductsRequest */}
                    <div>

                        <Dialog >
                            <DialogTrigger>
                                <Button variant={"colorCompany"} className="text-xs">
                                    Thêm sản phầm mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-full h-full">
                                <Tabs defaultValue="account" className="p-6 ">
                                    <TabsList className="grid w-full grid-cols-2 md:w-[500px]">
                                        <TabsTrigger value="account">Thêm sản phẩm</TabsTrigger>
                                        <TabsTrigger value="password">Thêm số  lượng</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="account">
                                        <Card>
                                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                <div className="md:col-span-1">
                                                    <Input
                                                        placeholder="Mã code, tên sản phẩm ..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="mb-6"
                                                    />
                                                    <Card>
                                                        <CardHeader className="font-semibold text-xl">
                                                            <span>Thông tin sản phẩm</span>
                                                        </CardHeader>
                                                        <CardContent className="overflow-y-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-[100px]">Ảnh</TableHead>
                                                                        <TableHead>Tên</TableHead>
                                                                        <TableHead>Mã Code</TableHead>
                                                                        <TableHead className="text-right">Mô tả</TableHead>
                                                                        <TableHead className="text-right">Thêm</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {
                                                                        searchResults !== null ? (
                                                                            searchResults.map((product) => (
                                                                                <TableRow key={product.id}>
                                                                                    <TableCell className="font-medium"><ImageDisplayDialog images={product?.imageResponses} /></TableCell>
                                                                                    <TableCell>{product?.name}</TableCell>
                                                                                    <TableCell>{product?.code}</TableCell>
                                                                                    <TableCell className="text-right">{product?.description}</TableCell>
                                                                                    <TableCell>
                                                                                        <Button variant="outline" size="icon" onClick={() => handleAddProducts(product)}>
                                                                                            <PackagePlus className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow className="text-center flex justify-center items-center w-full">
                                                                                không thấy sản phẩm nào
                                                                            </TableRow>
                                                                        )
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                <div className="md:col-span-1  md:mt-0">
                                                    <Card>
                                                        <CardHeader className="font-semibold text-xl">
                                                            <span>Thông tin sản phẩm đã thêm</span>
                                                        </CardHeader>
                                                        <CardContent className="overflow-auto">
                                                            {getDetailsPro.map((product, index) => (
                                                                <div className="flex justify-between items-center py-4" key={index}>

                                                                    <div className="flex  gap-4">
                                                                        <Image alt="ảnh mẫu" className="w-[100px] h-[100px] object-cover" width={900} height={900} src={product?.imageResponses[0].imageUrl} />
                                                                        <div className="font-medium dark:text-white">
                                                                            <div><b>Tên: </b>{product.name}</div>
                                                                            <div className="text-sm text-gray-500 dark:text-gray-400"><b>Code: </b>{product.code}</div>
                                                                            <div className="text-sm text-gray-500 dark:text-gray-400"><i>{product.description}</i></div>
                                                                        </div>
                                                                    </div>
                                                                    <Button variant="outline" size="icon" onClick={() => handleMinusProducts(product.id)}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="password" className=" w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                        <Card>
                                            <CardHeader className="font-semibold text-xl">
                                                <span>Thông tin sản phẩm đã thêm</span>
                                            </CardHeader>
                                            <CardContent className="overflow-auto">
                                                {getDetailsPro.map((product, index) => (
                                                    <div className="flex flex-col md:flex-row py-4 justify-between " key={index}>
                                                        <div className="flex gap-4">
                                                            <Image
                                                                alt="ảnh mẫu"
                                                                className="w-[100px] h-[100px] object-cover"
                                                                width={100}
                                                                height={100}
                                                                src={product?.imageResponses[0]?.imageUrl}
                                                            />
                                                            <div className="font-medium dark:text-white">
                                                                <div>
                                                                    <b>Tên: </b>{product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    <b>Code: </b>{product.code}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    <i>{product.description}</i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 md:mt-0 md:ml-4 border border-gray-200 px-3 py-2 rounded-md text-center">
                                                            <span>Hãy nhập số lượng :</span>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    productsRequest.find(item => item.productId === product.id)?.quantity || 0
                                                                }
                                                                onChange={(e) => handleChange(product.id, parseInt(e.target.value))}
                                                                className="w-16 text-center outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                        <div className=" hidden md:flex relative bg-primary-backgroudPrimary  items-center justify-center h-screen rounded-md">
                                            <div className="text-center p-8 max-w-md mx-auto">
                                                <h1 className="text-2xl font-bold mb-4">Ảnh công ty</h1>
                                                <p className="text-xl  uppercase mt-5 mb-4 text-white">Cảm ơn bạn đã sử dụng và tin tưởng hàng của chúng tôi</p>

                                                <p className="mb-4 text-white">Nếu có vấn đề gì hãy liên hệ với chúng tôi !!!</p>
                                                <div className="mt-6 space-x-4 text-primary-backgroudPrimary">
                                                    <Button variant={"outline"} size="icon"><Facebook className="h-4 w-4" /></Button>
                                                    <Button variant={"outline"} size="icon"><Phone className="h-4 w-4" /></Button>
                                                </div>
                                                <p className="absolute left-0 bottom-0  w-full text-center py-4 text-white">
                                                    <span>Công Ty Gia Đình</span> <a href="/" className="text-white" target="_blank" rel="noopener noreferrer">Tiến Huy</a>
                                                    <p className="mb-4">[Mây tre đan Tiến Huy, sản phẩm thoáng mát và rẻ]</p>
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </Form>
    );
}

