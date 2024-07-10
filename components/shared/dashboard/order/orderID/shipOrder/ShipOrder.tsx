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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// ** import REACT
import Image from "next/image"
import { useEffect, useState } from "react"
import { orderApi } from "@/apis/order.api"
import toast from "react-hot-toast"
import { useParams } from 'next/navigation'

// ** import Components
import { NoImage } from "@/constants/images"
import { Badge } from "@/components/ui/badge"
import { Copy, CreditCard, MoreVertical, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FormShipOrder } from "./form/FormShipOrder"
import { shipOrderApi } from "@/apis/shipOrder.api"
import { FormUpdateShipOrder } from "./form/FormUpdateShipOrder"

const OrderStatus = [
    {
        id: 0,
        des: "Đang đợi giao",
        name: "PENDING"
    },
    {
        id: 1,
        des: "Đang thực hiện",
        name: "PROCESSING"
    },
    {
        id: 2,
        des: "Đã hoàn thành",
        name: "PROCESSING"
    },
    {
        id: 3,
        des: "Đã hủy",
        name: "PROCESSING"
    },
];

// type của shipOrder


// type của OrderById
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


interface OrderId {
    orderId?: any;
}


interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
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

interface Set {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: ImageResponse[];
}

interface ShipOrderDetailResponse {
    product: Product | null;
    set: Set | null;
    quantity: number;
}

interface ShipOrder {
    shipOrderId: string
    shipperId: string;
    shipperName: string;
    shipDate: string;
    status: number;
    statusDescription: string;
    deliveryMethod: number;
    deliveryMethodDescription: string;
    shipOrderDetailResponses: ShipOrderDetailResponse[];
}





export const ShipOrder: React.FC<OrderId> = ({ orderId }) => {
    // ** state
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ShipOrder[]>([]);
    const [order, setOrder] = useState<OrderIdData>(orderId);
    // ** callData
    useEffect(() => {
        if (orderId) {
            setOrder(orderId);
        }
    }, [orderId]);
    const [valueStatus, setValueStatus] = useState<any>(0);

    const handleSelectChange = (value: any, id: string) => {
        console.log('value', value)
        setValueStatus(value)
    };
    const handleSubmitOrderStatus = (id: string) => {
        console.log('value', valueStatus)
        console.log("id", id)
        const formattedData = {
            shipOrderId: id,
            status: valueStatus
        };
        console.log('formattedData', formattedData)
        shipOrderApi.updateStatus(formattedData, id)
            .then(({ data }) => {
                console.log("data", data)
                toast.success(data.message)
            })
    }

    useEffect(() => {
        setLoading(true)
        if (orderId) {
            shipOrderApi.getShipOrderID(order.orderId)
                .then(({ data }) => {
                    setData(data.data)
                })
                .catch(error => {
                    console.error('Error fetching ship order data:', error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [orderId,order, valueStatus])

    // ** handle render order detail
    const [indexItemShipOrder, setIndexItemShipOrder] = useState<number>(0);
    const handleIndex = (index: number) => {
        setIndexItemShipOrder(index)
        console.log(index)
        console.log('data', data)

    }




    // ** console 
    // console.log('orderId', orderId)
    // console.log('order', order)
    console.log('data', data)
    // console.log('vvvvvv', valueStatus)

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-10 gap-6">
            <Card className="sm:col-span-1 md:col-span-10 lg:col-span-7 shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            Vận chuyển đơn hàng
                        </CardTitle>
                        <FormShipOrder orderId={orderId} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Ngày giao
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Loại đơn
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Trạng thái
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data.map((item, index) => (
                                    <TableRow className="bg-accent cursor-pointer" key={index} onClick={() => handleIndex(index)}>
                                        <TableCell>
                                            <div className="font-medium">{item.shipperName}</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                                {item.shipperId}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {item.shipDate}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {item.deliveryMethodDescription}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    {(item.status === 2 || item.status === 3) ? (
                                                        <span>{item.statusDescription}</span>
                                                    ) : <Button variant="outline"> {item.statusDescription}</Button>}

                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader >
                                                        <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="Trạng thái" className="text-right">
                                                                Trạng thái
                                                            </Label>
                                                            <Select
                                                                defaultValue={String(item.status)}
                                                                onValueChange={(value) => handleSelectChange(Number(value), item.shipOrderId)}
                                                            >
                                                                <SelectTrigger className="w-[200px]">
                                                                    <SelectValue
                                                                        placeholder="Hãy chọn loại đơn"
                                                                        defaultValue={item.status}
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {OrderStatus.map((status) => (
                                                                        <SelectItem key={status.id} value={String(status.id)}>
                                                                            {status.des}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" onClick={() => handleSubmitOrderStatus(item.shipOrderId)}>Lưu thay đổi</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {(item.status === 2 || item.status === 3) ? (
                                                null
                                            ) : <FormUpdateShipOrder orderId={orderId} shipOrderId={item} />}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="sm:col-span-1 md:col-span-10 lg:col-span-3 shadow-sm">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Giao hàng
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">Copy Order ID</span>
                            </Button>
                        </CardTitle>
                        <CardDescription>{`Ngày ${data[indexItemShipOrder]?.shipDate}`}</CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <Truck className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                Track Order
                            </span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="h-8 w-8">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                <DropdownMenuItem>Xuất file</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Thùng rác</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Đơn hàng chi tiết</div>
                        <ul className="  h-[160px] overflow-auto">
                            {data[indexItemShipOrder]?.shipOrderDetailResponses.map((products, index) => (
                                <li className="" key={index}>
                                    <span className="text-muted-foreground">
                                        {products.product?.name} x <span>{products.quantity}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* <Separator className="my-2" /> */}
                        {/* <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>$299.00</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>$5.00</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>$25.00</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>$329.00</span>
                            </li>
                        </ul> */}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                        Updated <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>
                </CardFooter>
            </Card>
        </div >
    );
}