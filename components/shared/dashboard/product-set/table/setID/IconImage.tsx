import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
import Image from "next/image";
import { useEffect, useState } from "react";

// Định nghĩa interface ImageResponse
interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}

// Định nghĩa interface cho props của IconImage
interface IconImageProps {
    pro: ImageResponse[];
}
export const IconImage: React.FC<IconImageProps> = ({ pro }) => {
    const [linkImages, setLinkImages] = useState<ImageResponse[]>([]);
    useEffect(() => {
        const getImage = async () => {
            const updatedImages = await Promise.all(
                pro.map(async (image: ImageResponse) => {
                    try {
                        const { data } = await filesApi.getFile(image.imageUrl);
                        return {
                            ...image,
                            imageUrl: data.data, 
                        };
                    } catch (error) {
                        return {
                            ...image,
                            imageUrl: "", 
                        };
                    }
                })
            );

            setLinkImages(updatedImages);
        }
        getImage();
    }, [pro]);
    const mainImage = linkImages.find(item => item.isMainImage === true);
    const src = mainImage ? mainImage.imageUrl : NoImage;
    return (
        <>
            <Image
                src={src}
                width={100}
                height={100}
                alt="Product Image"
                className="w-[50px] h-[50px] rounded-lg object-contain"
            />
        </>
    );
}