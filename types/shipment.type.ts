export type Company = {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyType: any;
    companyTypeDescription: string;
};

export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    roleId: number;
    isActive: boolean;
    companyId: string;
    avatar: string;
    companyName: string;
};

export type Product = {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: Array<{
        id: string;
        imageUrl: string;
        isBluePrint: boolean;
        isMainImage: boolean;
    }>;
};

export type ShipmentDetailRequest = {
    itemId: string;
    phaseId: string;
    quantity: number;
    kindOfShip: number;
    productPhaseType: number;
};

export type Shipment = {
    fromId: string;
    toId: string;
    shipperId: string;
    shipDate: string;
    shipmentDetailRequests: ShipmentDetailRequest[];
};

export type Phase = {
    id: string;
    name: string;
    description: string;
};

export type PhasesResponse = {
    data: Phase[];
};
export interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}
export type Material = {
    id: string
    name: string;
    description: string;
    unit: string;
    quantityPerUnit: number;
    image: string;
    quantityInStock: number;
}



export interface Detail {
    product: Product;
    phase: Phase;
    material: Material;
    quantity: number;
    productPhaseType: number;
    productPhaseTypeDescription: string;
}



export interface Shipper {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    avatar: string;
    gender: string;
    dob: string;
    isActive: boolean;
    roleId: number;
    roleDescription: string;
    companyName: string;
    companyId: string;
}

export interface shipmentID {
    from: Company;
    to: Company;
    shipper: Shipper;
    shipDate: string;
    statusDescription: string;
    status: number;
    details: Detail[];
}