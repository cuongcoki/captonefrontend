import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"



import Image from "next/image"
import { Trash2} from "lucide-react"

interface ImageDisplayProps {
    images: string[];
    onDelete: (index: number) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
    images,
    onDelete,
}) => {
    // console.log('images', images)
    return (
        <div className="flex items-center justify-center w-full h-full ">
            <Carousel className="w-full h-full flex flex-col">
                <CarouselContent className="w-full h-full">

                    {images.map((image, index) => (
                        <CarouselItem className="w-full h-full flex items-center justify-center" key={index}>
                            <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                                <Image src={image} alt={`image-${index}`} width={500} height={500} className="h-full w-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none" />
                                <button type='button' className="absolute right-0 top-0 " onClick={() => onDelete(index)}>
                                    <Trash2 size={35} className="flex items-center justify-center text-primary-backgroudPrimary bg-white rounded-md p-2 m-5" />
                                </button>
                            </CardContent>
                        </CarouselItem>
                    ))}

                </CarouselContent>
            </Carousel>
        </div>

    );
}

export default ImageDisplay;