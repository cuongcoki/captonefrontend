'use client'
import { userApi } from "@/apis/user.api"
import { Employee, columns } from "./Column"
import { DataTable } from "./DataTable"
import { useEffect, useState } from "react";

// async function getData(): Promise<Employee[]> {
  
//   return [
//     {
//       id: "EMP001",
//       firstName: "John",
//       lastName: "Doe",
//       dob: "19/11/2002",
//       gender: "Male",
//       address: "123 Main Street, ",
//       salaryByDay: 100,
//       phone: "555-1234",
//       roleId: 1,
//       facilityID: 1,
//       isActive: true,
//     },


//     // ...
//   ]
// }

export default  function RenderTableUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState('');
  const [roleId, setRoleId] = useState<number>(1);
  const [isActive, setIsActive] = useState<any>(true);
  const [data,setData] = useState<any>([]);
  
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData =() =>{
    userApi.allUsers(roleId,value,isActive)
            .then(res => {
              setData(res.data.data.data);
            })
            .catch(error =>{
              console.error('Error fetching user data:', error);
            })
            .finally(() => {
              setLoading(false);
          })
  }

  return (
    <div className="px-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
