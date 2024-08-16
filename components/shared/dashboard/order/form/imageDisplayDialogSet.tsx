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

type ImageResponse = {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
};

type Product = {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: ImageResponse[];
};

type SetProduct = {
    setId: string;
    productId: string;
    quantity: number;
    product: Product;
};

type ProductSet = {
    id: string;
    code: string;
    name: string;
    imageUrl: string;
    description: string;
    setProducts: SetProduct[];
};
interface ImageDisplayProps {
    images: ProductSet;
    checkProduct: any;
}

const ImageDisplayDialogSet: React.FC<ImageDisplayProps> = ({ images, checkProduct }) => {
    const handleGotoPID = () => {
        if (checkProduct === 0) {
            window.location.href = `/dashboard/products/product/${images.id}`;
        } else {
            window.location.href = `/dashboard/products/set/${images.id}`;
        }
    }
    // console.log("images", images)
    const numberOfProducts = images.setProducts.length;
    return (
        <Popover modal={true} >
            <PopoverTrigger className="h-[90px] bg-primary-backgroudPrimary rounded-md"> <Image src={String(images.imageUrl === "Image_not_found" ? NoImage : images.imageUrl)} width={900} height={900} className=" w-full h-full object-cover rounded-md" alt="Ảnh mãu sản phẩm" />
            </PopoverTrigger>
            <PopoverContent align="start">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium leading-none">Thông tin bộ sản phẩm</h4>
                        </div>
                    </div>
                    <Separator className="opacity-60" />
                    <div className="grid gap-4 ">
                        <div className="grid gap-2">
                            <div className="flex flex-col w-full text-sm">
                                Gồm có {numberOfProducts} sản phẩm
                            </div>
                            <div className="flex  justify-end">
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

export default ImageDisplayDialogSet;
