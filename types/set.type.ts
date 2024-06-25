export type SetType = {
    code: string;
    description: string;
    name: string;
    imageUrl: string;
    setProductsRequest:ProductsRequest[]
  };

  export type ProductsRequest ={
    productId:string;
    quantity: number
  }

  export type SetUpdateType = {
    setId: string;
    code: string;
    name: string; 
    description: string;
    imageUrl: string;
    add:{
      productId: string,
      quantity: number,
    }[];
    update:{
      productId: string,
      quantity: number,
    }[];
    
  }
  