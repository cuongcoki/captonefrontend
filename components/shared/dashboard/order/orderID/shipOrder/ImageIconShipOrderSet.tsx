import { filesApi } from "@/apis/files.api";
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
               <Image src={linkImages} className="w-full h-full object-cover "  width={900} height={900} alt="ảnh sản phẩm" />
            ) : (
                <Image src={linkImages} className="w-full h-full object-cover" width={900} height={900} alt="ảnh sản phẩm" />
            )}
    </>
    );
}