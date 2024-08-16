import Image from "next/image";
import React from "react";
import { NoImage } from "@/constants/images"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface dataProduct {
    code: string;
    description: string;
    id: string;
    image: string;
    isInProcessing: boolean;
    name: string;
    price: number;
    size: string;
}
interface ImageDisplayProps {
    images: dataProduct;
    checkProduct: any;
}

const ImageDisplayDialog: React.FC<ImageDisplayProps> = ({ images, checkProduct }) => {
    const handleGotoPID = () => {
        if (checkProduct === 0) {
            window.location.href = `/dashboard/products/product/${images.id}`;
        } else {
            window.location.href = `/dashboard/products/set/${images.id}`;
        }
    }
    // console.log("images", images)
    return (
        <Popover modal={true} >
            <PopoverTrigger className=" h-[90px] bg-primary-backgroudPrimary rounded-md"> <Image src={String(images.image === "Image_not_found" ? NoImage : images.image)} width={900} height={900} className=" w-full h-full object-cover rounded-md" alt="Ảnh mãu sản phẩm" />
            </PopoverTrigger>
            <PopoverContent align="start">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium leading-none">Thông tin sản phẩm</h4>
                        </div>
                    </div>
                    <Separator className="opacity-60" />
                    <div className="grid gap-4 ">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium leading-none">Thông tin sản phẩm</h4>
                            </div>
                        </div>
                        <Separator className="opacity-60" />
                        <div className="grid gap-2">
                            <div className="flex flex-col w-full text-sm">
                                <span className="font-light ">Mô tả:</span>
                                <span className="font-light text-primary">{images.description}</span>
                            </div>
                            <div className="flex items-center justify-between">

                                <span className="cursor-pointer flex items-center px-2 py-1 rounded-md text-white hover:bg-primary/90 bg-primary" onClick={handleGotoPID}>
                                    <Package className=" mr-1" /><span className="text-[15px]">Chi tiết</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover >
    );
};

export default ImageDisplayDialog;
