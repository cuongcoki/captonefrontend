"use client"
// ** import UI
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

// ** import Components
import { NoImage } from "@/constants/images"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, CirclePlus, CircleX, MoreVertical, Plus, Truck, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { shipmentApi } from "@/apis/shipment.api"
import { format, parse, parseISO } from 'date-fns';
import Link from "next/link"
import { companyApi } from "@/apis/company.api"
import { userApi } from "@/apis/user.api"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShipmentSchema } from "@/schema/shipment"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { productApi } from "@/apis/product.api"
import { filesApi } from "@/apis/files.api"
import ImageIconShipmentForm from "./ImageIconShipmentForm"
import { phaseApi } from "@/apis/phase.api"
import { materialApi } from "@/apis/material.api";

const enumCompany = [
    {
        description: "Nhà xưởng",
        id: 0,
        value: "0"
    },
    {
        description: "Công ty mua đặt hàng",
        id: 1,
        value: "1"
    },
    {
        description: "Công ty hợp tác sản xuất",
        id: 2,
        value: "2"
    },

];



const ProductPhaseType = [
    {
        id: 0,
        des: "Sản phẩm bình thường",
    },
    {
        id: 1,
        des: "Sản phẩm lỗi do bên cơ sở",
    },
    {
        id: 2,
        des: "Sản phẩm lỗi do bên thứ 3",
    },
    {
        id: 3,
        des: "Sản phẩm lỗi k sửa đc nữa",
    },
]

type Company = {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyType: any;
    companyTypeDescription: string;
};

export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    roleId: number;
    isActive: boolean;
    companyId: string;
    avatar: string;
    companyName: string;
};

export type Product = {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: Array<{
        id: string;
        imageUrl: string;
        isBluePrint: boolean;
        isMainImage: boolean;
    }>;
};

export type ShipmentDetailRequest = {
    itemId: string;
    phaseId: string;
    quantity: number;
    kindOfShip: number;
    productPhaseType: number;
};

export type Shipment = {
    fromId: string;
    toId: string;
    shipperId: string;
    shipDate: string;
    shipmentDetailRequests: ShipmentDetailRequest[];
};

export type Phase = {
    id: string;
    name: string;
    description: string;
};

export type PhasesResponse = {
    data: Phase[];
};
interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}
export type Material = {
    id: string
    name: string;
    description: string;
    unit: string;
    quantityPerUnit: number;
    image: string;
    quantityInStock: number;
}

