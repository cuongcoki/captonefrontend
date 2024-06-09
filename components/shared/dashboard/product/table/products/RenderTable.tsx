// 'use client'
import { userApi } from "@/apis/user.api"
import { Product, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState } from "react";

async function getData(): Promise<Product[]> {
  
  return [
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },
    {
      productID: "P000023321",
      productName: "LEGO",
      Code: "P012343224he163213fpt",
      productPrice: 1000000000,
      isGroup: "Male",
      size: "123 Main Street, ",
      description: "123 Main Street, ",
      createdBy: "555-1234",
    },


    // ...
  ]
}

export default  async function RenderTableProduct() {
  // const [loading, setLoading] = useState<boolean>(false);
  // const [value, setValue] = useState('');
  // const [roleId, setRoleId] = useState<number>(1);
  // const [isActive, setIsActive] = useState<any>(true);
  // const [data,setData] = useState<any>([]);
  
  // useEffect(() => {
  //   fetchData()
  // }, [])
  // const fetchData =() =>{
  //   userApi.allUsers(roleId,value,isActive)
  //           .then(res => {
  //             setData(res.data.data.data);
  //           })
  //           .catch(error =>{
  //             console.error('Error fetching user data:', error);
  //           })
  //           .finally(() => {
  //             setLoading(false);
  //         })
  // }

  const data = await getData();
  return (
    <div className="px-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
