import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
import Image from "next/image";
import { useEffect, useState } from "react";


interface ImageIconShipOrderProps {
    dataImage: string;
}
export default function ImageIconShipOrderSet({ dataImage }: ImageIconShipOrderProps) {
    const [linkImages, setLinkImages] = useState<string>("");

    useEffect(() => {
        const getImage = async () => {
            filesApi.getFile(String(dataImage)).then((res) => {
                setLinkImages(res.data.data);
            });
        };

        getImage();
    }, [dataImage]);

    if (linkImages.length === 0) {
        return null;
    }

    return (
    <> 
         {linkImages ? (
               <Image src={linkImages === "Image_not_found" || !linkImages ? NoImage : linkImages} className="w-full h-full object-cover" width={900} height={900} alt="ảnh sản phẩm" />

            ) : (
                <Image src={ NoImage } className="w-full h-full object-cover" width={900} height={900} alt="ảnh sản phẩm" />
            )}
    </>
    );
}