import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { NoImage } from "@/constants/images"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Trash2 } from "lucide-react";

interface ImageDisplayProps {
    images: string;
}

const ImageDisplayDialog: React.FC<ImageDisplayProps> = ({ images }) => {
    console.log("imagesdi", images);

    return (
        <Dialog>
            <DialogTrigger className="w-[100px] h-[100px] bg-primary-backgroudPrimary ">
                <Image src={images === "Image_not_found" ? NoImage : images} width={900} height={900} className=" w-full h-full object-cover" alt="Ảnh mãu sản phẩm" />
            </DialogTrigger>
            <DialogContent className="md:max-w-[50%] w-full">
                <Carousel className="w-full h-full ">
                    <CarouselContent className="w-full h-full">
                        {/* {images.map((image, index) => ( */}
                            <CarouselItem className="w-full h-full flex items-center justify-center" >
                                <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                                    <Image src={images === "Image_not_found" ? NoImage : images} alt={`image-`} width={500} height={500} className="h-full w-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none" />
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
