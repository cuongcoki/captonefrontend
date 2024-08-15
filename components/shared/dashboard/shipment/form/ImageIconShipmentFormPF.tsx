
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { NoImage } from "@/constants/images";
import Image from "next/image";
import { useState } from "react";
import { Package, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface DataProduct {
    code: string;
    description: string;
    id: string;
    image: string;
    isInProcessing: boolean;
    name: string;
    price: number;
    size: string;
    totalAvailableQuantity: number;
    totalQuantity: number;
}
interface ImageIconShipOrderProps {
    dataImage: DataProduct;
}



export default function ImageIconShipmentFormPF({ dataImage }: ImageIconShipOrderProps) {
    const [open, setOpen] = useState<boolean>(false);
    const handleGotoPID = () => {
        window.location.href = `/dashboard/products/product/${dataImage.id}`;
        setOpen(false);
    }
    // console.log("dataImage", dataImage)
    return (
        <>
            {dataImage ? (
                <Popover modal={true} >
                    <PopoverTrigger className="cursor-pointer w-full h-full object-cover rounded-md"><Image src={dataImage.image} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" /></PopoverTrigger>
                    <PopoverContent align="start">
                        <div className="grid gap-4 ">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium leading-none">Thông tin sản phẩm</h4>
                                </div>
                            </div>
                            <Separator className="opacity-60" />
                            <div className="grid gap-2">
                                <div className="m-1 ">
                                    <div className="flex gap-2">
                                        <span className="font-light">Tên:</span>
                                        <span className="font-light">{dataImage.name}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <span className="font-light">Kích thước:</span>
                                        <span className="font-light">{dataImage.size}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="font-light">Mô tả:</span>
                                        <span className="font-light">{dataImage.description}</span>
                                    </div>
                                    <Separator className="opacity-60 mt-1" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 text-sm">
                                        <span className="font-light ">SL trong kho:</span>
                                        <span className="font-light text-primary">{dataImage.totalQuantity}</span>
                                    </div>
                                    <span className="cursor-pointer flex items-center px-2 py-1 rounded-md text-white hover:bg-primary/90 bg-primary" onClick={handleGotoPID}>
                                        <Package className=" mr-1" /><span className="text-[15px]">Chi tiết</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover >
            ) : (
                <Popover>
                    <PopoverTrigger className="cursor-pointer w-full h-full object-cover rounded-md">  <Image src={NoImage} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" /></PopoverTrigger>
                    <PopoverContent align="start"></PopoverContent>
                </Popover>
            )
            }
        </>
    );
}