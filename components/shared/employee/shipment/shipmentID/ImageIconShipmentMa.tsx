import { NoImage } from "@/constants/images";
import Image from "next/image";

interface ImageIconShipOrderProps {
    dataImage: string
}

export default function ImageIconShipmentMa({ dataImage }: ImageIconShipOrderProps) {
 
    return (
        <>
            {
                dataImage ?(
                    <Image src={dataImage} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" />
                ):(
                    <Image src={NoImage} className="w-full h-full object-cover rounded-md" width={900} height={900} alt="ảnh sản phẩm" />
                )
            }
        </>
    );
}