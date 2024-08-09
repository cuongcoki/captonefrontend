import * as React from "react";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface ImageDisplayProps {
  images: any;
  onDelete: () => void;
}

const ImageDisplayAvatar: React.FC<ImageDisplayProps> = ({
  images,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full ">
      <Carousel className="w-full h-full flex flex-col">
        <CarouselContent className="w-full h-full">
          <CarouselItem className="w-full h-full flex items-center justify-center">
            <CardContent className="h-[250px] w-full relative flex  items-center justify-center p-1 bg-black">
              <Image
                src={images}
                alt={`ảnh bộ sp`}
                width={500}
                height={500}
                className=" w-full h-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none "
              />
              <button type="button" className="absolute right-0 top-0 ">
                <Trash2
                  size={35}
                  className="flex items-center justify-center text-primary-backgroudPrimary bg-white rounded-md p-2 m-5"
                  onClick={onDelete}
                />
              </button>
            </CardContent>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageDisplayAvatar;
