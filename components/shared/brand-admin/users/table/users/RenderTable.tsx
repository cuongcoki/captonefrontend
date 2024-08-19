"use client";

import { userApi } from "@/apis/user.api";
import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { filesApi } from "@/apis/files.api";

export default function RenderTableUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Employee[]>([]);
  const user = useAuth();
  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userApi.getUserCompany(String(user.user?.companyId));
        const updatedData = await Promise.all(
          res.data.data.map(async (item: any) => {
            // Nối họ và tên lại
            item.firstName += " " + item.lastName;
            item.lastName = "";

            // Gọi API để lấy avatar mới và cập nhật lại item.avatar
            if (item.avatar) {
              try {
                const fileResponse = await filesApi.getFile(item.avatar);
                item.avatar = fileResponse.data.data; 
              } catch (fileError) {
             
              }
            }

            return item;
          })
        );

        setData(updatedData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.user?.companyId) {
      fetchData();
    }
  }, [user]);



  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
