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
import { useEffect, useState } from "react";

// ** import Components
import { Mail, Phone, Truck, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ImageIconShipOrder from "./ImageIconShipOrder";
import { filesApi } from "@/apis/files.api";
import ImageIconShipOrderSet from "./ImageIconShipOrderSet";

type ShipOrderIDProps = {
    item: any;
};
export default function ShipOrderID({ item }: ShipOrderIDProps) {
    //state
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    useEffect(() => {

    }, [item])

    // console.log("item", item)

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
    const formatCurrency = (value: any): string => {
        if (!value) return "";
        let valueString = value.toString();
        valueString = valueString.replace(/\D/g, "");
        valueString = valueString.replace(/^0+/, "");
        if (valueString === "") return "0";
        let reversed = valueString.split("").reverse().join("");
        let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
        let formatted = formattedReversed.split("").reverse().join("");
        return formatted;
    };


    const [imageSet, setImageSet] = useState<string>("");
    useEffect(() => {
        filesApi.getFile(String(item?.set?.imageUrl)).then((res) => {
            setImageSet(res.data.data);
        });
    }, [imageSet, item?.set?.imageUrl]);
    // console.log("imageSet", imageSet)
    return (
        <>
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
                    <Truck />
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[600px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <Dialog.Title></Dialog.Title>
                            <Dialog.Description></Dialog.Description>
                            <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md ">
                                    <h2 className="text-2xl text-white">Thông Tin Đơn Vận Chuyển</h2>
                                    <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                        <X className="w-4 h-4 dark:text-white" />
                                    </Button>
                                </div>

                                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4 dark:bg-card">
                                    <Card
                                        className="overflow-hidden"
                                        x-chunk="dashboard-05-chunk-4"
                                    >
                                        <CardHeader className="flex flex-row items-start bg-muted/50">
                                            <div className="grid gap-0.5">
                                                <CardTitle className="group flex items-center gap-2 text-lg">
                                                    Thông tin vận chuyển
                                                </CardTitle>
                                                <CardDescription>
                                                    Ngày:{" "}
                                                    {item?.shipDate ? formatDate(item.shipDate) : "N/A"}
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
                                                        {item?.statusDescription}
                                                    </span>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 text-sm">
                                            <div className="grid gap-3">
                                                <div className="font-semibold">Mặt hàng vận chuyển</div>
                                                <ul className="grid gap-3">
                                                    {item?.shipOrderDetailResponses.map((item: any, index: any) => (
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
                                                                                <ImageIconShipOrder
                                                                                    dataImage={item?.product?.imageResponses}
                                                                                />
                                                                            </Link>
                                                                        </span>
                                                                        <span>{item?.product?.code}-{item?.product?.name}</span>
                                                                    </>
                                                                ) : item?.set ? (
                                                                    <>
                                                                        <span className="w-[50px] h-[50px] shadow-md rounded-md">
                                                                            <ImageIconShipOrderSet dataImage={item?.set?.imageUrl} />
                                                                        </span>
                                                                        <span>{item?.set?.name}-{item?.set?.code}</span>
                                                                    </>
                                                                ) : null}
                                                                <span>x</span>
                                                                <span>{item?.quantity}</span>
                                                            </span>

                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-3">
                                                    <div className="font-semibold">
                                                        Nhân viên vận chuyển
                                                    </div>
                                                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                                                        <Link
                                                            href={`/dashboard/user/${item?.shipperId}`}
                                                            className="hover:underline"
                                                        >
                                                            <span>
                                                                {item?.shipperId}

                                                            </span>
                                                        </Link>
                                                        <span>{item?.shipperName}</span>
                                                    </address>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                        </CardContent>

                                        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                                            <div className="text-xs text-muted-foreground">
                                                Công ty mây tre đan Tiến Huy
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