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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// ** import REACT
import Image from "next/image"
import { useEffect, useState } from "react"
import { orderApi } from "@/apis/order.api"
import toast from "react-hot-toast"
import { useParams } from 'next/navigation'

// ** import Components
import { NoImage } from "@/constants/images"
import UpdateOrder from "../form/UpdateOrder"
import { UpdateOrderDetails } from "../form/UpdateOrderDetail"
import { Badge } from "@/components/ui/badge"
import { Copy, CreditCard, MoreVertical, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {ShipOrder} from "./shipOrder/ShipOrder"

interface OrderId {
    orderId?: string
}
interface OrderIdData {
    orderId: string,
    productOrderResponses: productOrderResponses[],
    setOrderResponses: setOrderResponses[]
}

interface productOrderResponses {
    productId: string,
    productCode: string
    productName: string
    productDescription: string
    imageProductUrl: string,
    quantity: number
    unitPrice: number
    note: number
}
interface setOrderResponses {
    setId: string,
    setName: string,
    setDescription: string,
    imageSetUrl: string,
    productResponses: productResponses[]
    quantity: number
    unitPrice: number
    note: number
}
interface productResponses {
    id: string,
    name: string,
    code: string,
    price: number,
    size: number,
    description: string,
    isInProcessing: boolean,
    imageResponses: imageResponses[]
}
interface imageResponses {
    id: string,
    imageUrl: string,
    isBluePrint: boolean,
    isMainImage: boolean,
}

interface orderIds {
    id: string,
    companyId: string,
    company: {
        id: string,
        name: string,
        address: string,
        directorName: string,
        directorPhone: string,
        email: string,
        companyEnum: string,
        companyType: number,
        companyTypeDescription: string
    },
    status: number,
    statusType: string,
    statusDescription: string,
    startOrder: string,
    endOrder: string,
    vat: number
}

export default function OrderIdPage({ orderId }: OrderId) {
    //state 
    const params = useParams<{ id: string }>()
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<orderIds>();
    const [dataId, setDataId] = useState<OrderIdData>({ orderId: "", productOrderResponses: [], setOrderResponses: [] });
    // console.log("data=====", data);
    // console.log("data=====", dataId);
    // console.log('ssssssssssssssssssssssssssssssss', params.id)
    useEffect(() => {
        const fetchDataOrderId = () => {
            setLoading(true)
            orderApi.getOrderId(params.id)
                .then(({ data }) => {
                    const orderData = data.data
                    setData(orderData)
                })
                .catch(error => {
                    toast.error("ko thấy ")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        const fetchDataOrderIds = () => {
            setLoading(true)
            orderApi.getOrderDetailsId(params.id)
                .then(({ data }) => {
                    const orderData = data.data
                    setDataId(orderData)
                })
                .catch(error => {
                    toast.error("ko thấy ")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        fetchDataOrderIds();
        fetchDataOrderId();
    }, [data, dataId])


    return (
        <div className="flex flex-col gap-8">
            <div className="grid sm:grid-cols-1 md:grid-cols-10 gap-6">
                <Card className="sm:col-span-1 md:col-span-10 lg:col-span-7 shadow-sm">
                    <CardHeader>
                        <CardTitle>
                            Công ty chi tiết
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">

                            <div className="flex  justify-between border p-2 rounded-lg">
                                <div className="flex flex-col justify-between">
                                    <span className="font-medium text-gray-600">Tên công ty:</span>
                                    <span className="text-gray-800">{data?.company.name}</span>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <span className="font-medium text-gray-600">Tên giám đốc:</span>
                                    <span className="text-gray-800">{data?.company.directorName}</span>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <span className="font-medium text-gray-600">Số điện thoại:</span>
                                    <span className=" flex justify-center ">{data?.company.directorPhone}</span>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <span className="font-medium text-gray-600">Email:</span>
                                    <span className="text-gray-800">{data?.company.email}</span>
                                </div>
                            </div>


                            <div className="flex gap-2">
                                <span className="font-medium text-gray-600">Địa chỉ: </span>
                                <span className="text-gray-800">{data?.company.address}</span>
                            </div>

                            <div className="flex gap-2">
                                <span className="font-medium text-gray-600">Loại công ty:</span>
                                <span className="text-gray-800">{data?.company.companyType}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium text-gray-600">Mô tả loại công ty:</span>
                                <span className="text-gray-800">{data?.company.companyTypeDescription}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="sm:col-span-1 md:col-span-10 lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                Đơn hàng chi tiết
                            </CardTitle>
                            <UpdateOrder orderId={data} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600 ">Trạng thái:</span>
                                <span className="text-gray-800 bg-slate-100 p-2 rounded-full">{data?.statusDescription}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Ngày bắt đầu:</span>
                                <span className="text-gray-800">{data?.startOrder}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Ngày kết thúc:</span>
                                <span className="text-gray-800">{data?.endOrder}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">VAT:</span>
                                <span className="text-gray-800">{data?.vat}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="sm:col-span-1 md:col-span-10 shadow-sm">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                Sản phẩm chi tiết
                            </CardTitle>
                            <UpdateOrderDetails orderId={dataId} />
                        </div>
                    </CardHeader>
                    <CardContent >
                        <Tabs defaultValue="productOrderResponses" className="">
                            <TabsList className="grid grid-cols-2 w-[250px]">
                                <TabsTrigger value="productOrderResponses">Sản phẩm</TabsTrigger>
                                <TabsTrigger value="setOrderResponses">Bộ sẩn phẩm</TabsTrigger>
                            </TabsList>
                            <TabsContent value="productOrderResponses">
                                <Card >
                                    <CardHeader>
                                        <CardTitle>Sản phẩm</CardTitle>
                                        <CardDescription>
                                            Hãy xem chi tiết sản phẩm bằng cách bấm vào ảnh
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Table className="w-full overflow-x-auto">
                                            <TableCaption>Sản phẩm trong đơn hàng</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">ảnh</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Tên sản phẩm</TableHead>
                                                    <TableHead className="hidden sm:table-cell">Mã CODE</TableHead>
                                                    <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                                                    <TableHead>Số lượng</TableHead>
                                                    <TableHead>Giá unit</TableHead>
                                                    <TableHead className="hidden md:table-cell">Ghi chú</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    dataId.productOrderResponses.map(item => (
                                                        <TableRow key={item.productId}>
                                                            <TableCell>
                                                                <Image src={item.imageProductUrl === "No Image" ? NoImage : item.imageProductUrl} width={900} height={900} alt="ảnh sản phẩm" className="w-[50px] h-[50px] object-contain shadow-md rounded-sm" />
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell">{item.productName}</TableCell>
                                                            <TableCell className="hidden sm:table-cell">{item.productCode}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{item.productDescription}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell>{item.unitPrice}</TableCell>
                                                            <TableCell className="hidden md:table-cell">{item.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }

                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="setOrderResponses">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bộ sản phẩm</CardTitle>
                                        <CardDescription>
                                            Hãy xem chi tiết sản phẩm bằng cách bấm vào ảnh
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Table className="w-full overflow-x-auto">
                                            <TableCaption>Bộ sản phẩm trong đơn hàng</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">ảnh</TableHead>
                                                    <TableHead >Tên sản phẩm</TableHead>
                                                    <TableHead>mô tả</TableHead>
                                                    <TableHead>Số lượng</TableHead>
                                                    <TableHead>Giá unit</TableHead>
                                                    <TableHead>Ghi chú</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    dataId.setOrderResponses.map(item => (
                                                        <TableRow key={item.setId}>
                                                            <TableCell>
                                                                <Image src={item.imageSetUrl === "No Image" ? NoImage : item.imageSetUrl} width={900} height={900} alt="ảnh sản phẩm" className="w-[50px] h-[50px] object-contain shadow-md rounded-sm" />
                                                            </TableCell>
                                                            <TableCell>{item.setName}</TableCell>
                                                            <TableCell>{item.setDescription}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell>{item.unitPrice}</TableCell>
                                                            <TableCell >{item.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
                
            </div>
            <ShipOrder orderId={dataId} />
        </div>

    );
}




