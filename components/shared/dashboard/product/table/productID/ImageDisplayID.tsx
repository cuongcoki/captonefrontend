import * as React from "react";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";
import { filesApi } from "@/apis/files.api";

interface ImageDisplayProps {
  images: { imageUrl: string; isBluePrint: boolean; isMainImage: boolean }[];
}

const ImageDisplayID: React.FC<ImageDisplayProps> = ({ images }) => {
  const [updatedImages, setUpdatedImages] = React.useState(images);
  const [loading, setLoading] = React.useState(true);
  // React.useEffect(() => {
  //   const updateImageUrls = async (images: any[]) => {
  //     return await Promise.all(
  //       images.map(async (image: any) => {
  //         try {
  //           const { data } = await filesApi.getFile(image.imageUrl);
  //           return {
  //             ...image,
  //             imageUrl: data.data,
  //           };
  //         } catch (error) {
  //           return {
  //             ...image,
  //             imageUrl: "", 
  //           };
  //         }
  //       })
  //     );
  //   };

  //   const fetchUpdatedImages = async () => {
  //     try {
  //       const newImages = await updateImageUrls(images);
  //       setUpdatedImages(newImages);
  //     } catch (error) {
  //     } finally {
  //       setLoading(false); 
  //     }
  //   };

  //   fetchUpdatedImages();
  // }, [images]);
  return (
    <div className="flex items-center justify-center w-full h-full">
      {images && images.length > 0 ? (
        <Carousel className="flex flex-col w-full max-w-sm h-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                className="w-full h-full flex items-center justify-center"
                key={index}
              >
                <CardContent className="w-full h-full relative flex aspect-square items-center justify-center p-6 bg-black">
                  <Image
                    src={image.imageUrl}
                    alt={`image-${index}`}
                    width={2000}
                    height={2000}
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
        <div className="text-center text-lg text-gray-500 h-[500px] w-full flex flex-col justify-center items-center">
          {loading ? (
            <span>Không có hình ảnh</span>
          ) : (
            <span className="loading loading-spinner loading-lg text-primary-backgroudPrimary"></span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDisplayID;
