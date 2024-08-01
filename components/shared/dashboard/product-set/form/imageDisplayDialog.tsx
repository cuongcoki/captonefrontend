import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { NoImage } from "@/constants/images"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    // console.log("imagesdi", images);
    const handleGotoPID = ()=>{
        window.location.href = `/dashboard/products/product/${images.id}`;
        
    }
    return (
        <Dialog>
            <DialogTrigger className="w-[60px] h-[60px] bg-primary-backgroudPrimary rounded-md">
                <Image src={String(images.imageUrl === "Image_not_found" ? NoImage : images.imageUrl)} width={900} height={900} className=" w-full h-full object-cover rounded-md" alt="Ảnh mãu sản phẩm" />
            </DialogTrigger>
            <DialogContent className="md:max-w-[50%] w-full">
                <HoverCard>
                    <HoverCardTrigger>
                      Chi tiết
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <div className="max-w-sm mx-auto">
                            <div className="mb-2 text-start">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={images.name}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div className="mb-2 text-start">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Mã sản phẩm
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={images.code}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div className="mb-2 text-start">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Mô tả
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    placeholder={images.description}
                                    disabled
                                    readOnly
                                />
                            </div>
                            <div className="flex items-end justify-end">
                                        <span className="cursor-pointer flex items-center px-2 py-1 rounded-md text-white hover:bg-primary/90 bg-primary" onClick={handleGotoPID}>
                                            <Package className=" mr-1" /><span className="text-[15px]">Chi tiết</span>
                                        </span>
                                </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <Carousel className="w-full h-full ">
                    <CarouselContent className="w-full h-full">
                        {/* {images.map((image, index) => ( */}
                        <CarouselItem className="w-full h-full flex items-center justify-center" >
                            <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                                <Image src={String(images.imageUrl === "Image_not_found" ? NoImage : images.imageUrl)} alt={`image-`} width={500} height={500} className="h-full w-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none" />
                                {/* <button type='button' className="absolute right-0 top-0 ">
                                        <Card className="flex flex-col items-start p-2 m-2">
                                            {
                                                image.isMainImage ? (<span className="text-lg ">Ảnh chính</span>) : ('')

                                            }
                                            {
                                                image.isBluePrint ? (<span className="text-lg ">Mẫu</span>) : ('')
                                            }
                                        </Card>
                                    </button> */}
                            </CardContent>
                        </CarouselItem>
                        {/* ))} */}
                    </CarouselContent>
                    <div className="  absolute left-[50%] bottom-[6%] transform: translate-x-[50%] transform: translate-y-[50%]">
                        <CarouselNext />
                        <CarouselPrevious />
                    </div>
                </Carousel>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDisplayDialog;
