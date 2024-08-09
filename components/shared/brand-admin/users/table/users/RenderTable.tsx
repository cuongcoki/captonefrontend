"use client";

import { userApi } from "@/apis/user.api";
import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function RenderTableUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Employee[]>([]);
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userApi.getUserCompany(String(user.user?.companyId));
        res.data.data.map((item: any) => {
          item.firstName += " " + item.lastName;
          item.lastName = "";
        });
        setData(res.data.data);
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

  console.log("datadatadata", data);

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
