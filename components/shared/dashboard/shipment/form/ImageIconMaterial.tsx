
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
import { Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export type Material = {
    id: string
    name: string;
    description: string;
    unit: string;
    quantityPerUnit: number;
    image: string;
    quantityInStock: number;
}
interface ImageIconShipOrderProps {
    dataImage: Material;
}
export default function ImageIconMaterial({ dataImage }: ImageIconShipOrderProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleGotoPID = () => {
        window.open(`/dashboard/material/manager`, '_blank');
        setOpen(false);
    }
    const mainImage = dataImage.image
    return (
        <>
            {mainImage ? (
                <Popover modal={true} >
                    <PopoverTrigger className="cursor-pointer w-full h-full object-cover rounded-md"><Image src={mainImage} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" /></PopoverTrigger>
                    <PopoverContent align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium leading-none">Thông tin vật liệu</h4>
                                </div>
                            </div>
                            <Separator className="opacity-60" />
                            <div className="grid gap-2 text-sm">
                                    <div className="m-1 ">
                                        <div className="flex gap-2">
                                            <span className="font-light">Tên:</span>
                                            <span className="font-light">{dataImage.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-light">Mô tả:</span>
                                            <span className="font-light">{dataImage.description}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-light">Số lượng trên một đơn vị:</span>
                                            <span className="font-light">{dataImage.quantityPerUnit}</span>
                                        </div>
                                        <Separator className="opacity-60 mt-1" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <div className="flex gap-2 text-sm">
                                        <span className="font-light ">Sẵn có:</span>
                                        <span className="font-light text-primary">{dataImage.quantityInStock}</span>
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
                    <PopoverContent align="start">Place content for the popover here.</PopoverContent>
                </Popover>
            )
            }
        </>
    );
}