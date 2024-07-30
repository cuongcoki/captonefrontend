import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
import Image from "next/image";
import { useEffect, useState } from "react";


interface ImageIconShipOrderProps {
    dataImage: string
}

export default function ImageIconShipmentMa({ dataImage }: ImageIconShipOrderProps) {
    // const [linkImages, setLinkImages] = useState<string>();
    // console.log('dataImageMA', dataImage)
    // useEffect(() => {
    //     const getImage = async () => {
    //         if (!dataImage || dataImage.length === 0) {
    //             return;
    //         }
    //         try {
    //             const { data } = await filesApi.getFile(dataImage);
    //             setLinkImages(data.data);
    //         } catch (error) {
    //             console.error('Error fetching image:', error);
    //         }
    //     };

    //     getImage();
    // }, [dataImage,linkImages]);
    // console.log("linkImageslinkImages",linkImages)
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