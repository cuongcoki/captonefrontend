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
import { filesApi } from "@/apis/files.api"

interface ImageDisplayProps {
    images: { imageUrl: string; isBluePrint: boolean; isMainImage: boolean }[];

}

const ImageDisplayID: React.FC<ImageDisplayProps> = ({
    images,
}) => {
    const [updatedImages, setUpdatedImages] = React.useState(images);

    React.useEffect(() => {
        const updateImageUrls = async (images: any[]) => {
            return await Promise.all(images.map(async (image: any) => {
                try {
                    const { data } = await filesApi.getFile(image.imageUrl);
                    return {
                        ...image,
                        imageUrl: data.data,
                    };
                } catch (error) {
                    console.error('Error getting file:', error);
                    return {
                        ...image,
                        imageUrl: '', // Handle error case if needed
                    };
                }
            }));
        };

        const fetchUpdatedImages = async () => {
            const newImages = await updateImageUrls(images);
            setUpdatedImages(newImages);
        };

        fetchUpdatedImages();
    }, [images]);
    // console.log('images', updatedImages)
    return (
        <div className="flex items-center justify-center w-full h-full">
            {updatedImages && updatedImages.length > 0 ? (
                <Carousel className="flex flex-col w-full h-full">
                    <CarouselContent >
                    {updatedImages.map((image, index) => (
                            <CarouselItem
                                className="w-full h-full flex items-center justify-center"
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