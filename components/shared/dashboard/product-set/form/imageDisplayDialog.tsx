import React from "react";
import { NoImage } from "@/constants/images"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface Product {
    code: string;
    description: string;
    id: string;
    imageUrl: string;
    isInProcessing: boolean;
    name: string;
    price: number;
    size: string;
}
interface ImageDisplayProps {
    images: Product;
}

const ImageDisplayDialog: React.FC<ImageDisplayProps> = ({ images }) => {
    const handleGotoPID = ()=>{
        window.location.href = `/dashboard/products/product/${images.id}`;
        
    }
    return (
        <Popover modal={true} >
        <PopoverTrigger className="w-[60px] h-[60px] bg-primary-backgroudPrimary rounded-md"> <Image src={String(images.imageUrl === "Image_not_found" ? NoImage : images.imageUrl)} width={900} height={900} className=" w-full h-full object-cover rounded-md" alt="Ảnh mãu sản phẩm" />
        </PopoverTrigger>
        <PopoverContent align="start">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium leading-none">Thông tin sản phẩm</h4>
                    </div>
                </div>
                <Separator className="opacity-60" />
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">CODE</Label>
                        <Input
                            id="width"
                            defaultValue={images.code}
                            className="col-span-2 h-8"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Tên sp</Label>
                        <Input
                            id="maxWidth"
                            defaultValue={images.name}
                            className="col-span-2 h-8"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Kích cỡ</Label>
                        <Input
                            id="height"
                            defaultValue={images.size}
                            className="col-span-2 h-8"
                            readOnly
                        />
                    </div>
                    <div className="flex items-end justify-end">
                        <span className="cursor-pointer flex items-center px-2 py-1 rounded-md text-white hover:bg-primary/90 bg-primary" onClick={handleGotoPID}>
                            <Package className=" mr-1" /><span className="text-[15px]">Chi tiết</span>
                        </span>
                    </div>
                </div>
            </div>
        </PopoverContent>
        </Popover >
    );
};

export default ImageDisplayDialog;
