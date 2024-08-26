"use client";

import { useEffect, useState, createContext } from "react";

import { Employee, columns } from "./Column";
import { DataTable } from "./DataTable";
import { DataTablePagination } from "./data-table-pagination";
import { UsersForm } from "../../form/UsersForm";
import { UserSearchParams } from "@/types/userTypes";
import TableUserFeature from "@/components/shared/dashboard/users/table/users/user-table-feature";

import { roleApi } from "@/apis/roles.api";
import { userApi } from "@/apis/user.api";

type Props = {
  searchParams: UserSearchParams;
};
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = createContext<ContexType>({
  forceUpdate: () => {},
});

export default function RenderTableUsers({ searchParams }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(11);

  const [force, setForce] = useState<number>(1);
  const forceUpdate = () => setForce((prev) => prev + 1);

  const [roles, setRoles] = useState<
    Array<{
      roleName: string;
      description: string;
      id: string;
    }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const fetchRoleData = () => {
        roleApi
          .getAllRoles()
          .then(({ data }) => {
            setRoles(data.data);
          })
          .catch((error) => {})
          .finally(() => {
            setLoading(false);
          });
      };
      fetchRoleData();
      try {
        const res = await userApi.allUsers(
          searchParams.roleId ?? 1,
          searchParams.searchTearm ?? "",
          searchParams.isActive == "false" ? "false" : "true",
          currentPage,
          pageSize
        );
        setData(res.data.data.data);
        setCurrentPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
        // console.log("Response:", res);
      } catch (error: any) {
        if (
          error?.response.data.status === 404 ||
          error?.response.data.status === 400
        ) {
          setData([]);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, currentPage, pageSize, force, roles]);

  const setCurrendPageToOne = () => {
    setCurrentPage(1);
  };

  // console.log("data",data)

  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <MyContext.Provider value={{ forceUpdate }}>
            <TableUserFeature
              searchOptions={searchParams}
              roles={roles}
              setCurrentPageToOne={setCurrendPageToOne}
            />
          </MyContext.Provider>
        </div>

        <MyContext.Provider value={{ forceUpdate }}>
          <div className="w-full md:w-auto">
            <div className="flex items-center justify-end p-3">
              <div className="flex items-center space-x-2">
                <UsersForm />
              </div>
            </div>
          </div>
        </MyContext.Provider>
      </div>
      <MyContext.Provider value={{ forceUpdate }}>
        <>
          <DataTable columns={columns} data={data} />
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      </MyContext.Provider>

      {/* <div className="w-full dark:bg-black bg-white py-3 md:hidden"></div> */}
    </div>
  );
}
