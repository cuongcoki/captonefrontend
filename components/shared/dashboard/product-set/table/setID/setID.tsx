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
                                        src="https://storage.googleapis.com/capston-storage/a89c9e4daaaf77c83e9345c4fc541355_b7b40ca45bfb59fb56f8fa58bc3f3189_image.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=capstone-storage%40capstone-426620.iam.gserviceaccount.com%2F20240622%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240622T063824Z&X-Goog-Expires=1800&X-Goog-SignedHeaders=host&X-Goog-Signature=217775b714bc0f8c31e5fabe9dd28378174fd15fb9f12acfdeaa364a99318cf5fe133130b43ab92789b00c0062c526f669f0b609401bc512a3eee144931eb061f92153667a4d9610de27448fd8c1d1f80264074dd56f988914a9f85a2d6cea692470d22e7a092809696a05496287f63496de36539964941e5428fe674e57abcb7b430bd56586fdab6330d0b235dcc0fd274a8f99f85027adb96dce58519dfd8a6de4d469672c1e32223b8a520c42cc75d16f856873442af51f1a6b3893ce6eeb78c239f79e67cb238252ad45149aa9304281ace8ef14d0a007576d10e41b5f79064e96544d6ff3d0b47d315b49cbb921ec2206fd9f2859209292001e639ca1d0"
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
