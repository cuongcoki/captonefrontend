import { NoImage } from "@/constants/images";
import Image from "next/image";

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

    const mainImage = dataImage.find(image => image.isMainImage);
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