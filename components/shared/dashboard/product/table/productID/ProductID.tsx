'use client'

// ** import react
import Link from "next/link";
import Image from "next/image";

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";


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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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

import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ** import api 
import { productApi } from "@/apis/product.api";

// ** import icon
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

// ** component 
import ImageDisplayID from "./ImageDisplayID";
import { ProductUpdateForm } from "../../form/ProductUpdateForm";




export default function ProductIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [productId, setProductId] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false);

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

    }, [params.id])


    // console.log('iddd product', productId)



    return (
        <div className="flex flex-col gap-6 justify-center">
            <header className="">

                <div className="flex items-center gap-4 justify-between">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Sản phẩm
                    </h1>

                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button size="sm">Chỉnh sửa</Button>
                    </div>
                </div>
            </header >

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
                                    <Select>
                                        <SelectTrigger id="status" aria-label="Select status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
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
        </div >
    );
}
