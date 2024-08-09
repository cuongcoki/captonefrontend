"use client"

// ** import UI
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react";
import { shipmentApi } from "@/apis/shipment.api";
import { error } from "console";
import { ShipmentStore } from "../shipment-store";
interface shipmentIDType {
    id: string;
    status: number;
    statusDescription: string;
}

interface ShipmentIDProps {
    shipmentID: shipmentIDType;
}

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
export const ChangeStatusShipment: React.FC<ShipmentIDProps> = ({ shipmentID }) => {
    // console.log("shipmentIDshipmentIDshipmentID", shipmentID)
    //state 
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { ForceRender } = ShipmentStore();

    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    const [valueStatus, setValueStatus] = useState<any>(0);

    const handleSelectChange = (value: any, id: string) => {
        console.log('value', value)
        setValueStatus(value)
    };


    const handleSubmitOrderStatus = () => {
        if (shipmentID.status === 1) {
            return toast.error("Đơn hàng đang trong quá trình vận chuyển ,thay đổi trạng thái sẽ dẫn đến tình trạng nhầm lẫn của của nhận viên vận chuyển")
        }

        const requestBody = {
            shipmentId: shipmentID.id,
            status: valueStatus
        }
        setLoading(true);
        shipmentApi.changeStatus(shipmentID.id, requestBody)
            .then(({ data }) => {
                console.log("data", data)
                ForceRender();
                setOpen(false)
                toast.success(data.message)
            })
            .catch(error => {
                if (error.response.data.error) {
                    for (const key in error.response.data.error) {
                        toast.error(error.response.data.error[key][0]);
                    }
                } else {
                    toast.error(error.response.data.message);
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
                    {shipmentID.statusDescription}
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[500px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                                    <h2 className="text-2xl text-white">Đổi trạng thái đơn vận chuyển</h2>
                                    <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4">
                                    <Card className="">
                                        <CardContent className="mt-5">
                                            <Select
                                                defaultValue={String(shipmentID.status)}
                                                onValueChange={(value) => handleSelectChange(Number(value), shipmentID.id)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder="Hãy chọn loại đơn"
                                                        defaultValue={shipmentID.status}
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
                                        </CardContent>
                                        <CardFooter className="flex justify-end gap-4">
                                            <Button variant="outline" onClick={handleOffDialog}>Hủy bỏ</Button>
                                            <Button onClick={handleSubmitOrderStatus}>Lưu thay đổi</Button>
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


