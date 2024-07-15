"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { salaryStore } from "@/components/shared/dashboard/salary/salary-store";
import { SalaryType, SearchSalaryParams } from "@/types/salary.type";
import Image from "next/image";
import { companyApi } from "@/apis/company.api";
import HeaderComponent from "@/components/shared/common/header";
const fakeApi = ({ searchParams }: SearchSalaryParams) => {
  return new Promise<{ data: { data: SalaryType[]; totalPages: number } }>(
    (resolve) => {
      setTimeout(() => {
        const data = {
          data: [
            {
              salaryId: "12345",
              userId: "123456789012",
              fullName: "John Doe",
              avatar:
                "https://top10tphcm.com/wp-content/uploads/2023/02/gai-dep-nhat-viet-nam-6.jpg",
              companyId: "c1",
              companyName: "Company A",
              salary: 5000,
            },
            {
              salaryId: "2",
              userId: "u2",
              fullName: "Jane Smith",
              avatar:
                "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-con-gai-1-1.jpg",
              companyId: "c2",
              companyName: "Company B",
              salary: 6000,
            },
          ],
          totalPages: 1,
        };
        resolve({ data });
      }, 100); // Delay for 1 second to simulate network request
    }
  );
};
const dataNow = new Date();
const yearNow = dataNow.getFullYear();
const listYear = [yearNow, yearNow - 1, yearNow - 2, yearNow - 3];
const listMonth = [
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
  { value: "6", label: "Tháng 6" },
  { value: "7", label: "Tháng 7" },
  { value: "8", label: "Tháng 8" },
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

export default function SalaryTable({ searchParams }: SearchSalaryParams) {
  const { tableData, setTableData, companyData, setCompanyData } =
    salaryStore();
  const [params, setParams] = useState(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const [totalPage, setTotalPage] = useState(0);

  const formatCurrency = (value: any) => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g).join(".");

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };

  useEffect(() => {
    let companyId = "";
    const fetchGetCompanies = async () => {
      if (companyData.length > 0) return;
      try {
        const res = await companyApi.getCompanyByType(0);
        setCompanyData(res.data.data);
        if (companyId == "") {
          companyId = res.data.data[0].id;
          setParams((prev) => {
            return { ...prev, companyId: companyId };
          });
        }
        console.log("COMPANIES", res.data.data);
      } catch (e) {
        console.log("ERROR IN GET COMPANIES", e);
      }
    };
    const fetchGetSalarys = async () => {
      await fetchGetCompanies();
      try {
        const { data } = await fakeApi({
          searchParams: {
            year: params.year,
            month: params.month,
            companyId: params.companyId ? params.companyId : companyId,
            name: params.name,
          },
        });
        console.log("Salary From API", data.data);
        // setTotalPage(data.totalPages);
        setTableData(data.data);
      } catch (error) {
        console.log("Error", error);
      } finally {
        router.push(
          `${pathname}?name=${params.name}&year=${params.year}&month=${params.month}&companyId=${params.companyId}`
        );
      }
    };
    fetchGetSalarys();
  }, [params, pathname, router, setTableData, companyData, setCompanyData]);

  return (
    <div className="p-2 ">
      <HeaderComponent
        title="Danh sách lương"
        description={`Danh sách lương nhân viên của tháng ${params.month} năm ${params.year}.`}
      />
      <div className="mb-5 mt-2 grid grid-cols-12 space-y-1 grid-rows-2 xl:space-y-0 xl:grid-rows-1">
        <Input
          className="col-span-11 xl:col-span-6 xl:row-start-1"
          placeholder="Tìm kiếm nhân viên"
          value={params.name}
          onChange={(event) => {
            setParams((prev) => {
              return {
                ...prev,
                name: event.target.value,
              };
            });
          }}
        />
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-7 xl:col-span-2 md:ml-2">
          <Select
            value={params.year}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  year: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {listYear.map((year) => (
                <SelectItem
                  key={year}
                  className="hover:bg-gray-100"
                  value={year.toString()}
                >
                  Năm {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-9 xl:col-span-2 md:ml-2">
          <Select
            value={params.month}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  month: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {listMonth.map((month) => (
                <SelectItem
                  key={month.value}
                  className="hover:bg-gray-100"
                  value={month.value.toString()}
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-6 row-start-2 xl:row-start-1 xl:row-span-2 xl:col-start-11 xl:col-span-2 md:ml-2">
          <Select
            value={params.companyId}
            onValueChange={(value) => {
              setParams((prev) => {
                return {
                  ...prev,
                  companyId: value,
                };
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn công ty" />
            </SelectTrigger>
            <SelectContent>
              {companyData.map((item) => (
                <SelectItem
                  key={item.id}
                  className="hover:bg-gray-100"
                  value={item.id.toString()}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Ảnh
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Tên nhân viên
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Cơ sở
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-white"
                      >
                        Lương khả dụng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {tableData.map((item, index) => (
                      <tr
                        key={item.salaryId}
                        onClick={() => {
                          router.push(
                            `/dashboard/salary/detail/${item.userId}`
                          );
                        }}
                        className="hover:bg-gray-100 dark:hover:bg-[#685d55] hover:cursor-pointer "
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                          <div className="w-24 h-32 bg-gray-400">
                            <Image
                              src={item.avatar}
                              alt={item.fullName}
                              width={300}
                              height={400}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                          {item.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                          {item.companyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                          {formatCurrency(item.salary)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 w-[300px] justify-end space-x-2 py-4 ml-auto mr-5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, pageIndex: Number(prev.pageIndex) - 1 };
            });
          }}
          disabled={Number(searchParams.pageIndex) === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setParams((prev) => {
              return { ...prev, pageIndex: Number(prev.pageIndex) + 1 };
            });
          }}
          disabled={Number(searchParams.pageIndex) >= totalPage}
        >
          Next
        </Button>
      </div> */}
    </div>
  );
}
