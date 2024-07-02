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
import { SetUpdateForm } from "../../form/SetUpdateForm";
import { filesApi } from "@/apis/files.api";




export default function SetIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [setId, setSetId] = useState<any>([])
    const [setProduct, setSetProduct] = useState<any>([])
    const [open, setOpen] = useState<boolean>(false);
    const [linkImg, setLinkImg] = useState<string>('');

    useEffect(() => {
        const fetchDataProductId = async () => {
            setLoading(true);
            try {
                const res = await setApi.getSetId(params.id);
                const userData = res.data.data;
                setSetId(userData);
                setSetProduct(userData.setProducts);

                // Assuming userData.imageUrl contains the image file name or URL
                const { data } = await filesApi.getFile(userData.imageUrl);
                // Process data as needed, e.g., set state with image data

                setLinkImg(data.data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };


        fetchDataProductId()

    }, [params.id])

    console.log('linkImg', linkImg);
    // console.log('id setIdsetIdsetId', setId)
    // console.log('setProduct', setProduct)


    return (
        <div className="flex flex-col gap-6 justify-center">
            {/* <header className="">
                <div className="flex items-center gap-4 justify-between">
                    <Link href={'/dashboard/products/set'}>
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight ">
                        Đặt sản phẩm
                    </h1>
                    <div className=" items-center gap-2 md:ml-auto md:flex">
                        <SetUpdateForm setId={setId.id} />
                    </div>
                </div>
            </header> */}
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">

                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>Bộ sản phẩm chi tiết</CardTitle>
                                <SetUpdateForm setId={setId.id} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Mã Code</Label>
                                    <div className="border p-2 rounded-md border-gray-100">{setId?.code}</div>

                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Tên</Label>
                                    <div className="border p-2 rounded-md border-gray-100">{setId?.name}</div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <div className="border p-2 rounded-md border-gray-100">
                                        {setId?.description}
                                    </div>
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
                                {
                                    !loading ?
                                        (
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-contain"
                                                height={900}
                                                src={linkImg}
                                                width={900}
                                            />
                                        ) : (
                                            <div className="text-center flex flex-col justify-center items-center w-full ">
                                                <span className="loading loading-spinner loading-lg text-primary-backgroudPrimary "></span>
                                            </div>
                                        )
                                }

                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    );
}
