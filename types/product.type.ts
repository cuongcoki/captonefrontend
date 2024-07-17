export type ProductType = {
  code: string;
  priceFinished: number;
  pricePhase1: number;
  pricePhase2: number;
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
  priceFinished: number;
  pricePhase1: number;
  pricePhase2: number;
  size: string;
}

export type ProductSearchParams = {
  isInProcessing: string;
  pageIndex: number;
  pageSize: number;
  searchTearm: string;
};