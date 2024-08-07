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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

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
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableBody,
    TableCell,
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

import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

// ** import Icon
import { CalendarIcon, Check, CirclePlus, CircleX, PencilLine, Plus, Truck, X } from "lucide-react"

// ** import Components
import { NoImage } from "@/constants/images"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShipmentSchema } from "@/schema/shipment"
import { cn } from "@/lib/utils"


import ImageIconShipmentForm from "./ImageIconShipmentForm"

import { Phase, Product, Company, Employee, Material, ShipmentDetailRequest, shipmentID, ImageResponse, Detail } from "@/types/shipment.type"
import ImageIconMaterial from "./ImageIconMaterial"
import { ShipmentStore } from "../shipment-store"

// ** import API
import { phaseApi } from "@/apis/phase.api"
import { filesApi } from "@/apis/files.api"
import { productApi } from "@/apis/product.api"
import { userApi } from "@/apis/user.api"
import { shipmentApi } from "@/apis/shipment.api"

const enumCompany = [
    {
        description: "Nhà xưởng",
        id: 0,
        value: "0"
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

interface ShipmentIDProps {
    shipmentIDDes: string;
}
let initialFormValuesShipment: any = null;
let initialFormValuesForm: any = null;
export const UpdateShipment: React.FC<ShipmentIDProps> = ({ shipmentIDDes }) => {
    //state 
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { ForceRender } = ShipmentStore();
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);
    //state ** company
    const [company, setCompany] = useState<Company[]>([]);
    const [companyType, setCompanyType] = useState<number | undefined>();
    const [company1, setCompany1] = useState<Company[]>([]);
    const [companyType1, setCompanyType1] = useState<number | undefined>();

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
    const [dataM, setDataM] = useState<Material[]>([]);
    // ** state Shipment
    const [shipmentDetailRequests, setShipmentDetailRequests] = useState<ShipmentDetailRequest[]>([]);
    const [productDetail, setProductDetail] = useState<any[]>([]);
    // ** state ShipmentID
    const [dataSID, setDataSID] = useState<shipmentID>();

    // Hàm thêm sản phẩm
    const handleAddProducts = (
        imgProducts: string,
        itemId: string,
        itemKind: number
    ) => {
       
        setShipmentDetailRequests((prev: any) => [
            ...prev,
            {
                itemId: itemId,
                phaseId: null,
                quantity: 1,
                kindOfShip: itemKind,
                productPhaseType: 0,
                ...(itemKind !== 0 && { materialPrice: 0 }),
            },
        ]);
        setProductDetail((prev) => [
            ...prev,
            {
                itemId: itemId,
                imgProducts,
                phaseId: null,
                quantity: 1,
                kindOfShip: itemKind,
                productPhaseType: 0,
                materialPrice: 0,
            },
        ]);
    };

    // Hàm xóa sản phẩm
    const handleDeleteProducts = (itemId: string, index: number) => {
        setShipmentDetailRequests((prev) =>
            prev.filter((item, i) => !(item.itemId === itemId && i === index))
        );
        setProductDetail((prev) =>
            prev.filter((product, i) => !(product.itemId === itemId && i === index))
        );
    };

    // Hàm thay đổi giá trị của một sản phẩm
    const handleChange = (
        itemId: string,
        name: keyof ShipmentDetailRequest,
        value: any,
        index: number
    ) => {
        setShipmentDetailRequests((prev) =>
            prev.map((item, i) => {
                if (item.itemId === itemId && i === index) {
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


    const handleOnDialog = () => {
        setOpen(true);
    };
    const handleOffDialogA = () => {
        setOpenAlert(false);
    };
    const handleOnDialogA = () => {
        setOpenAlert(true);
    };

    const handleStatusChange = (value: number) => {
        setCompanyType(value);
    };

    const handleStatusChange1 = (value: number) => {
        setCompanyType1(value);
    };
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
    const { reset } = form;
    // call data shipmentID
    useEffect(() => {
        const fetchDataShipID = async () => {
            setLoading(true);
            try {
                const { data } = await shipmentApi.getShipmentID(shipmentIDDes);
                const orderData = data.data;
                // setDataSIDTest(orderData);
                // // Tạo promises để lấy ảnh
                // const imagePromises = orderData.details.map(async (detail: Detail) => {
                //     if (detail.material) {
                //         return;
                //     } else if (detail.product && detail.product.imageResponses.length > 0) {
                //         // Gọi API để lấy ảnh cho product
                //         const imagePromises = detail.product.imageResponses.map(async (imageResponse: ImageResponse) => {
                //             const response = await filesApi.getFile(imageResponse.imageUrl);
                //             return { ...imageResponse, imageUrl: response.data.data }; // Cập nhật URL ảnh cho product
                //         });
                //         detail.product.imageResponses = await Promise.all(imagePromises);
                //     }
                //     return detail;
                // });

                // // Chờ tất cả promises hoàn thành
                // orderData.details = await Promise.all(imagePromises);

                setDataSID(orderData);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        if (shipmentIDDes) {
            reset({
                toId: dataSID?.to?.id,
                fromId: dataSID?.from?.id,
                shipperId: dataSID?.shipper.id,
                shipDate: dataSID?.shipDate,
            });
            if (dataSID?.details) {
                setShipmentDetailRequests(dataSID.details.map(detail => ({
                    itemId: detail?.product?.id || detail?.material?.id,
                    phaseId: detail?.phase?.id || null,
                    quantity: detail?.quantity || 0,
                    materialPrice: detail?.materialPrice || 0,
                    kindOfShip: detail?.product === null ? 1 : 0,
                    productPhaseType: detail?.productPhaseType || 0,
                })));
                setProductDetail(dataSID.details.map(detail => ({
                    itemId: detail?.product?.id || detail?.material?.id,
                    phaseId: detail?.phase?.id || null,
                    quantity: detail?.quantity || 0,
                    kindOfShip: detail?.product === null ? 1 : 0,
                    productPhaseType: detail?.productPhaseType || 0,
                    imgProducts: detail?.product?.imageResponses?.find(image => image.isMainImage)?.imageUrl || detail?.material?.image
                })));
            }
        }
        fetchDataShipID();
    }, [dataSID, reset, fetchTrigger])

    // call data material
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
                                    image: "", 
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
            shipmentApi.getAllCompanyByType(companyType, 1, 20)
                .then(({ data }) => {
                    console.log("========", data.data)
                    setCompany(data.data.data);
                })
                .catch(error => {
                });
        };
        const fetchDataCompany1 = () => {
            shipmentApi.getAllCompanyByType(setCompanyType1, 1, 20)
                .then(({ data }) => {
                    // console.log("========", data.data)
                    setCompany1(data.data.data);
                })
                .catch(error => {
                    console.error('Error fetching companies:', error);
                });
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
                                        imageUrl: "",
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
                setDataP([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDataProduct();
    }, [currentPageP, pageSizeP, searchTerm, isInProcessing]);

    // call gủi form
    const onSubmit = (data: z.infer<typeof ShipmentSchema>) => {
        console.log('data', data)
        if (data.fromId === data.toId) {
            return toast.error("2 Công ty không được trùng nhau")
        }

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
            } else if (!request.phaseId && request.kindOfShip === 0) {
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
                                        Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
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
                                        Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
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
            } else if (request.productPhaseType === null && request.kindOfShip === 0) { // Sửa điều kiện ở đây
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
                                        Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Hãy chọn loại cho sản phẩm
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
            else if (request.materialPrice <= 0 && request.kindOfShip === 1) {
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
                                        Giá tiền phải lớn hơn 0
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

        const originalDate = data.shipDate;
        const date = new Date(originalDate);
        date.setUTCHours(23, 59, 59, 0);
        const formattedShipDate = date.toISOString().replace('.000', '');
        // Gọi hàm kiểm tra
        const requestBody = {
            shipmentId: shipmentIDDes,
            fromId: data.fromId,
            toId: data.toId,
            shipperId: data.shipperId,
            shipDate: formattedShipDate,
            shipmentDetailRequests: shipmentDetailRequests
        };

        console.log("requestBodyCreateShipment=====", requestBody);
        setLoading(true)
        shipmentApi.updateShipment(requestBody, shipmentIDDes)
            .then(({ data }) => {
                console.log("data", data)
                ForceRender();
                form.reset();
                setShipmentDetailRequests([]);
                setOpen(false)
                if (data.isSuccess) {
                    toast.success(data.message);
                }
            })
            .catch(error => {
                const errorResponse = error.response?.data?.error;
                if (errorResponse?.ShipmentDetailRequests) {
                    toast.error(errorResponse.ShipmentDetailRequests);
                }
                if (errorResponse?.ToId) {
                    toast.error(errorResponse.ToId);
                }
                if (!errorResponse?.ToId && !errorResponse?.ShipmentDetailRequests && error.response?.data) {
                    toast.error(error.response?.data.message);
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

    const formatCurrency = (value: any): string => {
        if (!value) return "0";
        let valueString = value.toString();
        valueString = valueString.replace(/[^0-9]/g, "");
        valueString = valueString.replace(/^0+/, "");
        if (valueString === "") return "0";
        let numberValue = parseInt(valueString, 10);
        let formatted = numberValue.toLocaleString("vi-VN");
        return formatted;
    };

    const parseCurrency = (value: any) => {
        const cleanedValue = value.replace(/\./g, "");
        return parseInt(cleanedValue);
    };
    const handleClearForm = () => {
        setOpen(false)
        setOpenAlert(false)
        setFetchTrigger((prev) => prev + 1);
        form.reset();
        setShipmentDetailRequests([]);
        setProductDetail([]);
    }

    const handleOffDialog = () => {
        const currentFormValues = shipmentDetailRequests
        console.log("shipmentDetailRequests", currentFormValues)
        if (initialFormValuesShipment === null) {
            initialFormValuesShipment = currentFormValues;
        }
        console.log("initialFormValuesShipment", initialFormValuesShipment)

        const isFormChanged = JSON.stringify(initialFormValuesShipment) === JSON.stringify(currentFormValues);


        // form
        const currentFormValues1 = form.getValues();
        console.log("currentFormValues1", currentFormValues1)
        if (initialFormValuesForm === null) {
            initialFormValuesForm = currentFormValues1;
        }
        console.log("initialFormValuesForm", initialFormValuesForm)

        const isFormChanged1 = JSON.stringify(initialFormValuesForm) === JSON.stringify(currentFormValues1);

        console.log("isFormChanged", isFormChanged)
        console.log("isFormChanged", isFormChanged1)

        if (isFormChanged && isFormChanged1) {
            setOpen(false);
        } else {
            setOpenAlert(true);
        }
    };
    return (
        <>
            {
                openAlert && (
                    <AlertDialog open={openAlert} >
                        <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn muốn tắt biểu mẫu này không ??</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn những dữ liệu mà bạn đã nhập
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleOffDialogA}>Hủy bỏ</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearForm}>Tiếp tục</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
                    <PencilLine />
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <Dialog.Title className="visible hidden"></Dialog.Title>
                            <Dialog.Description className="visible hidden"></Dialog.Description>
                            <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                                    <h2 className="text-2xl text-white">Chỉnh sửa vận chuyển</h2>
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
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <div className=" w-full grid grid-cols-3 md:grid-cols-8 gap-4 h-[150px]  md:min-h-[100px] overflow-y-auto ">
                                                            {
                                                                dataP.map(item => (
                                                                    <div className="group relative w-[80px] h-[80px] shadow-md rounded-md" key={item.id} >
                                                                        <ImageIconShipmentForm dataImage={item} />
                                                                        <Check className={`${shipmentDetailRequests.some(item1 => item1.itemId === item.id) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                                                                        <Button variant={"ghost"} size={"icon"} className="w-[30px] h-[30px] absolute bottom-0 left-0  opacity-0 group-hover:opacity-100 hover:bg-primary " onClick={() => {
                                                                            const mainImage = item?.imageResponses.find(image => image.isMainImage);
                                                                            handleAddProducts(mainImage ? mainImage.imageUrl : '', item?.id, productType);
                                                                        }}><Plus className="text-white " /></Button>
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
                                                        <div className=" w-full grid grid-cols-3 md:grid-cols-8 gap-4 h-[150px]  md:min-h-[100px] overflow-y-auto ">
                                                            {
                                                                dataM.map(item => (
                                                                    <div className="group relative w-[60px] h-[60px] shadow-md rounded-md" key={item.id} >
                                                                        <ImageIconMaterial dataImage={item} />
                                                                        <Check className={`${shipmentDetailRequests.some(item1 => item1.itemId === item.id) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                                                                        <Button variant={"ghost"} size={"icon"} className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 hover:bg-primary" onClick={() => handleAddProducts(item?.image, item?.id, materialType)}><CirclePlus className="text-white" /></Button>
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
                                        </Tabs>
                                    </div>

                                    <div className="w-full overflow-auto">
                                        {productDetail.length > 0 && (
                                            <Card className="w-[1000px] sm:w-full overflow-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">Ảnh</TableHead>
                                                            <TableHead>Giai đoạn</TableHead>
                                                            <TableHead>Số lượng</TableHead>
                                                            <TableHead>Loại hàng</TableHead>
                                                            <TableHead>Chất lượng</TableHead>
                                                            <TableHead>Giá Tiền</TableHead>
                                                            <TableHead></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="min-h-[200px] overflow-y-auto">
                                                        {
                                                            productDetail.map((proDetail, index) => (
                                                                <TableRow key={proDetail.itemId}>
                                                                    <TableCell className="font-medium">
                                                                        <div className="w-[50px] h-[50px] rounded-md shadow-md">
                                                                            <Image
                                                                                src={proDetail.imgProducts}
                                                                                width={900}
                                                                                height={900}
                                                                                alt="ảnh sản phẩm"
                                                                                className="w-ful h-ful object-contain"
                                                                            />
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {proDetail.kindOfShip === 0 ? (
                                                                            <Select
                                                                                defaultValue={String(proDetail.phaseId)}
                                                                                onValueChange={(value) =>
                                                                                    handleChange(
                                                                                        proDetail.itemId,
                                                                                        "phaseId",
                                                                                        value,
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="w-[100px]">
                                                                                    <SelectValue placeholder="Giai đoạn sản phẩm" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectGroup>
                                                                                        {dataPh.map((item) => (
                                                                                            <SelectItem
                                                                                                key={item.id}
                                                                                                value={item.id}
                                                                                            >
                                                                                                {item.name}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectGroup>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        ) : (
                                                                            <>Không có</>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Input
                                                                            min={0}
                                                                            type="number"
                                                                            name="quantity"
                                                                            value={
                                                                                shipmentDetailRequests.find(
                                                                                    (item, i) =>
                                                                                        item.itemId === proDetail.itemId &&
                                                                                        i === index
                                                                                )?.quantity || 0
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleChange(
                                                                                    proDetail.itemId,
                                                                                    "quantity",
                                                                                    parseInt(e.target.value),
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="w-16 text-center outline-none"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {proDetail.kindOfShip === 0
                                                                            ? "Sản phẩm"
                                                                            : "Vật liệu"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {proDetail.kindOfShip === 0 ? (
                                                                            <Select
                                                                                defaultValue={String(
                                                                                    proDetail.productPhaseType
                                                                                )}
                                                                                onValueChange={(value) =>
                                                                                    handleChange(
                                                                                        proDetail.itemId,
                                                                                        "productPhaseType",
                                                                                        parseInt(value),
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="w-[180px]">
                                                                                    <SelectValue placeholder="Loại chất lượng sản phẩm" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectGroup>
                                                                                        {ProductPhaseType.map((item) => (
                                                                                            <SelectItem
                                                                                                key={item.id}
                                                                                                value={String(item.id)}
                                                                                            >
                                                                                                {item.des}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectGroup>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        ) : (
                                                                            <div>Không có</div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {proDetail.kindOfShip === 1 ? (
                                                                            <Input
                                                                                min={0}
                                                                                max={20000000000}
                                                                                type="text"
                                                                                name="materialPrice"
                                                                                value={formatCurrency(
                                                                                    shipmentDetailRequests.find(
                                                                                        (item, i) =>
                                                                                            item.itemId === proDetail.itemId && i === index
                                                                                    )?.materialPrice || 0
                                                                                )}
                                                                                inputMode="numeric"
                                                                                onChange={(e) =>
                                                                                    handleChange(
                                                                                        proDetail.itemId,
                                                                                        "materialPrice",
                                                                                        parseCurrency(e.target.value),
                                                                                        index
                                                                                    )
                                                                                }
                                                                                className="w-[150px] text-center outline-none"
                                                                            />

                                                                        ) : (
                                                                            <>Không có</>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant={"ghost"}
                                                                            size={"icon"}
                                                                            onClick={() =>
                                                                                handleDeleteProducts(
                                                                                    proDetail.itemId,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            <CircleX />
                                                                        </Button>
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

                                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
                                                                                    <SelectItem key={item.id} value={item.id} className="hover:bg-slate-100 shadow-md mb-1">
                                                                                        <div className="flex flex-col items-start  ">
                                                                                            <span>
                                                                                                {limitLength(item.name, 30)}-{limitLength(item.address, 30)}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                <div className="flex flex-col items-start">
                                                                                                    <span>
                                                                                                        {item.directorName}
                                                                                                    </span>
                                                                                                    <span className="text-sm text-gray-500">
                                                                                                        {`${item.directorPhone} - ${!item.email ? "Không có" : item.email}`}
                                                                                                    </span>
                                                                                                </div>
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
                                                <Card className="hidden md:block">
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
                                                                                    <SelectItem key={item.id} value={item.id} className="hover:bg-slate-100 shadow-md mb-1">
                                                                                        <div className="flex flex-col items-start  ">
                                                                                            <span>
                                                                                                {limitLength(item.name, 30)}-{limitLength(item.address, 30)}
                                                                                            </span>
                                                                                            <span className="text-sm text-gray-500">
                                                                                                <div className="flex flex-col items-start">
                                                                                                    <span>
                                                                                                        {item.directorName}
                                                                                                    </span>
                                                                                                    <span className="text-sm text-gray-500">
                                                                                                        {`${item.directorPhone} - ${!item.email ? "Không có" : item.email}`}
                                                                                                    </span>
                                                                                                </div>
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
                                                                            (() => {
                                                                                const [year, month, day] = field.value.split('T')[0].split('-');
                                                                                return `${day}/${month}/${year}`;
                                                                            })()
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
                                                                    selected={field.value ? new Date(new Date(field.value).setDate(new Date(field.value).getDate() - 1)) : undefined}
                                                                    onSelect={(date: any) => {
                                                                        if (date) {
                                                                            // Đảm bảo giờ là 00:00:00 để tránh vấn đề múi giờ
                                                                            date.setHours(0, 0, 0, 0);
                                                                            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                                                            const formattedDate = utcDate.toISOString().split('T')[0]; // Giữ lại chỉ phần ngày
                                                                            field.onChange(formattedDate);
                                                                        }
                                                                    }}
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
                                                {loading ? "Loading..." : "Chỉnh sửa"}
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



