"use client";
import React, { use, useEffect, useRef, useState } from "react";
import "./count-product.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ComboboxDataType } from "@/components/shared/common/combobox/combobox-for-form";
import { X } from "lucide-react";
import { useUpdateAttendanceStore } from "@/components/shared/dashboard/attendance/update-attendance/update-attendance-store";
import { useAttendanceStore } from "@/components/shared/dashboard/attendance/attendance-store";
import { GetAllProductResponse, Product } from "@/types/attendance.type";
import { attendanceApi } from "@/apis/attendance.api";
import { filesApi } from "@/apis/files.api";
export default function CountProduct({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { tableData, setTableDataIndex } = useUpdateAttendanceStore();
  const [userData, setUserData] = useState(tableData[index]);
  const userDataRef = useRef(userData);

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  // const [dataPhase, setDataPhase] = useState<ComboboxDataType[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchData, setSearchData] = useState<GetAllProductResponse | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [dialogClose, setDialogClose] = useState(false);
  const [indexChoose, setIndexChoose] = useState<number>(0);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  useEffect(() => {
    if (searchInput) {
      const timestamp = new Date().getTime(); // Cache-busting
      attendanceApi
        .getALlProduct({
          SearchTerm: searchInput,
          IsInProcessing: true,
          pageIndex: 1,
          pageSize: 10,
          timestamp: timestamp,
        })
        .then(({ data }) => {
          console.log("Search Data: ", data);
          const setProduct = new Set<string>();
          userDataRef.current.products.forEach((product) => {
            setProduct.add(product.productID);
          });
          const search = { ...data };
          search.data.data = data.data.data.filter(
            (product) => !setProduct.has(product.id)
          );
          setSearchData(search);
        })
        .catch((error) => {
          if (error.response.data.status === 404) {
            setSearchData(null);
          }
        })
        .finally(() => {
          setIsSearch(false);
        });
    } else {
      setSearchData(null); // Clear search data when input is empty
    }
  }, [searchInput]);

  const AddNewProductForUser = async (product: Product) => {
    const getImage = async (name: string) => {
      try {
        const res = await filesApi.getFile(name);
        console.log("Get Image", res.data.data);
        return res.data.data;
      } catch (error: any) {
        console.log("Error get image: ", error.response.data);
      }
    };
    const imageP = await getImage(product.imageResponses[0]?.imageUrl || "");
    // setSearchData(null);
    setSearchInput("");
    setUserData((prev) => {
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            productID: product.id,
            productName: product.name,
            image: imageP || "",
            phaseID: "42ccc305-85c7-4a4a-92c0-bc41669afe25",
            phaseName: product.code,
            quantity: "0",
          },
        ],
      };
    });
    setIsUpdate(true);
  };
  const updateQuantityOfProduct = (indexP: number, value: string) => {
    if (Number(value) < 0) return;
    setUserData((prev) => {
      const newProducts = [...prev.products];
      newProducts[indexP].quantity = Number(value).toString();
      return {
        ...prev,
        products: newProducts,
      };
    });
    setIsUpdate(true);
  };

  const removeProduct = () => {
    setUserData((prev) => {
      const newProducts = [...prev.products];
      newProducts.splice(indexChoose, 1);
      return {
        ...prev,
        products: newProducts,
      };
    });
    setIsUpdate(true);
  };
  const handleDialog = (value: boolean) => {
    if (isUpdate) {
      setDialogClose(true);
      return;
    }
    setDialogIsOpen(value);
  };

  useEffect(() => {
    if (!dialogIsOpen && isUpdate) {
      console.log("Update Table Data");
      const data = userData;
      data.products = data.products.filter(
        (product) => product.quantity !== "0"
      );
      console.log("Data Product Update: ", data);
      setTableDataIndex(index, data);
      setIsUpdate(false);
    }
  }, [dialogIsOpen, userData, index, setTableDataIndex, isUpdate]);

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[825px] dark:bg-[#1c1917]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#22c55e] w-full text-center mb-3">
            Cập Nhật Sản Phẩm Tạo Ra
          </DialogTitle>
          <DialogDescription className="mb-1 space-y-1">
            <div className="flex space-x-1">
              <div className="font-bold">Nhân viên: </div>
              <div>{tableData[index].userName}</div>
            </div>
            <div className="flex space-x-1">
              <div className="font-bold">CCCD/CMND: </div>
              <div>{tableData[index].userID}</div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mr-auto ">
          <div style={{ position: "relative", width: "400px" }}>
            <Input
              value={searchInput}
              onChange={(event) => {
                setIsSearch(true);
                setSearchInput(event.target.value);
              }}
              placeholder="Nhập tên hoặc mã sản phẩm ..."
            />
            {searchData && (
              <ul
                className="hide-scrollbar search-product rounded-b-md rounded-t-md shadow-md"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {searchData.data.data.map((item, index) => (
                  <li
                    key={item.id}
                    className={`hover:bg-gray-100 cursor-pointer dark:bg-black dark:hover:bg-[#4c4c4c] ${index === 1 ? "rounded-t-md" : ""
                      } ${index === searchData.data.data.length - 1
                        ? "rounded-b-md"
                        : ""
                      }`}
                    onClick={async () => {
                      await AddNewProductForUser(item);
                      setSearchInput("");
                    }}
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    {`[${item.code}]:${item.name}`}
                  </li>
                ))}
              </ul>
            )}
            {searchInput !== "" && !searchData && !isSearch && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 z-1000 p-2 dark:bg-black rounded-b-md rounded-t-md">
                Không có sản phẩm
              </div>
            )}
          </div>
        </div>
        <table className="count-product-table">
          <thead>
            <tr>
              <th className="dark:bg-[#1c1917]">Hình ảnh</th>
              <th className="dark:bg-[#1c1917]">Tên sản phẩm</th>
              <th className="dark:bg-[#1c1917]">Mã sản phẩm</th>
              <th className="dark:bg-[#1c1917]">Số lượng</th>
              <th className="dark:bg-[#1c1917]">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {userData.products.map((product, indexP) => (
              <tr key={product.productID}>
                <td>
                  <div className="size-[50px] bg-gray-400 mx-auto ">
                    <Image
                      width={90}
                      height={120}
                      src={
                        product.image ||
                        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/4/8/1177370/Thepxaydung.jpg"
                      }
                      alt={product.productName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
                <td className="text-center">{product.productName}</td>
                {/* <td className="text-center">{product.phaseName}</td> */}
                <td className="text-center">{product.phaseName}</td>
                <td>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      updateQuantityOfProduct(indexP, e.target.value);
                    }}
                  />
                </td>
                <td>
                  {
                    <button
                      onClick={() => {
                        setIndexChoose(indexP);
                        setOpen(true);
                      }}
                    >
                      <X />
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogFooter>
          {/* <Button type="submit">Lưu thay đổi</Button> */}
        </DialogFooter>
        {open && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <div></div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn xóa sản phẩm này
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh
                  viên những dữ liệu mà bạn đã nhập
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setOpen(false);
                    removeProduct();
                  }}
                >
                  Tiếp tục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {dialogClose && dialogIsOpen && (
          <AlertDialog open={dialogClose} onOpenChange={setDialogClose}>
            <AlertDialogTrigger asChild>
              <div></div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn đã hoàn thành cập nhật sản phẩm cho nhân viên này?
                </AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    // setDialogClose(false);
                    setDialogIsOpen(false);
                  }}
                >
                  Hoàn thành
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
