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

export type ProductUpdateType = {
  code: string;
  description: string;
  id: string;
  addImagesRequest: {
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
  }[];
  isInProcessing: boolean;
  name: string;
  price: number;
  size: string;
}