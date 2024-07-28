
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { NoImage } from "@/constants/images";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface dataProduct {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: Array<{
        id: string;
        imageUrl: string;
        isBluePrint: boolean;
        isMainImage: boolean;
    }>;
}
interface ImageIconShipOrderProps {
    dataImage: dataProduct;
}
export default function ImageIconShipmentForm({ dataImage }: ImageIconShipOrderProps) {
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };
    const handleGotoPID = ()=>{
        window.location.href = `/dashboard/products/product/${dataImage.id}`;
        setOpen(false);
    }
    const mainImage = dataImage.imageResponses.find(image => image.isMainImage);
    // console.log("mainImage",mainImage)
    return (
        <>
            {mainImage ? (
                <Popover modal={true} >
                    <PopoverTrigger className="cursor-pointer w-full h-full object-cover rounded-md"><Image src={mainImage.imageUrl} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" /></PopoverTrigger>
                    <PopoverContent align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium leading-none">Thông tin sản phẩm</h4>
                                </div>
                            </div>
                            <Separator className="opacity-60"/>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">CODE</Label>
                                    <Input
                                        id="width"
                                        defaultValue={dataImage.code}
                                        className="col-span-2 h-8"
                                        readOnly
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxWidth">Tên sp</Label>
                                    <Input
                                        id="maxWidth"
                                        defaultValue={dataImage.name}
                                        className="col-span-2 h-8"
                                        readOnly
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="height">Kích cỡ</Label>
                                    <Input
                                        id="height"
                                        defaultValue={dataImage.size}
                                        className="col-span-2 h-8"
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-end justify-end">
                                    {/* <Link href={`/dashboard/products/product/${dataImage.id}`}> */}
                                        <span className="cursor-pointer flex items-center px-2 py-1 rounded-md text-white hover:bg-primary/90 bg-primary" onClick={handleGotoPID}>
                                            <Package className=" mr-1" /><span className="text-[15px]">Chi tiết</span>
                                        </span>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover >
            ) : (
                <Popover>
                    <PopoverTrigger className="cursor-pointer w-full h-full object-cover rounded-md">  <Image src={NoImage} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" /></PopoverTrigger>
                    <PopoverContent align="start">Place content for the popover here.</PopoverContent>
                </Popover>
            )
            }
        </>
    );
}