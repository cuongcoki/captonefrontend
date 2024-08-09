
"use client";
// ** import UI
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";



import { Button } from "@/components/ui/button";

import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image";
import { useEffect, useState } from "react";

// ** import Components
import { Mail, Phone, Truck, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { shipOrderApi } from "@/apis/shipOrder.api";

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
    image: string;
}

interface ShipOrderDetailResponse {
    product: Product | null;
    set: any; // You can replace 'any' with the appropriate type if available.
    quantity: number;
}

interface CompanyResponse {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: string;
    companyType: number;
    companyTypeDescription: string;
}

interface ShipOrderResponse {
    shipOrderId: string;
    shipperId: string;
    shipperName: string;
    shipDate: string; // ISO 8601 format date string
    status: number;
    statusDescription: string;
    deliveryMethod: number;
    deliveryMethodDescription: string;
    shipOrderDetailResponses: ShipOrderDetailResponse[];
    companyResponse: CompanyResponse;
}


interface ShipOrderProps {
    ShipOrderID: string;
}
export const ShipperOrderDetail: React.FC<ShipOrderProps> = ({ ShipOrderID }) => {
    //state
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ShipOrderResponse>();
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    useEffect(() => {
        const fetchDataShipperShipOrderId = () => {
            setLoading(true);
            shipOrderApi
                .getShipOrderIDByShipper(ShipOrderID)
                .then(({ data }) => {
                    const orderData = data.data;
                    setData(orderData);
                })
                .catch((error) => {
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchDataShipperShipOrderId();
    }, [data]);

    // các hàm hiển thị sao cho oke
    function formatDate(isoString: string) {
        // Tách chuỗi thành các phần
        const parts = isoString.split("T")[0].split("-");

        // parts[0] là năm, parts[1] là tháng, parts[2] là ngày
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        // Trả về chuỗi theo định dạng dd/MM/yyyy
        return `${day}/${month}/${year}`;
    }
    const limitLength = (text: any, maxLength: any) => {
        if (text?.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };
    return (
        <>
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
                    <Truck />
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[600px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                                    <h2 className="text-2xl text-white">
                                        Thông tin đơn vận chuyển
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleOffDialog}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid  p-4 overflow-y-auto  gap-4">
                                    <Card
                                        className="overflow-hidden"
                                        x-chunk="dashboard-05-chunk-4"
                                    >
                                        <CardHeader className="flex flex-row items-start bg-muted/50">
                                            <div className="grid gap-0.5">
                                                <CardTitle className="group flex items-center gap-2 text-lg">
                                                    Vận chuyển
                                                </CardTitle>
                                                <CardDescription>
                                                    Ngày:{" "}
                                                    {data?.shipDate ? formatDate(data.shipDate) : "N/A"}
                                                </CardDescription>
                                            </div>
                                            <div className="ml-auto flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-1"
                                                >
                                                    <Truck />
                                                    <span className="ml-1 text-[15px]">
                                                        {data?.statusDescription}
                                                    </span>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 text-sm">
                                            <div className="grid gap-3">
                                                <div className="font-semibold">Vận chuyển chi tiết</div>
                                                <ul className="grid gap-3">
                                                    {data?.shipOrderDetailResponses.map((item, index) => (
                                                        <li
                                                            className="p-2 shadow-sm hover:bg-gray-100/90 cursor-pointer"
                                                            key={index}
                                                        >
                                                            <span className="text-muted-foreground flex justify-between items-center mb-1">
                                                                {item?.product ? (
                                                                    <>
                                                                        <span className="w-[50px] h-[50px] shadow-md rounded-md">
                                                                            <Link
                                                                                href={`/dashboard/products/product/${item?.product?.id}`}
                                                                            >
                                                                                {" "}
                                                                                <Image alt="ảnh sản phẩm" src={item.product.image} width={900} height={900} className="w-full h-full object-cover rounded-md " />
                                                                            </Link>
                                                                        </span>
                                                                        <span>{item?.product?.name}</span>
                                                                        <span>{item?.product?.code}</span>
                                                                    </>
                                                                ) : item?.set ? (
                                                                    <>
                                                                        <span className="w-[50px] h-[50px] shadow-md rounded-md">
                                                                            {/* <ImageIconShipmentMa dataImage={item?.material?.image} /> */}
                                                                        </span>
                                                                        <span>{item?.set?.name}</span>
                                                                        <span>{item?.set?.unit}</span>
                                                                    </>
                                                                ) : null}
                                                                <span>x</span>
                                                                <span>{item?.quantity}</span>
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <span className="text-muted-foreground flex justify-between items-center">
                                                                    {item?.product ? "Sản phẩm: " : "Bộ sản phẩm: "}
                                                                </span>
                                                                {/* <span className="text-muted-foreground flex justify-between items-center">
                                                                    {item.set && (`${item?.materialPrice} đ`)}
                                                                </span>
                                                                <span className="text-muted-foreground flex justify-between items-center">
                                                                    {item.product && (`${item?.phase?.name}`)}
                                                                </span>
                                                                <span className="text-muted-foreground flex justify-between items-center">
                                                                    {item.product && (`- ${item?.phase?.description}`)}
                                                                </span>
                                                                <span className="text-muted-foreground flex justify-between items-center">
                                                                    {item.product && (`- ${item?.productPhaseTypeDescription}`)}
                                                                </span> */}

                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-3">
                                                    <div className="font-semibold">
                                                        Thông tin nhận viên vận chuyển
                                                    </div>
                                                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                                                        <Link
                                                            href={`/profile/${data?.shipperId}`}
                                                            className="hover:underline"
                                                        >
                                                            <span>
                                                                {data?.shipperName}
                                                            </span>
                                                        </Link>
                                                    </address>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="grid gap-3">
                                                <div className="font-semibold">
                                                    Thông tin công ty khách hàng
                                                </div>
                                                <dl className="grid gap-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Tên chủ tịch
                                                        </dt>
                                                        <dd>{data?.companyResponse.directorName}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Tên công ty
                                                        </dt>
                                                        <dd>{data?.companyResponse.companyTypeDescription}</dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                        <dt className="text-muted-foreground">Địa chỉ</dt>
                                                        <dd>
                                                            <a href="mailto:">{limitLength(data?.companyResponse.address, 20)}</a>
                                                        </dd>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                        <dt className="text-muted-foreground">Liện hệ</dt>
                                                        <dd className="flex items-center gap-1">
                                                            <Mail className="h-3.5 w-3.5" /> <a href="mailto:">{data?.companyResponse.email === "" ? "Không có" : data?.companyResponse.email}</a>
                                                        </dd>
                                                        <dd className="flex items-center gap-1">
                                                            <Phone className="h-3.5 w-3.5" /> <a href="tel:">{data?.companyResponse.directorPhone}</a>
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                            <Separator className="my-4" />
                                            {/* <div className="grid gap-3">
                                                <div className="font-semibold">
                                                    Thông tin thanh toán
                                                </div>
                                                <dl className="grid gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <dt className="flex items-center gap-1 text-muted-foreground">
                                                            VCB
                                                        </dt>
                                                        <dd>**** **** **** 4532</dd>
                                                    </div>
                                                </dl>
                                            </div> */}
                                        </CardContent>
                                        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                                            <div className="text-xs text-muted-foreground">
                                                Công ty may che dan tiến huy
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}