export default function CreateShipment() {
    //state 
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    //state ** company
    const [company, setCompany] = useState<Company[]>([]);
    const [companyType, setCompanyType] = useState<number>(0);
    const [company1, setCompany1] = useState<Company[]>([]);
    const [companyType1, setCompanyType1] = useState<number>(0);

    // ** state user
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(11);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [roleId, setRoleId] = useState<number>(4);
    const [searchTearm, setSearchTearm] = useState<string>("");
    const [dataEm, setDataEm] = useState<Employee[]>([]);

    // ** state phase
    const [dataPh, setDataPh] = useState<Phase[]>([]);

    // ** state product
    const [currentPageP, setCurrentPageP] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [totalPagesP, setTotalPagesP] = useState<number>(1);
    const [pageSizeP, setPageSizeP] = useState<number>(20);
    const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
    const [dataP, setDataP] = useState<Product[]>([]);

    // ** state material
    const [currentPageM, setCurrentPageM] = useState<number>(1);
    const [searchTermM, setSearchTermM] = useState<string>("");
    const [totalPagesM, setTotalPagesM] = useState<number>(1);
    const [pageSizeM, setPageSizeM] = useState<number>(20);
    const [isInProcessingM, setIsInProcessingM] = useState<boolean>(true);
    const [dataM, setDataM] = useState<Material[]>([]);
    console.log("dataM", dataM);
    // ** state Shipment
    const [shipmentDetailRequests, setShipmentDetailRequests] = useState<ShipmentDetailRequest[]>([]);
    const [productDetail, setProductDetail] = useState<any[]>([]);
    // Hàm thêm sản phẩm
    const handleAddProducts = (imgProducts: string, itemId: string, itemKind: number) => {
        console.log("mainImage", imgProducts)
        // check id
        const itemExists = shipmentDetailRequests.some((item) => item.itemId === itemId);
        if (itemExists) {
            toast.error("sản phẩm này đã thêm");
            return;
        }
        setShipmentDetailRequests((prev: any) => [
            ...prev,
            { itemId: itemId, phaseId: "", quantity: 1, kindOfShip: itemKind, productPhaseType: 0 }
        ]);
        setProductDetail((prev) => [
            ...prev,
            { itemId: itemId, imgProducts, phaseId: "", quantity: 1, kindOfShip: itemKind, productPhaseType: 0 }
        ]);
    };

    // Hàm xóa sản phẩm
    const handleDeleteProducts = (itemId: string) => {
        setShipmentDetailRequests((prev) =>
            prev.filter((item) => item.itemId !== itemId)
        );
        setProductDetail((prev) =>
            prev.filter((product) => product.itemId !== itemId)
        );
    };

    // Hàm thay đổi giá trị của một sản phẩm
    const handleChange = (itemId: string, name: keyof ShipmentDetailRequest, value: any) => {
        setShipmentDetailRequests((prev) =>
            prev.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, [name]: value };
                }
                return item;
            })
        );
    };

    // Hàm xóa tất cả giá trị sản phẩm đã chọn
    const handleClear = () => {
        setShipmentDetailRequests([]);
        setProductDetail([])
    }

    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    const handleStatusChange = (value: number) => {
        setCompanyType(value);
    };

    const handleStatusChange1 = (value: number) => {
        setCompanyType1(value);
    };
    //call data material
    useEffect(() => {
        const fetchDataMaterial = async () => {
            setLoading(true);
            try {
                const response = await productApi.allMaterial(
                    currentPageM,
                    pageSizeM,
                    searchTermM
                );
                const newData = response.data.data.data;

                // Update imageUrl with links fetched from filesApi
                const updatedData = await Promise.all(
                    newData.map(async (item: any) => {
                        if (item.image) {
                            try {
                                const { data } = await filesApi.getFile(item.image);
                                return {
                                    ...item,
                                    image: data.data,
                                };
                            } catch (error) {
                                console.error("Error getting file:", error);
                                return {
                                    ...item,
                                    image: "", // Xử lý trường hợp lỗi nếu cần thiết
                                };
                            }
                        }
                        return item;
                    })
                );


                setDataM(updatedData);
                setCurrentPageM(response.data.data.currentPage);
                setTotalPagesM(response.data.data.totalPages);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setDataM([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDataMaterial();
    }, [currentPageM, pageSizeM, searchTermM]);

    // call data phase
    useEffect(() => {
        const fetchDataPhase = () => {
            phaseApi.getAllPhase()
                .then(({ data }) => {
                    setDataPh(data.data);
                })
        }
        fetchDataPhase();
    }, [dataPh])

    // call data company
    useEffect(() => {
        const fetchDataCompany = () => {
            companyApi.getCompanyByType(companyType)
                .then(({ data }) => {
                    setCompany(data.data);
                })
        }
        const fetchDataCompany1 = () => {
            companyApi.getCompanyByType(companyType1)
                .then(({ data }) => {
                    setCompany1(data.data);
                })
        }
        fetchDataCompany1();
        fetchDataCompany()
    }, [company, companyType, company1, companyType1]);

    // call data employyee
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await userApi.allUsers(
                    roleId,
                    searchTearm,
                    isActive,
                    currentPage,
                    pageSize
                );
                setDataEm(res.data.data.data);
                setCurrentPage(res.data.data.currentPage);
                setTotalPages(res.data.data.totalPages);
                console.log("Response:", res);
            } catch (error: any) {
                console.error("Error fetching user data:");
                if (error?.response.data.status === 400) {
                    // toast.error(error?.response.data.message);
                    setDataEm([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isActive, roleId, searchTearm, currentPage, pageSize, dataEm]);

    // call data product
    useEffect(() => {
        const fetchDataProduct = async () => {
            setLoading(true);
            try {
                const response = await productApi.allProducts(
                    isInProcessing,
                    currentPageP,
                    pageSizeP,
                    searchTerm
                );
                const newData = response.data.data.data;

                // Update imageUrl with links fetched from filesApi
                const updatedData = await Promise.all(
                    newData.map(async (item: any) => {
                        const updatedImageResponses = await Promise.all(
                            item.imageResponses.map(async (image: any) => {
                                try {
                                    const { data } = await filesApi.getFile(image.imageUrl);
                                    return {
                                        ...image,
                                        imageUrl: data.data,
                                    };
                                } catch (error) {
                                    console.error("Error getting file:", error);
                                    return {
                                        ...image,
                                        imageUrl: "", // Handle error case if needed
                                    };
                                }
                            })
                        );
                        return {
                            ...item,
                            imageResponses: updatedImageResponses,
                        };
                    })
                );

                setDataP(updatedData);
                setCurrentPageP(response.data.data.currentPage);
                setTotalPagesP(response.data.data.totalPages);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setDataP([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDataProduct();
    }, [currentPageP, pageSizeP, searchTerm, isInProcessing]);
    // ** form
    const form = useForm({
        resolver: zodResolver(ShipmentSchema),
        defaultValues: {
            fromId: "",
            toId: "",
            shipperId: "",
            shipDate: "",
        },
    });
    // call gủi form
    const onSubmit = (data: z.infer<typeof ShipmentSchema>) => {
        console.log('data', data)

        // check data shipmentDetailRequests
        // Kiểm tra dữ liệu của shipmentDetailRequests
        if (shipmentDetailRequests.length === 0) {
            console.error("Không tìm thấy yêu cầu chi tiết lô hàng");
            return;
        }
        let hasError = false;
        shipmentDetailRequests.forEach((request, index) => {
            if (!request.itemId) {
                console.error(`Chi tiết lô hàng không hợp lệ tại chỉ mục ${index}:`, request);
                toast.custom((t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Lỗi
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        ID không tồn tại
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                ));
                hasError = true;
            } else if (!request.phaseId) {
                console.error(`Chi tiết lô hàng không hợp lệ tại chỉ mục ${index}:`, request);
                toast.custom((t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Lỗi
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Hãy chọn giai đoạn
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                ));
                hasError = true;
            } else if (request.quantity <= 0) {
                console.error(`Chi tiết lô hàng không hợp lệ tại chỉ mục ${index}:`, request);
                toast.custom((t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Lỗi
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Số lượng không thể bé hơn 0
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                ));
                hasError = true;
            }
        });

        if (hasError) {
            return;
        }


        // Gọi hàm kiểm tra
        const requestBody = {
            fromId: data.fromId,
            toId: data.toId,
            shipperId: data.shipperId,
            shipDate: data.shipDate,
            shipmentDetailRequests: shipmentDetailRequests
        };

        console.log("requestBodyCreateShipment=====", requestBody);
        setLoading(true)
        shipmentApi.createShipment(requestBody)
            .then(({ data }) => {
                console.log("data", data)
                if (data.isSuccess) {
                    toast.success(data.message);
                }
            })
            .catch(error => {
                const errorResponse = error.response?.data?.error;
                if (errorResponse?.ShipmentDetailRequests) {
                    toast.error(errorResponse.ShipmentDetailRequests);
                } else {
                    toast.error(error.response?.data?.message);
                }
                if (errorResponse?.ToId) {
                    toast.error(errorResponse.ToId);
                }
            })
            .finally(() => {
                setLoading(false)
            })


    };

    const limitLength = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };
    const productType = 0;
    const materialType = 1;
    //consolo.log
    // console.log("dataP", dataP)
    console.log("shipmentDetailRequests", shipmentDetailRequests)

    return (
        <>
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
                    <Plus />
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[800px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4">
                                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                                    <h2 className="text-2xl text-white">Đơn vận chuyển chi tiết</h2>
                                    <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4">
                                    <div className="w-full">
                                        <Tabs defaultValue="account" >
                                            <TabsList className="grid w-[200px] grid-cols-2">
                                                <TabsTrigger value="account">Sản phẩm</TabsTrigger>
                                                <TabsTrigger value="password">Vật liệu</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="account">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Sản phẩm</CardTitle>
                                                        <CardDescription>
                                                            {/* <Input type="number"  onChange={(e) => setPageSizeP(Number(e.target.value))} /> */}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <div className=" w-full grid grid-cols-4 md:grid-cols-6 gap-4 h-[150px]  md:min-h-[100px] overflow-y-auto ">
                                                            {
                                                                dataP.map(item => (
                                                                    <div className="group relative w-[100px] h-[100px] shadow-md rounded-md" key={item.id} >
                                                                        <ImageIconShipmentForm dataImage={item} />
                                                                        <Check className={`${shipmentDetailRequests.some(item1 => item1.itemId === item.id) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                                                                        <Button variant={"ghost"} size={"icon"} className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 hover:bg-primary" onClick={() => {
                                                                            const mainImage = item?.imageResponses.find(image => image.isMainImage);
                                                                            handleAddProducts(mainImage ? mainImage.imageUrl : '', item?.id, productType);
                                                                        }}><CirclePlus className="text-white" /></Button>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex justify-end">
                                                        <Button onClick={handleClear}>Bỏ chọn tất cả</Button>
                                                    </CardFooter>
                                                </Card>
                                            </TabsContent>
                                            <TabsContent value="password">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Vật liệu</CardTitle>
                                                        <CardDescription>

                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        {
                                                            dataM.map(item => (
                                                                <div className="group relative w-[100px] h-[100px] shadow-md rounded-md" key={item.id} >
                                                                    <Image src={item.image} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" />
                                                                    <Check className={`${shipmentDetailRequests.some(item1 => item1.itemId === item.id) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                                                                    <Button variant={"ghost"} size={"icon"} className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 hover:bg-primary" onClick={() => handleAddProducts(item?.image, item?.id, materialType)}><CirclePlus className="text-white" /></Button>
                                                                </div>
                                                            ))
                                                        }
                                                    </CardContent>
                                                    <CardFooter className="flex justify-end">
                                                        <Button onClick={handleClear}>Bỏ chọn tất cả</Button>
                                                    </CardFooter>
                                                </Card>
                                            </TabsContent>
                                        </Tabs>
                                    </div>

                                    <div>
                                        {productDetail.length > 0 && (
                                            <Card >
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">Ảnh</TableHead>
                                                            <TableHead>Giai đoạn</TableHead>
                                                            <TableHead>Số lượng</TableHead>
                                                            <TableHead>Loại hàng</TableHead>
                                                            <TableHead>Chất lượng</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="min-h-[200px] overflow-y-auto">
                                                        {
                                                            productDetail.map((proDetail) => (
                                                                <TableRow key={proDetail.itemId}>
                                                                    <TableCell className="font-medium">
                                                                        <div className="w-[50px] h-[50px] rounded-md shadow-md">
                                                                            <Image src={proDetail.imgProducts} width={900} height={900} alt="ảnh sản phẩm" className="w-ful h-ful object-contain" />
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Select
                                                                            defaultValue={String(proDetail.phaseId)}
                                                                            onValueChange={(value) => handleChange(proDetail.itemId, 'phaseId', value)}
                                                                        >
                                                                            <SelectTrigger className="w-[100px]">
                                                                                <SelectValue placeholder="Giai đoạn sản phẩm" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    {
                                                                                        dataPh.map(item => (
                                                                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                                                        ))
                                                                                    }
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <input
                                                                            type="number"
                                                                            name="quantity"
                                                                            value={
                                                                                shipmentDetailRequests.find(
                                                                                    (item) => item.itemId === proDetail.itemId
                                                                                )?.quantity || 0
                                                                            }
                                                                            onChange={(e) => handleChange(proDetail.itemId, 'quantity', parseInt(e.target.value))}
                                                                            className="w-16 text-center outline-none"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {proDetail.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Select
                                                                            defaultValue={String(proDetail.productPhaseType)}
                                                                            onValueChange={(value) => handleChange(proDetail.itemId, 'productPhaseType', parseInt(value))}
                                                                        >
                                                                            <SelectTrigger className="w-[180px]">
                                                                                <SelectValue placeholder="Loại chất lượng sản phẩm" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    {
                                                                                        ProductPhaseType.map(item => (
                                                                                            <SelectItem key={item.id} value={String(item.id)}>{item.des}</SelectItem>
                                                                                        ))
                                                                                    }
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button variant={"ghost"} size={"icon"} onClick={() => handleDeleteProducts(proDetail.itemId)}><CircleX /></Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>

                                                </Table>
                                            </Card>
                                        )}
                                    </div>


                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="w-full flex flex-col gap-4"
                                        >

                                            <div className="flex justify-between items-center gap-6">
                                                <div className="w-full">
                                                    <FormLabel className="text-primary-backgroudPrimary ">Công ty gửi *</FormLabel>
                                                    <Card className="w-full mt-2">
                                                        <CardContent className="mt-5">
                                                            <Select onValueChange={(value) => handleStatusChange(parseInt(value))}>
                                                                <SelectTrigger className="mb-2"> <SelectValue placeholder="Chọn kiểu công ty" /></SelectTrigger>
                                                                <SelectContent>
                                                                    {
                                                                        enumCompany.map((item) => (
                                                                            <SelectItem value={item.value} key={item.id}>{item.description}</SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                            <FormField
                                                                control={form.control}
                                                                name="fromId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger className="h-32">
                                                                                    <SelectValue placeholder="Hãy chọn công ty" defaultValue={field.value} />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {company.map((item) => (
                                                                                    <SelectItem key={item.id} value={item.id} className="hover:bg-slate-100">
                                                                                        <div className="flex flex-col items-start shadow-sm mb-1">
                                                                                            <span>
                                                                                                {limitLength(item.name, 30)}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                {limitLength(item.address, 30)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex flex-col items-start">
                                                                                            <span>
                                                                                                {item.directorName}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                {item.directorPhone} - {item.email}
                                                                                            </span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                <Card>
                                                    <Truck className="w-10 h-10 p-1" />
                                                </Card>
                                                <div className="w-full">
                                                    <FormLabel className="text-primary-backgroudPrimary ">Công ty nhận *</FormLabel>
                                                    <Card className="w-full mt-2">
                                                        <CardContent className="mt-5">
                                                            <Select onValueChange={(value) => handleStatusChange1(parseInt(value))}>
                                                                <SelectTrigger className="mb-2"> <SelectValue placeholder="Chọn kiểu công ty" /></SelectTrigger>
                                                                <SelectContent>
                                                                    {
                                                                        enumCompany.map((item) => (
                                                                            <SelectItem value={item.value} key={item.id}>{item.description}</SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                            <FormField
                                                                control={form.control}
                                                                name="toId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger className="h-32">
                                                                                    <SelectValue placeholder="Hãy chọn công ty" defaultValue={field.value} />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {company1.map((item) => (
                                                                                    <SelectItem key={item.id} value={item.id} className="hover:bg-slate-100">
                                                                                        <div className="flex flex-col items-start shadow-sm mb-1">
                                                                                            <span>
                                                                                                {limitLength(item.name, 30)}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                {limitLength(item.address, 30)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="flex flex-col items-start">
                                                                                            <span>
                                                                                                {item.directorName}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                {item.directorPhone} - {item.email}
                                                                                            </span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>


                                            <FormField
                                                control={form.control}
                                                name="shipperId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-primary-backgroudPrimary">Nhân viên vận chuyển *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-16">
                                                                    <SelectValue placeholder="Hãy chọn nhân viên" defaultValue={field.value} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {dataEm.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id} >
                                                                        <div className="flex items-center gap-4">
                                                                            <Image className="w-12 h-12 rounded-full shadow-md" src={item.avatar} width={900} height={900} alt="ảnh nhân viên" />
                                                                            <div className="font-medium dark:text-white">
                                                                                <div>{item.firstName} {item.lastName}</div>
                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.id}</div>
                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.companyName}</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="shipDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                                            Ngày đặt hàng *
                                                        </FormLabel>
                                                        <Popover modal={true}>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(parseISO(field.value), "dd/MM/yyyy")
                                                                        ) : (
                                                                            <span>Chọn ngày</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value ? parseISO(field.value) : undefined}
                                                                    onSelect={(date: any) => field.onChange(date.toISOString())}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Separator className="h-1 my-1" />
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-primary/90"
                                                disabled={loading}
                                            >
                                                {loading ? "Loading..." : "Tạo đơn"}
                                            </Button>
                                        </form>
                                    </Form>

                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}



