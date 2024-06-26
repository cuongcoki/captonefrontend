'use client'

// ** import react
import Link from "next/link";
import Image from "next/image";

import { useParams } from 'next/navigation'
import { createContext, useEffect, useState } from "react";


// ** import UI
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ** import api 
import { productApi } from "@/apis/product.api";

// ** import icon
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

// ** component 
import ImageDisplayID from "./ImageDisplayID";
import { ProductUpdateForm } from "../../form/ProductUpdateForm";
import { ProductForm } from "../../form/ProductForm";


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
type ContexType = {
    forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
    forceUpdate: () => { },
});
export default function ProductIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [productId, setProductId] = useState<any>([])
    const [open1, setOpen1] = useState<boolean>(false);
    const [force, setForce] = useState<number>(1);

    const forceUpdate = () => setForce((prev) => prev + 1);



    useEffect(() => {

        const fetchDataProductId = () => {
            setLoading(true);
            productApi.getProductId(params.id)
                .then(res => {
                    const userData = res.data.data;
                    setProductId(userData);
                    // setUserId(res.data.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchDataProductId()

    }, [params.id, force])


    // console.log('iddd product', productId)



    return (
        <div className="flex flex-col gap-6 justify-center">
            <header className="">

                <div className="flex items-center gap-4 justify-between">
                    <Link href={'/dashboard/product'}>  
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    </Link>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Sản phẩm
                    </h1>

                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Dialog open={open1} onOpenChange={setOpen1}>
                            <DialogTrigger>
                                <Button variant={"colorCompany"} className="text-xs ">
                                    Chỉnh sửa
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-full min-w-[90%] md:min-w-[70%]">
                                <DialogTitle className="text-2xl text-primary-backgroudPrimary visible hidden">
                                    Chỉnh sửa
                                </DialogTitle>
                                <ProductUpdateForm productId={productId} setOpen1={setOpen1} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header >

            <MyContext.Provider value={{ forceUpdate }}>
                <div className="w-full h-full bg-white p-2 rounded-lg shadow-md">
                    <div className="p-4 grid md:grid-cols-2 grid-cols-1  gap-4">
                        <Card >
                            <CardHeader>
                                <CardTitle>Hình ảnh sản phẩm</CardTitle>
                                <CardDescription>
                                    đây là hình ảnh sản phẩm, bạn có thể thay đổi giá trị
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-4 justify-center">
                                <Card className="max-w-[500px] md:w-full">
                                    <ImageDisplayID images={productId.imageResponses} />
                                </Card>
                            </CardContent>

                        </Card>

                        <Card >
                            <CardHeader>
                                <CardTitle>Chi tiết sản phẩm</CardTitle>
                                <CardDescription>
                                    đây là sản phẩm chi tiết, bạn có thể thay đổi giá trị
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Tên</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            value={productId?.name}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Mô tả</Label>
                                        <Textarea
                                            id="description"
                                            value={productId?.description}
                                            className="min-h-32"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Mã CODE</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            value={productId?.code}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Giá</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            value={productId?.price}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Kích thước</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            value={productId?.size}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="status">Trạng thái</Label>
                                        <Select
                                            value={productId?.isInProcessing ? "true" : "false"}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue>{productId?.isInProcessing ? "Đang xử lý" : "Chưa xử lý"}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Đang xử lý</SelectItem>
                                                <SelectItem value="false">Chưa xử lý</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button size="sm">Chỉnh sửa </Button>
                        </div>
                    </div>
                </div>
            </MyContext.Provider>
        </div >
    );
}
