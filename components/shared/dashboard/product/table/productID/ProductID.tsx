'use client'

// ** import react
import Link from "next/link";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";


// ** import UI
import { Separator } from "@/components/ui/separator";
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

import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ** import api 
import { productApi } from "@/apis/product.api";

// ** import icon
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

// ** component 
import ImageDisplayID from "./ImageDisplayID";
import Image from "next/image";




export default function ProductIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [productId, setProductId] = useState<any>([])

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


    console.log('iddd product', productId)



    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">

            <div className="flex flex-col sm:gap-4 sm:py-4 ">

                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
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



                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">

                                <Card x-chunk="dashboard-07-chunk-1">
                                    <CardHeader>
                                        <CardTitle>Hình ảnh sản phẩm</CardTitle>
                                        <CardDescription>
                                            đây là hình ảnh sản phẩm, bạn có thể thay đổi giá trị
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            {/* <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="300"
                                                src="/placeholder.svg"
                                                width="300"
                                            /> */}
                                        <ImageDisplayID images={productId.imageResponses}/>
                                            {/* <div className="grid grid-cols-3 gap-2">
                                                <button>
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="84"
                                                        src="/placeholder.svg"
                                                        width="84"
                                                    />
                                                </button>
                                                <button>
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="84"
                                                        src="/placeholder.svg"
                                                        width="84"
                                                    />
                                                </button>
                                                <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                    <span className="sr-only">Upload</span>
                                                </button>
                                            </div> */}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card x-chunk="dashboard-07-chunk-0">
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
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-3">
                                    <CardHeader>
                                        <CardTitle>Trạng thái sản phẩm</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
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

                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:hidden">
                           
                            <Button size="sm">Chỉnh sửa </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
