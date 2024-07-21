import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
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
    dataImage: ImageResponse[] ;
}
export default function ImageIconShipment({ dataImage }: ImageIconShipOrderProps) {
    const [linkImages, setLinkImages] = useState<ImageResponse[]>([]);
    console.log('dataImage', dataImage)
    // useEffect(() => {
    //     const getImage = async () => {
    //         if (!dataImage || dataImage.length === 0) {
    //             return;
    //         }

    //         const updatedImages = await Promise.all(
    //             dataImage.map(async (image: ImageResponse) => {
    //                 try {
    //                     const { data } = await filesApi.getFile(image.imageUrl);
    //                     return {
    //                         ...image,
    //                         imageUrl: data.data, // Giả sử data.data là URL hình ảnh cập nhật
    //                     };
    //                 } catch (error) {
    //                     console.error("Error getting file:", error);
    //                     return {
    //                         ...image,
    //                         imageUrl: "", // Xử lý trường hợp lỗi nếu cần
    //                     };
    //                 }
    //             })
    //         );

    //         setLinkImages(updatedImages);
    //     };

    //     getImage();
    // }, [dataImage]);

    // if (linkImages.length === 0) {
    //     return null;
    // }

    const mainImage = dataImage.find(image => image.isMainImage);
    // console.log("mainImage",mainImage)
    return (
        <>
            {mainImage ? (
                <Image src={mainImage.imageUrl} className="w-full h-full object-cover " width={900} height={900} alt="ảnh sản phẩm" />
            ) : (
                <Image src={NoImage} className="w-full h-full object-cover" width={900} height={900} alt="ảnh sản phẩm" />
            )}
        </>
    );
}