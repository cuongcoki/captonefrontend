"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import AddNewMeterialHistory from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history";
import { usePathname, useRouter } from "next/navigation";
import {
  materialHistoryProp,
  materialHistoryType,
} from "@/types/material-history.type";
import { materiaHistoryApi } from "@/apis/material-history.api";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import { format } from "date-fns";
import { useMaterialHistoryStore } from "@/components/shared/dashboard/material-history/table/material-history-store";
import { materialApi } from "@/apis/material.api";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import "./material-history.css";
import toast from "react-hot-toast";
import Image from "next/image";
import MaterialHistoryAction from "@/components/shared/dashboard/material-history/table/material-history-action";
import { filesApi } from "@/apis/files.api";
import { se } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddNewMeterialHistoryForm from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history-form";
import UpdateMaterialHistoryForm from "@/components/shared/dashboard/material-history/update-material-history/update-material-history-form";
type MaterialHistoryContextType = {
  ForceRender: () => void;
};

export const MaterialHistoryContext =
  React.createContext<MaterialHistoryContextType>({
    ForceRender: () => {},
  });
interface DataTableProps<TData, TValue> {
  searchParamsProp: materialHistoryProp;
}

export function DataTableForMaterialHistory<TData, TValue>({
  searchParamsProp,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<materialHistoryType[]>([]);
  const [searchParams, setSearchParams] =
    React.useState<materialHistoryProp>(searchParamsProp);
  const [totalPage, setTotalPage] = React.useState<number>(0);
  const [force, setForce] = React.useState<number>(1);
  const ForceRender = () => {
    setForce(force + 1);
  };
  const pathname = usePathname();
  const router = useRouter();

  const { setListMaterial } = useMaterialHistoryStore();
  const [images, setImages] = React.useState<Map<string, string>>(new Map());
  const [isloading, setIsLoading] = React.useState<boolean>(false);

  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  function convertDateFormat(inputDate: string) {
    let parts = inputDate.split("/");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }
  // Convert date format from  yyyy-MM-dd to dd/MM/yyyy
  function convertDateFormatToDMY(inputDate: string) {
    let parts = inputDate.split("-");
    let formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
    return formattedDate;
  }
  useEffect(() => {
    materialApi
      .searchMaterial({
        SearchTerm: "",
        IsInProcessing: true,
        pageIndex: 1,
        pageSize: 1000,
      })
      .then(({ data }) => {
        const listMaterial: ComboboxDataType[] = data.data.data.map(
          (item: any) => {
            return {
              value: String(item.id),
              label: item.name,
            };
          }
        );
        setListMaterial(listMaterial);
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
    setListMaterial;
  }, [setListMaterial]);

  useEffect(() => {
    const getImages = async (data: materialHistoryType[]) => {
      try {
        data.forEach((item) => {
          if (item.image) {
            filesApi
              .getFile(item.image.trim() || "%20")
              .then((res) => {
                setImages((prev) => {
                  const newImages = new Map(prev);
                  newImages.set(item.image as string, res.data.data);
                  return newImages;
                });
              })
              .catch((error) => {
                console.log("error in get image", error);
              });
          }
        });
      } catch (error) {
      } finally {
        // setImages(imagesFetch);
        // console.log("Images", imagesFetch);
      }
    };

    const searchMaterialHistory = async () => {
      setIsLoading(true);
      try {
        const res = await materiaHistoryApi.searchMaterialHistory({
          SearchTerms: searchParams.searchTerm || "",
          PageIndex: searchParams.pageIndex || 1,
          PageSize: 10,
          StartDateImport: searchParams.from || "",
          EndDateImport: searchParams.to || "",
        });
        console.log("MATERIAL_HISTORY_DATA", res.data);
        await getImages(res.data.data.data);
        setTotalPage(res.data.data.totalPages);
        setData(res.data.data.data);
        router.push(
          `${pathname}?searchTerm=${searchParams.searchTerm || ""}&from=${
            searchParams.from || ""
          }&to=${searchParams.to || ""}&pageIndex=${searchParams.pageIndex}`
        );
      } catch (error: any) {
        console.log("Error in search material history", error);
        if (error.response?.status === 400) {
          setData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    searchMaterialHistory();
  }, [searchParams, router, pathname, force]);

  return (
    <div>
      <div className="py-4 grid grid-row-3 md:grid-cols-2 xl:grid-cols-3">
        <Input
          placeholder="Tìm theo tên vật liệu..."
          className="max-w-sm shadow-sm"
          value={searchParams.searchTerm}
          onChange={(event) => {
            setSearchParams({
              ...searchParams,
              searchTerm: event.target.value,
              pageIndex: 1,
            });
          }}
        />
        <div className="mt-4 md:ml-10 md:mt-0">
          <div className="grid grid-cols-2 gap-x-6">
            <DatePicker
              selected={new Date(convertDateFormat(searchParams.from || ""))}
              name="from"
              title={searchParams.from || "Từ ngày"}
              className="w-full"
              value={"2024-06-16"}
              onDayClick={(event: any) => {
                if (event > new Date(convertDateFormat(searchParams.to))) {
                  toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                  return;
                }
                if (format(event, "dd/MM/yyyy") === searchParams.from) {
                  setSearchParams((prev) => {
                    return {
                      ...prev,
                      from: "",
                    };
                  });
                  return;
                }

                setSearchParams((prev) => {
                  return {
                    ...prev,
                    from: format(event, "dd/MM/yyyy"),
                    pageIndex: 1,
                  };
                });
                console.log(format(event, "dd/MM/yyyy"));
              }}
            />
            <DatePicker
              selected={new Date(convertDateFormat(searchParams.to || ""))}
              name="to"
              title={searchParams.to || "Đến ngày"}
              className="w-full"
              onDayClick={(event: any) => {
                if (new Date(convertDateFormat(searchParams.from)) > event) {
                  toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                  return;
                }
                if (format(event, "dd/MM/yyyy") === searchParams.to) {
                  setSearchParams((prev) => {
                    return {
                      ...prev,
                      to: "",
                    };
                  });
                  return;
                }
                setSearchParams((prev) => {
                  return {
                    ...prev,
                    to: format(event, "dd/MM/yyyy"),
                    pageIndex: 1,
                  };
                });
                console.log(format(event, "dd/MM/yyyy"));
              }}
            />
          </div>
        </div>
        <MaterialHistoryContext.Provider value={{ ForceRender }}>
          {/* <AddNewMeterialHistory /> */}
          <AddNewMeterialHistoryForm />
        </MaterialHistoryContext.Provider>
      </div>

      <div className="rounded-md border">
        <MaterialHistoryContext.Provider value={{ ForceRender }}>
          <Table className="material-history-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Ảnh minh họa</TableHead>
                <TableHead className="text-center">Tên nguyên vật liệu</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-center">
                  Giá / Đơn vị
                </TableHead>
                <TableHead className="text-center">Ngày nhập</TableHead>
                <TableHead className="text-center">Ghi chú</TableHead>
                <TableHead className="text-center">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length && !isloading ? (
                data.map((row) => (
                  <>
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex justify-center items-center space-x-2 max-w-[200px]">
                          <Dialog>
                            <DialogTrigger>
                              <div className="transition duration-300 ease-in-out hover:opacity-70 hover:bg-primary hover:shadow-md hover:shadow-primary/50 flex justify-center items-center space-x-2 w-[50px] h-[50px] rounded-lg shadow-md ">
                                <Image
                                  className="w-full h-full rounded-lg object-cover"
                                  width={900}
                                  height={900}
                                  src={
                                    (images.has(row.image as string)
                                      ? images.get(row.image as string)
                                      : "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg") as string
                                  }
                                  alt={row.materialName}
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <DialogDescription></DialogDescription>
                              </DialogHeader>
                              <Image
                                className="w-full h-full rounded-lg object-cover"
                                width={900}
                                height={900}
                                src={
                                  (images.has(row.image as string)
                                    ? images.get(row.image as string)
                                    : "https://toplist.vn/images/800px/lang-nghe-may-tre-dan-phu-vinh-281399.jpg") as string
                                }
                                alt={row.materialName}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {row.materialName}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.quantity}
                      </TableCell>
                      <TableCell className="text-center">{row.price}</TableCell>
                      <TableCell className="text-center">
                        {convertDateFormatToDMY(row.importDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <MaterialHistoryAction idMaterialHistory={row.id} />
                      </TableCell>
                    </TableRow>
                    <UpdateMaterialHistoryForm idMaterialHistory={row.id}>
                      <div id={row.id}></div>
                    </UpdateMaterialHistoryForm>
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {isloading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MaterialHistoryContext.Provider>
        <div className="flex items-center justify-center space-x-4 my-4 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchParams((prev) => {
                return { ...prev, pageIndex: Number(prev.pageIndex) - 1 };
              });
            }}
            disabled={Number(searchParams.pageIndex) === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span>
            Trang {data.length > 0 ? searchParams.pageIndex : 0} Của{" "}
            {data.length > 0 ? totalPage : 0}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchParams((prev) => {
                return { ...prev, pageIndex: Number(prev.pageIndex) + 1 };
              });
            }}
            disabled={Number(searchParams.pageIndex) >= totalPage}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
