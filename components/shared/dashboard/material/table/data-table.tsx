"use client";

import {
  ColumnDef,
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
import AddNewMeterial from "@/components/shared/dashboard/material/add-new-material/add-new-material";
import { materialApi } from "@/apis/material.api";
import { usePathname, useRouter } from "next/navigation";
import "./material.css";
import { filesApi } from "@/apis/files.api";
import { materialType } from "@/schema/material";
import Image from "next/image";
import UpdateMaterial from "@/components/shared/dashboard/material/update-material/update-material";
import { PenLine } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
type ContexType = {
  forceUpdate: () => void;
};
export const MyContext = React.createContext<ContexType>({
  forceUpdate: () => { },
});
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchTermProp: string;
  pageIndexProp: number;
}

export function DataTableForMaterial<TData, TValue>({
  columns,
  searchTermProp,
  pageIndexProp,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = React.useState<number>(
    (pageIndexProp as number) || 1
  );

  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [data, setData] = React.useState<materialType[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>(
    searchTermProp || ""
  );
  const [force, setForce] = React.useState<number>(1);
  const forceUpdate = () => setForce((prev) => prev + 1);

  const pathname = usePathname();
  const router = useRouter();
  const [images, setImages] = React.useState<Map<string, string>>(new Map());
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const getImages = async (data: materialType[]) => {
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
              });
          }
        });
      } catch (error) {
      } finally {

      }
    };

    const searchMaterial = async (searchTerm: string) => {
      setLoading(true);
      try {
        const data = await materialApi.searchMaterial({
          SearchTerm: searchTerm,
          IsInProcessing: true,
          pageIndex: pageIndex,
          pageSize: 10,
        });
        await getImages(data.data.data.data);

        const tableData = data.data.data.data;

        setData(tableData);
        setTotalPages(data.data.data.totalPages);
        router.push(
          `${pathname}?searchTerm=${searchTerm || ""}&pageIndex=${pageIndex}`
        );
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    searchMaterial(searchTerm);
  }, [searchTerm, pathname, router, pageIndex, force]);

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row justify-center items-center py-4">
        <Input
          placeholder="Tìm theo tên vật liệu..."
          value={searchTerm}
          onChange={(event) => {
            setPageIndex(1);
            setSearchTerm(event.target.value);
          }}
          className="max-w-sm shadow-sm"
        />
        <MyContext.Provider value={{ forceUpdate }}>
          <AddNewMeterial />
        </MyContext.Provider>
      </div>
      <div className="rounded-md border">
        <MyContext.Provider value={{ forceUpdate }}>
          <Table className="material-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Ảnh minh họa</TableHead>
                <TableHead className="text-center">Tên nguyên liệu</TableHead>
                <TableHead className="text-center">
                  Số lượng mỗi đơn vị
                </TableHead>
                <TableHead className="text-center">Đơn vị tính</TableHead>
                <TableHead className="text-center">Miêu tả</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-center">Chỉnh sửa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length && !loading ? (
                data.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex justify-center items-center space-x-2 max-w-[200px]">
                          <Dialog>
                            <DialogTrigger >
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
                                  alt={row.name}
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
                                alt={row.name}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{row.name}</TableCell>
                      <TableCell className="text-center">
                        {row.quantityPerUnit}
                      </TableCell>
                      <TableCell className="text-center">{row.unit}</TableCell>
                      <TableCell className="text-center">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.quantityInStock}
                      </TableCell>
                      <TableCell className="text-center">
                        <UpdateMaterial id={row.id}>
                          <PenLine className="cursor-pointer" />
                        </UpdateMaterial>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {loading ? "Loading..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </MyContext.Provider>
        <div className="flex items-center justify-center space-x-4 my-4 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) - 1)}
            disabled={Number(pageIndex) === 1}
            className=""
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span>
            Trang {data.length > 0 ? pageIndex : 0} Của {data.length > 0 ? totalPages : 0}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Number(prev) + 1)}
            disabled={pageIndex >= totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}