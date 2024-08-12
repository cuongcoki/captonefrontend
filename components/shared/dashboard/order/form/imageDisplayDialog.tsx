import Image from "next/image";
import React from "react";
import { NoImage } from "@/constants/images"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";


interface dataProduct {
    availableQuantity: number;
    brokenAvailableQuantity: number;
    brokenQuantity: number;
    code: string;
    companyId: string;
    description: string;
    errorAvailableQuantity: number;
    errorQuantity: number;
    failureAvailableQuantity: number;
    failureQuantity: number;
    id: string;
    imageUrl: string;
    isInProcessing: boolean;
    name: string;
    phaseId: string;
    price: number;
    quantity: number;
    size: string;
}
interface ImageDisplayProps {
    images: dataProduct;
    checkProduct: any;
}

const data = [
    { id: 0, status: 'hỏng', quantityAvailable: 'Số lượng có sẵn', quantity: 'Số lượng' },
    { id: 1, status: 'lỗi', quantityAvailable: 'Số lượng có sẵn', quantity: 'Số lượng' },
    { id: 2, status: 'thất bại', quantityAvailable: 'Số lượng có sẵn', quantity: 'Số lượng' },
];

const ImageDisplayDialog: React.FC<ImageDisplayProps> = ({ images, checkProduct }) => {
    const handleGotoPID = () => {
        if (checkProduct === 0) {
            window.location.href = `/dashboard/products/product/${images.id}`;
        } else {
            window.location.href = `/dashboard/products/set/${images.id}`;
        }
    }
    // console.log("images", images)
    const statusOrder = ['hỏng', 'lỗi', 'thất bại'];
    return (
        <Popover modal={true} >
            <PopoverTrigger className=" h-[90px] bg-primary-backgroudPrimary rounded-md"> <Image src={String(images.imageUrl === "Image_not_found" ? NoImage : images.imageUrl)} width={900} height={900} className=" w-full h-full object-cover rounded-md" alt="Ảnh mãu sản phẩm" />
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
                                {data
                                    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
                                    .map((item, index) => (
                                        <div key={index} className="m-1 ">
                                            <h2 className="text-[15px] text-primary">Sản phẩm {item.status}</h2>
                                            <div className="flex gap-2">
                                                <span className="font-light">{item.quantityAvailable}:</span>
                                                <span className="font-light">
                                                    {item.id === 0
                                                        ? images.brokenAvailableQuantity
                                                        : item.id === 1
                                                            ? images.errorAvailableQuantity
                                                            : item.id === 2
                                                                ? images.failureAvailableQuantity
                                                                : null}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="font-light">{item.quantity}:</span>
                                                <span className="font-light">
                                                    {item.id === 0
                                                        ? images.brokenQuantity
                                                        : item.id === 1
                                                            ? images.errorQuantity
                                                            : item.id === 2
                                                                ? images.failureQuantity
                                                                : null}
                                                </span>
                                            </div>
                                            <Separator className="opacity-60 mt-1" />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 text-sm">
                                    <span className="font-light ">Sẵn có:</span>
                                    <span className="font-light text-primary">{images.availableQuantity}</span>
                                </div>
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
