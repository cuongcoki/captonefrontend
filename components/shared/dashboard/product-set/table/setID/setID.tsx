'use client'

// ** import react
import Link from "next/link";
import Image from "next/image";

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";


// ** import UI
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { Textarea } from "@/components/ui/textarea"

// ** import api 
import { setApi } from "@/apis/set.api";

// ** import icon
import {
    ChevronLeft,

} from "lucide-react"
// ** component 
import SetProduct from "./setProduct";




export default function SetIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [setId, setSetId] = useState<any>([])
    const [setProduct, setSetProduct] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {

        const fetchDataProductId = () => {
            setLoading(true);
            setApi.getSetId(params.id)
                .then(res => {
                    const userData = res.data.data;
                    setSetId(userData);
                    setSetProduct(userData.setProducts);
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


    console.log('id setIdsetIdsetId', setId)
    console.log('setProduct', setProduct)


    return (
        <div className="flex flex-col gap-6 justify-center">
                <header className="">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Đặt sản phẩm</h1>
                        {/* <Badge variant="outline" className="ml-auto sm:ml-0">In stock</Badge> */}
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button size="sm">chỉnh sửa</Button>
                        </div>
                    </div>
                </header>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">

                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Đặt sản phẩm chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Mã Code</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            defaultValue={setId?.code}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Tên</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="w-full"
                                            defaultValue={setId?.name}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Mô tả</Label>
                                        <Textarea
                                            id="description"
                                            className="min-h-32"
                                            defaultValue={setId?.description}

                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <SetProduct setProduct={setProduct} />
                    </div>

                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                            <CardHeader>
                                <CardTitle>Ảnh đặt sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <Image
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="300"
                                        src="https://storage.googleapis.com/capston-storage/cuong.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=capstone-storage%40capstone-426620.iam.gserviceaccount.com%2F20240622%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240622T025242Z&X-Goog-Expires=1800&X-Goog-SignedHeaders=host&X-Goog-Signature=73506e605c1f8db7716b00f9da3fa31f1e806b1845b75b3c2aecbd492c705a3f963b65afa7c3866c537b87d3c47cdf029fc558017f5bec389c65ae86d46b1ff5d9cf82d4e12f1483d14fc5f0a7f666e60d647a90eaa844f75b4bcb2037119f1971bbf6b32c1aa62ceb7fb871a287fecab1aa5407575e5f36272e0a84a4e028f3da556df61612e472a053838e5f46124a6a68d4b96f6e6331880d56df02d9eb870bcf8670ebe9844454a9e6ef9ef1ec1f0365d1d30801d1d796d25da77181cacfeb08b3a8ab80595e255b0b0ab5918690ca640ddac734fb339df8880fe3c8ff69fdd6995f486fd23fa49a585da33f3f1c1c2f55dac16344d2672d42a428a05508"
                                        width="300"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button size="sm">Chỉnh sửa</Button>
                </div>
        </div>
    );
}
