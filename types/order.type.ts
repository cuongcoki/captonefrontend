export type OrderType = {
    companyId:string,
    status:string,
    startOrder:string,
    endOrder:string,
  };
  
  export type OrderDetialsType = {
    orderId:string,
    orderDetailRequests:orderDetailRequests[]
  };

  export type orderDetailRequests ={
    productIdOrSetId: string,
    quantity:number,
    unitPrice:20,
    isProductId:boolean,
  }

 