"use client";

import { userApi } from "@/apis/user.api";
import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./data-table-pagination";
import { useEffect, useState, createContext } from "react";

import { UserSearchParams } from "@/types/userTypes";
import TableUserFeature from "@/components/shared/dashboard/users/table/users/user-table-feature";
import toast from "react-hot-toast";
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
