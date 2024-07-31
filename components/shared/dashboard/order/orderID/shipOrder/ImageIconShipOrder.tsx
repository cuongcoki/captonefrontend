import { filesApi } from "@/apis/files.api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}

interface ImageIconShipOrderProps {
    dataImage: ImageResponse[] | undefined;
}
export default function ImageIconShipOrder({ dataImage }: ImageIconShipOrderProps) {
    const [linkImages, setLinkImages] = useState<ImageResponse[]>([]);

    useEffect(() => {
        const getImage = async () => {
            if (!dataImage || dataImage.length === 0) {
                return;
            }

            const updatedImages = await Promise.all(
                dataImage.map(async (image: ImageResponse) => {
                    try {
                        const { data } = await filesApi.getFile(image.imageUrl);
                        return {
                            ...image,
                            imageUrl: data.data, // Giả sử data.data là URL hình ảnh cập nhật
                        };
                    } catch (error) {
                        console.error("Error getting file:", error);
                        return {
                            ...image,
                            imageUrl: "", // Xử lý trường hợp lỗi nếu cần
                        };
                    }
                })
            );

            setLinkImages(updatedImages);
        };

        getImage();
    }, [dataImage]);

    if (linkImages.length === 0) {
        return null;
    }

    const mainImage = linkImages.find(image => image.isMainImage);
    // console.log("mainImage",mainImage)
    return (
    <> 
         {mainImage ? (
               <Image src={mainImage.imageUrl} className="w-full h-full object-cover "  width={900} height={900} alt="ảnh sản phẩm" />
            ) : (
                <Image src={linkImages[0].imageUrl} className="w-full h-full object-cover" width={900} height={900} alt="ảnh sản phẩm" />
            )}
    </>
    );
}