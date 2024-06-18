export type ProductType = {
    code: string;
    price: number;
    size: string;
    description: string;
    name: string;
    imageRequests: ImageRequestType[];
  };
  
  export type ImageRequestType = {
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
  };