import * as React from "react"
import { LogoSignIn } from '@/constants/images/index.js'

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"



import { Switch } from "@/components/ui/switch"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import Image from "next/image"
import { Trash2, EllipsisVertical } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ImageDisplayProps {
    images: {id:string, imageUrl: string; isBluePrint: boolean; isMainImage: boolean }[];
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
    images,
}) => {
    // console.log('images', images)
    return (
        <div className="flex items-center justify-center aspect-square ">
            <Carousel className="w-full h-full flex flex-col">
                <CarouselContent >
                    {images.map((image, index) => (
                        <CarouselItem className="w-full h-full flex items-center justify-center" key={index}>
                            <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                                <Image src={image.imageUrl} alt={`image-${index}`} width={500} height={500} className="h-full w-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none" />
                            
                            </CardContent>
                        </CarouselItem>
                    ))}


                </CarouselContent>
                <div className="  absolute left-[50%] bottom-[6%] transform: translate-x-[50%] transform: translate-y-[50%]">
                    <CarouselNext />
                    <CarouselPrevious />
                </div>
            </Carousel>
        </div>

    );
}

export default ImageDisplay;