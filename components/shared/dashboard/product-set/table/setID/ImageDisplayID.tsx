import * as React from "react"
import { LogoSignIn } from '@/constants/images/index.js'

import { CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


import Image from "next/image"
import { Trash2 } from "lucide-react"

interface ImageDisplayProps {
    images: { imageUrl: string; isBluePrint: boolean; isMainImage: boolean }[];

}

const ImageDisplayID: React.FC<ImageDisplayProps> = ({
    images,
}) => {
    // console.log('images', images)
    return (
        <div className="flex items-center justify-center w-full h-full">
            {images && images.length > 0 ? (
                <Carousel className="flex flex-col w-full h-full">
                    <CarouselContent className="w-full h-full">
                        {images.map((image, index) => (
                            <CarouselItem
                                className=" w-full h-full flex items-center justify-center"
                                key={index}
                            >
                                <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                                    <Image
                                        src={image.imageUrl}
                                        alt={`image-${index}`}
                                        width={900}
                                        height={900}
                                        className="h-full w-full object-contain bg-cover bg-center bg-no-repeat pointer-events-none"
                                    />
                                </CardContent>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute left-[50%] bottom-[6%] transform translate-x-[-50%] translate-y-[50%]">
                        <CarouselNext />
                        <CarouselPrevious />
                    </div>
                </Carousel>
            ) : (
                <div className="text-center text-lg text-gray-500">No image</div>
            )}
        </div>

    );
}

export default ImageDisplayID;