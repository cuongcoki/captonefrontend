"use client";
// ** import UI
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import Image from "next/image";
import { useEffect, useState } from "react";

import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShipmentSchema } from "@/schema/shipment";

// ** import Components
import {
  CalendarIcon,
  Check,
  CircleX,
  Eye,
  Plus,
  Truck,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import toast from "react-hot-toast";

import ImageIconShipmentForm from "./ImageIconShipmentForm";
import ImageIconMaterial from "./ImageIconMaterial";

import { ShipmentStore } from "../shipment-store";

// ** import API
import { phaseApi } from "@/apis/phase.api";
import { productApi } from "@/apis/product.api";
import { filesApi } from "@/apis/files.api";
import { companyApi } from "@/apis/company.api";
import { shipmentApi } from "@/apis/shipment.api";
import { userApi } from "@/apis/user.api";
import TitleComponent from "@/components/shared/common/Title";
import { useFormStatus } from "react-dom";
import HoverComponent from "@/components/shared/common/hover-card";
import { productPhaseApi } from "@/apis/product-phase.api";
import ImageIconShipmentFormPF from "./ImageIconShipmentFormPF";
import useDebounce from "@/components/shared/common/customer-hook/use-debounce";

const enumCompany = [
  {
    description: "Nhà xưởng",
    id: 0,
    value: "0",
  },
  {
    description: "Công ty hợp tác sản xuất",
    id: 2,
    value: "2",
  },
];

const ProductPhaseType = [
  {
    id: 0,
    des: "Bình thường",
  },
  {
    id: 1,
    des: "Lỗi bên cơ sở",
  },
  {
    id: 2,
    des: "Lỗi bên hợp tác",
  },
  {
    id: 3,
    des: "Hàng hỏng",
  },
];

type Company = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: any;
  companyTypeDescription: string;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  companyId: string;
  avatar: string;
  companyName: string;
};

export type Product = {
  availableQuantity: number;
  brokenAvailableQuantity: number;
  brokenQuantity: number;
  code: string;
  companyId: string;
  description: string;
  errorAvailableQuantity: number;
  errorQuantity: number;
  failureAvailabeQuantity: number;
  failureQuantity: number;
  id: string;
  imageUrl: string;
  isInProcessing: boolean;
  name: string;
  phaseId: string;
  price: number;
  quantity: number;
  size: string;
};

export type ShipmentDetailRequest = {
  itemId: string;
  phaseId: string;
  quantity: any;
  materialPrice: number;
  kindOfShip: number;
  productPhaseType: number;
};

export type Shipment = {
  fromId: string;
  toId: string;
  shipperId: string;
  shipDate: string;
  shipmentDetailRequests: ShipmentDetailRequest[];
};

export type Phase = {
  id: string;
  name: string;
  description: string;
};

export type PhasesResponse = {
  data: Phase[];
};
interface ImageResponse {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}
export type Material = {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantityPerUnit: number;
  image: string;
  quantityInStock: number;
};

interface DataProduct {
  code: string;
  description: string;
  id: string;
  image: string;
  isInProcessing: boolean;
  name: string;
  price: number;
  size: string;
  totalAvailableQuantity: number;
  totalQuantity: number;
}

export default function CreateShipment() {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const { ForceRender } = ShipmentStore();
  const [dialogDate, setDialogDate] = useState<boolean>(false);

  //state ** company
  const [company, setCompany] = useState<Company[]>([]);
  const [companyType, setCompanyType] = useState<number>(0);
  const [company1, setCompany1] = useState<Company[]>([]);
  const [companyType1, setCompanyType1] = useState<number>(0);

  // ** state user
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(11);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [roleId, setRoleId] = useState<number>(4);
  const [searchTearm, setSearchTearm] = useState<string>("");
  const [dataEm, setDataEm] = useState<Employee[]>([]);

  // ** state phase
  const [dataPh, setDataPh] = useState<Phase[]>([]);

  // ** state product
  const [currentPageP, setCurrentPageP] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTermDebounce = useDebounce(searchTerm, 400);
  const [totalPagesP, setTotalPagesP] = useState<number>(1);
  const [pageSizeP, setPageSizeP] = useState<number>(40);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(true);
  const [dataP, setDataP] = useState<Product[]>([]);

  // ** state material
  const [currentPageM, setCurrentPageM] = useState<number>(1);
  const [searchTermM, setSearchTermM] = useState<string>("");
  const searchTermDebounceM = useDebounce(searchTermM, 400);
  const [totalPagesM, setTotalPagesM] = useState<number>(1);
  const [pageSizeM, setPageSizeM] = useState<number>(40);
  const [dataM, setDataM] = useState<Material[]>([]);
  // ** state Shipment
  const [shipmentDetailRequests, setShipmentDetailRequests] = useState<
    ShipmentDetailRequest[]
  >([]);
  const [productDetail, setProductDetail] = useState<any[]>([]);
  // Hàm thêm sản phẩm
  const handleAddProducts = (
    item: any,
    imgProducts: string,
    itemId: string,
    itemKind: number,
    phaseId?: any,
    price?: any
  ) => {
    if (
      itemKind === 1 &&
      shipmentDetailRequests.some((item) => item.itemId === itemId)
    ) {
      return toast.error("Nguyên vật liệu này đã được thêm");
    }

    setShipmentDetailRequests((prev: any) => [
      ...prev,
      {
        itemId: itemId,
        phaseId: phaseId,
        quantity: 1,
        kindOfShip: itemKind,
        productPhaseType: 0,
        ...(itemKind !== 0 && { materialPrice: 0 }),
      },
    ]);
    setProductDetail((prev) => [
      ...prev,
      {
        item,
        itemId: itemId,
        imgProducts,
        phaseId: phaseId,
        quantity: 1,
        kindOfShip: itemKind,
        productPhaseType: 0,
        materialPrice: 0,
        price: price,
      },
    ]);
  };

  // Hàm xóa sản phẩm
  const handleDeleteProducts = (itemId: string, index: number) => {
    setShipmentDetailRequests((prev) =>
      prev.filter((item, i) => !(item.itemId === itemId && i === index))
    );
    setProductDetail((prev) =>
      prev.filter((product, i) => !(product.itemId === itemId && i === index))
    );
  };

  // Hàm thay đổi giá trị của một sản phẩm
  const handleChange = (
    itemId: string,
    name: keyof ShipmentDetailRequest,
    value: any,
    index: number,
    kindOfShip?: number
  ) => {
    setShipmentDetailRequests((prev) =>
      prev.map((item, i) => {
        if (item.itemId === itemId && i === index) {
          return { ...item, [name]: value };
        }
        return item;
      })
    );
  };

  // Hàm xóa tất cả giá trị sản phẩm đã chọn
  const handleClear = () => {
    setShipmentDetailRequests([]);
    setProductDetail([]);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };

  const handleOnDialogA = () => {
    setOpenAlert(true);
  };

  const handleStatusChange = (value: number) => {
    setCompanyType(value);
  };

  const handleStatusChange1 = (value: number) => {
    setCompanyType1(value);
  };

  // ** state product
  const [currentPagePF, setCurrentPagePF] = useState<number>(1);
  const [searchTermPF, setSearchTermPF] = useState<string>("");
  const [pageSizePF, setPageSizePF] = useState<number>(40);
  const [companyIdPF, setCompanyIdPF] = useState<string | undefined>();
  const [dataPF, setDataPF] = useState<DataProduct[]>([]);
  //call data product phase
  useEffect(() => {
    const handleSearch = () => {
      setLoading(true);
      if (companyIdPF === undefined || companyIdPF === undefined) return;
      productPhaseApi
        .searchProductPhaseShip(
          searchTermPF,
          companyIdPF,
          currentPagePF,
          pageSizePF
        )
        .then(({ data }) => {
          setDataPF(data.data.data);
        })
        .catch((error) => {
          setDataPF([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    handleSearch();
  }, [searchTermPF, companyIdPF, currentPagePF, pageSizePF]);
  //call data material
  useEffect(() => {
    const fetchDataMaterial = async () => {
      setLoading(true);
      try {
        const response = await productApi.allMaterial(
          currentPageM,
          pageSizeM,
          searchTermDebounceM
        );
        const newData = response.data.data.data;

        const updatedData = await Promise.all(
          newData.map(async (item: any) => {
            if (item.image) {
              try {
                const response = await filesApi.getFile(
                  item.image.trim() === "" ? "%20" : item.image.trim()
                );
                return {
                  ...item,
                  image: response?.data?.data || "", // Nếu không có dữ liệu thì trả về chuỗi rỗng
                };
              } catch (error) {
                // console.error(
                //   `Failed to fetch image for item: ${item.id}`,
                //   error
                // );
                return {
                  ...item,
                  image: "", // Xử lý lỗi và trả về chuỗi rỗng nếu xảy ra lỗi
                };
              }
            }
            return item; // Nếu không có image, trả về item ban đầu
          })
        );

        setDataM(updatedData);
        setCurrentPageM(response.data.data.currentPage);
        setTotalPagesM(response.data.data.totalPages);
      } catch (error) {
        setDataM([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataMaterial();
  }, [currentPageM, pageSizeM, searchTermDebounceM]);

  // call data phase
  useEffect(() => {
    const fetchDataPhase = () => {
      phaseApi.getAllPhase().then(({ data }) => {
        setDataPh(data.data);
      });
    };
    fetchDataPhase();
  }, [dataPh]);

  // call data company
  useEffect(() => {
    const fetchDataCompany = () => {
      companyApi.getCompanyByType(companyType).then(({ data }) => {
        setCompany(data.data);
      });
    };
    const fetchDataCompany1 = () => {
      companyApi.getCompanyByType(companyType1).then(({ data }) => {
        setCompany1(data.data);
      });
    };
    fetchDataCompany1();
    fetchDataCompany();
  }, [company, companyType, company1, companyType1]);

  // call data employyee
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userApi.allUsers(
          roleId,
          searchTearm,
          isActive,
          currentPage,
          pageSize
        );
        setDataEm(res.data.data.data);
        setCurrentPage(res.data.data.currentPage);
        setTotalPages(res.data.data.totalPages);
      } catch (error: any) {
        if (error?.response.data.status === 400) {
          setDataEm([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isActive, roleId, searchTearm, currentPage, pageSize, dataEm]);

  // call data product
  // useEffect(() => {
  //   const fetchDataProduct = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await productApi.allProducts(
  //         isInProcessing,
  //         currentPageP,
  //         pageSizeP,
  //         searchTerm
  //       );
  //       const newData = response.data.data.data;

  //       const updatedData = await Promise.all(
  //         newData.map(async (item: any) => {
  //           const updatedImageResponses = await Promise.all(
  //             item.imageResponses.map(async (image: any) => {
  //               try {
  //                 const { data } = await filesApi.getFile(image.imageUrl);
  //                 return {
  //                   ...image,
  //                   imageUrl: data.data,
  //                 };
  //               } catch (error) {
  //                 return {
  //                   ...image,
  //                   imageUrl: "",
  //                 };
  //               }
  //             })
  //           );
  //           return {
  //             ...item,
  //             imageResponses: updatedImageResponses,
  //           };
  //         })
  //       );

  //       setDataP(updatedData);
  //       setCurrentPageP(response.data.data.currentPage);
  //       setTotalPagesP(response.data.data.totalPages);
  //     } catch (error) {
  //       setDataP([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDataProduct();
  // }, [currentPageP, pageSizeP, searchTerm, isInProcessing]);
  const handleSelectChange = (value: string) => {
    if (companyType === 2) {
      setCompanyIdPF(value);
    }
    // Cập nhật giá trị form từ dropdown
    setCompanyId(value);
  };

  const [phaseId, setPhaseId] = useState<string | undefined>();
  const [companyId, setCompanyId] = useState<string | undefined>();

  useEffect(() => {
    const handleSearch = () => {
      setLoading(true);
      if (phaseId === undefined || companyId === undefined) return;
      productApi
        .searchProduct(
          searchTermDebounce,
          phaseId,
          companyId,
          currentPageP,
          pageSizeP
        )
        .then(({ data }) => {
          setDataP(data.data.data);
        })
        .catch((error) => {
          setDataP([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    handleSearch();
  }, [searchTermDebounce, phaseId, companyId, currentPageP, pageSizeP]);

  // ** form
  const form = useForm({
    resolver: zodResolver(ShipmentSchema),
    defaultValues: {
      fromId: "",
      toId: "",
      shipperId: "",
      shipDate: "",
    },
  });
  // call gủi form
  const onSubmit = (data: z.infer<typeof ShipmentSchema>) => {
    if (!productDetail || productDetail.length === 0) {
      return toast.error("Bạn cần phải chọn sản phẩm để tạo đơn hàng");
    }

    if (data.fromId === data.toId) {
      return toast.error("2 Công ty không được trùng nhau");
    }

    if (shipmentDetailRequests.length === 0) {
      // console.error("Không tìm thấy yêu cầu chi tiết lô hàng");
      return;
    }

    // Tạo một hàm để gộp các yêu cầu lô hàng
    const groupAndSummarizeRequests = (requests: ShipmentDetailRequest[]) => {
      const requestMap = new Map<string, ShipmentDetailRequest>();

      requests.forEach((request) => {
        const key = `${request.itemId}-${request.phaseId}-${request.kindOfShip}-${request.productPhaseType}`;
        if (requestMap.has(key)) {
          // Nếu đã có phần tử với khóa này, cộng dồn quantity
          const existingRequest = requestMap.get(key)!;
          existingRequest.quantity += request.quantity;
        } else {
          // Nếu chưa có phần tử với khóa này, thêm mới vào Map
          requestMap.set(key, { ...request });
        }
      });

      return Array.from(requestMap.values());
    };

    // Sử dụng hàm để gộp và tóm tắt các yêu cầu
    const updatedShipmentDetailRequests = groupAndSummarizeRequests(
      shipmentDetailRequests
    );

    let hasError = false;

    shipmentDetailRequests.forEach((request, index) => {
      if (!request.itemId) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Lỗi</p>
                  <p className="mt-1 text-sm text-gray-500">ID không tồn tại</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ));
        hasError = true;
      } else if (!request.phaseId && request.kindOfShip === 0) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Hãy chọn giai đoạn
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ));
        hasError = true;
      } else if (request.quantity <= 0) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Số lượng không thể bé hơn 0
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ));
        hasError = true;
      } else if (
        request.productPhaseType === null &&
        request.kindOfShip === 0
      ) {
        // Sửa điều kiện ở đây
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Lỗi - {request.kindOfShip === 0 ? "Sản phẩm" : "Vật liệu"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Hãy chọn loại cho sản phẩm
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ));
        hasError = true;
      } else if (request.materialPrice <= 0 && request.kindOfShip === 1) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">Lỗi</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Giá tiền phải lớn hơn 0
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Đóng
              </button>
            </div>
          </div>
        ));
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    // check time UTC
    const originalDate = data.shipDate;
    const date = new Date(originalDate);
    date.setUTCHours(23, 59, 59, 0);
    const formattedShipDate = date.toISOString().replace(".000", "");

    // Gọi hàm kiểm tra
    const requestBody = {
      fromId: data.fromId,
      toId: data.toId,
      shipperId: data.shipperId,
      shipDate: formattedShipDate,
      shipmentDetailRequests: updatedShipmentDetailRequests,
    };
    // console.log("requestBody", requestBody);
    setLoading(true);
    shipmentApi
      .createShipment(requestBody)
      .then(({ data }) => {
        ForceRender();
        setOpen(false);
        form.reset();
        setProductDetail([]);
        setShipmentDetailRequests([]);
        setCompanyId(undefined);
        setPhaseId(undefined);
        if (data.isSuccess) {
          toast.success(data.message);
        }
      })
      .catch((error) => {
        const errorResponse = error.response?.data?.error;

        if (errorResponse) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error.response?.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };
  const productType = 0;
  const materialType = 1;

  const formatCurrency = (value: any): string => {
    if (!value) return "0";
    let valueString = value.toString();
    valueString = valueString.replace(/[^0-9]/g, "");
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    let numberValue = parseInt(valueString, 10);
    let formatted = numberValue.toLocaleString("vi-VN");
    return formatted;
  };

  const parseCurrency = (value: any) => {
    const cleanedValue = value.replace(/\./g, "");
    return parseInt(cleanedValue);
  };

  const handleClearForm = () => {
    setOpen(false);
    setOpenAlert(false);
    setFetchTrigger((prev) => prev + 1);
    form.reset();
    setShipmentDetailRequests([]);
    setProductDetail([]);
    setCompanyId(undefined);
    setPhaseId(undefined);
  };

  const handleOffDialog = () => {
    // Kiểm tra xem mảng có rỗng hay không
    const isDetailsProEmpty =
      Array.isArray(productDetail) && productDetail.length === 0;

    // Kiểm tra giá trị cụ thể của form
    const isFromIdIdEmpty = form.getValues().fromId === "";
    const isShipDateEmpty = form.getValues().shipDate === "";
    const isShipperIdEmpty = form.getValues().shipperId === "";
    const isToIdEmpty = form.getValues().toId === "";

    // Nếu tất cả các trường trong form đều trống hoặc không có giá trị và các mảng rỗng
    if (
      isDetailsProEmpty &&
      isFromIdIdEmpty &&
      isShipDateEmpty &&
      isShipperIdEmpty &&
      isToIdEmpty
    ) {
      setOpen(false);
    } else {
      setOpenAlert(true);
    }
  };
console.log("dataP",dataP)
console.log("dataM",dataM)
  const { pending } = useFormStatus();
  return (
    <>
      {openAlert && (
        <AlertDialog open={openAlert}>
          <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn tắt biểu mẫu này không ??
              </AlertDialogTitle>
              <AlertDialogDescription>
                Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
                những dữ liệu mà bạn đã nhập
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleOffDialogA}>
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
          <Plus />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="visible hidden"></Dialog.Title>
              <Dialog.Description className="visible hidden"></Dialog.Description>
              <div className="bg-slate-100 flex flex-col overflow-y-auto  rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Tạo Đơn Vận Chuyển</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOffDialog}
                  >
                    <X className="w-4 h-4 dark:text-white" />
                  </Button>
                </div>
                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4 dark:bg-black">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full flex flex-col gap-4"
                    >
                      <Card>
                        <CardHeader>
                          <TitleComponent
                            title="Thông tin công ty"
                            description="Thông tin công ty gửi - nhận đơn hàng."
                          />
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="w-full">
                              <FormLabel className="text-primary ">
                                Công ty gửi *
                              </FormLabel>
                              <Card className="w-full mt-2 shadow-lg">
                                <CardContent className="mt-5">
                                  <Select
                                    onValueChange={(value) =>
                                      handleStatusChange(parseInt(value))
                                    }
                                  >
                                    <SelectTrigger className="mb-2">
                                      {" "}
                                      <SelectValue placeholder="Chọn kiểu công ty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {enumCompany.map((item) => (
                                        <SelectItem
                                          value={item.value}
                                          key={item.id}
                                        >
                                          {item.description}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name="fromId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select
                                          onValueChange={(value) => {
                                            field.onChange(value);
                                            handleSelectChange(value);
                                          }}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="h-32">
                                              <SelectValue
                                                placeholder="Hãy chọn công ty"
                                                defaultValue={field.value}
                                              />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent
                                            className="md:w-[350px] w-[300px]"
                                            align="center"
                                          >
                                            {company.map((item) => (
                                              <SelectItem
                                                key={item.id}
                                                value={item.id}
                                                className="hover:bg-slate-100 dark:hover:bg-black shadow-md mb-1"
                                              >
                                                <div className="flex flex-col items-start  ">
                                                  <span>
                                                    {`${limitLength(
                                                      item.name,
                                                      30
                                                    )} - ${limitLength(
                                                      item.address,
                                                      30
                                                    )}`}
                                                  </span>
                                                  <span className="text-sm text-gray-500">
                                                    <div className="flex flex-col items-start">
                                                      <span>
                                                        {item.directorName}
                                                      </span>
                                                      <span className="text-sm text-gray-500">
                                                        {`${
                                                          item.directorPhone
                                                        } - ${
                                                          !item.email
                                                            ? "Không có"
                                                            : item.email
                                                        }`}
                                                      </span>
                                                    </div>
                                                  </span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                            <Card className="hidden md:block shadow-lg">
                              <Truck className="w-10 h-10 p-1" />
                            </Card>
                            <div className="w-full">
                              <FormLabel className="text-primary ">
                                Công ty nhận *
                              </FormLabel>
                              <Card className="w-full mt-2 shadow-lg">
                                <CardContent className="mt-5">
                                  <Select
                                    onValueChange={(value) =>
                                      handleStatusChange1(parseInt(value))
                                    }
                                  >
                                    <SelectTrigger className="mb-2">
                                      {" "}
                                      <SelectValue placeholder="Chọn kiểu công ty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {enumCompany.map((item) => (
                                        <SelectItem
                                          value={item.value}
                                          key={item.id}
                                        >
                                          {item.description}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormField
                                    control={form.control}
                                    name="toId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="h-32">
                                              <SelectValue
                                                placeholder="Hãy chọn công ty"
                                                defaultValue={field.value}
                                              />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent
                                            className="md:w-[350px] w-[300px]"
                                            align="center"
                                          >
                                            {company1.map((item) => (
                                              <SelectItem
                                                key={item.id}
                                                value={item.id}
                                                className="hover:bg-slate-100 dark:hover:bg-black shadow-md mb-1"
                                              >
                                                <div className="flex flex-col items-start  ">
                                                  <span>
                                                    {`${limitLength(
                                                      item.name,
                                                      30
                                                    )} - ${limitLength(
                                                      item.address,
                                                      30
                                                    )}`}
                                                  </span>
                                                  <span className="text-sm text-gray-500">
                                                    <div className="flex flex-col items-start">
                                                      <span>
                                                        {item.directorName}
                                                      </span>
                                                      <span className="text-sm text-gray-500">
                                                        {`${
                                                          item.directorPhone
                                                        } - ${
                                                          !item.email
                                                            ? "Không có"
                                                            : item.email
                                                        }`}
                                                      </span>
                                                    </div>
                                                  </span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="flex flex-col md:flex-row">
                        <CardHeader>
                          <TitleComponent
                            title="Thông tin"
                            description="Thông tin nhân viên - thời gian vận chuyển đơn hàng."
                          />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 justify-around items-center space-x-0 md:space-x-16 p-4 w-full">
                          <FormField
                            control={form.control}
                            name="shipperId"
                            render={({ field }) => (
                              <FormItem className="grid grid-rows-5 h-full">
                                <FormLabel className="flex items-end text-primary">
                                  Nhân viên *
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-16 row-span-4">
                                      <SelectValue
                                        placeholder="Hãy chọn nhân viên"
                                        defaultValue={field.value}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {dataEm.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={item.id}
                                        className="hover:bg-slate-100 dark:hover:bg-black shadow-md mb-1"
                                      >
                                        <div className="flex items-center gap-4">
                                          <Image
                                            className="w-12 h-12 rounded-full shadow-md"
                                            src={item.avatar}
                                            width={900}
                                            height={900}
                                            alt="ảnh nhân viên"
                                          />
                                          <div className="font-medium dark:text-white">
                                            <div>
                                              {item.firstName} {item.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                              {item.id}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                              {item.companyName}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="shipDate"
                            render={({ field }) => (
                              <FormItem className="grid grid-rows-5 h-full">
                                <FormLabel className="flex items-end text-primary">
                                  Ngày vận đơn *
                                </FormLabel>
                                <Popover
                                  modal={true}
                                  open={dialogDate}
                                  onOpenChange={setDialogDate}
                                >
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full md:w-[240px] pl-3 text-left font-normal row-span-4",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            parseISO(field.value),
                                            "dd/MM/yyyy"
                                          )
                                        ) : (
                                          <span>Chọn ngày</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        field.value
                                          ? parseISO(field.value)
                                          : undefined
                                      }
                                      onSelect={(date: any) => {
                                        if (date) {
                                          const formattedDate = new Date(
                                            Date.UTC(
                                              date.getFullYear(),
                                              date.getMonth(),
                                              date.getDate()
                                            )
                                          ).toISOString();
                                          field.onChange(formattedDate);
                                          setDialogDate(false);
                                        }
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      <div className="w-full">
                        <Tabs defaultValue="account">
                          <TabsList className="grid w-[200px] grid-cols-2">
                            <TabsTrigger
                              value="account"
                              className="data-[state=active]:shadow-lg"
                            >
                              Sản phẩm
                            </TabsTrigger>
                            {companyType === 0 && companyType1 !== 0 ? (
                              <TabsTrigger
                                value="password"
                                className="data-[state=active]:shadow-lg"
                              >
                                Vật liệu
                              </TabsTrigger>
                            ) : (
                              ""
                            )}
                          </TabsList>
                          <TabsContent value="account">
                            <Card>
                              <CardHeader>
                                <TitleComponent
                                  title="Sản phẩm"
                                  description="Danh sách sản phẩm của công ty."
                                />
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {companyType === 0 ? (
                                  <>
                                    <div className="flex items-center mb-3 gap-3">
                                      <Input
                                        disabled={phaseId === undefined}
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                          setSearchTerm(e.target.value)
                                        }
                                        className="md:w-[300px] w-full "
                                      />

                                      <Select
                                        disabled={companyId === undefined}
                                        defaultValue={phaseId}
                                        onValueChange={(value) =>
                                          setPhaseId(value)
                                        }
                                      >
                                        <SelectTrigger className="w-[250px]">
                                          <SelectValue placeholder="Giai đoạn sản phẩm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            {dataPh
                                              .filter(
                                                (item) =>
                                                  item.name === "PH_001" ||
                                                  item.name === "PH_002"
                                              )
                                              .map((item) => (
                                                <SelectItem
                                                  key={item.id}
                                                  value={item.id}
                                                >
                                                  {item.name}-{item.description}
                                                </SelectItem>
                                              ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4 h-[150px]  md:min-h-[180px] overflow-y-auto ">
                                      {dataP && dataP.length > 0 ? (
                                        dataP.map((itemP) => (
                                          <Card
                                            className="h-[90px] flex gap-2 shadow-md group relative"
                                            key={itemP.id + itemP.phaseId}
                                          >
                                            <div className="group relative w-[100px] h-[90px] shadow-md rounded-md">
                                              <ImageIconShipmentForm
                                                dataImage={itemP}
                                              />
                                              <Check
                                                className={`${
                                                  shipmentDetailRequests.some(
                                                    (item1) =>
                                                      item1.itemId ===
                                                        itemP.id &&
                                                      item1.phaseId ===
                                                        itemP.phaseId
                                                  )
                                                    ? "absolute top-0 right-0 bg-primary text-white"
                                                    : "hidden"
                                                }`}
                                              />
                                              <span
                                                className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6 bg-primary-backgroudPrimary"
                                                onClick={() => {
                                                  handleAddProducts(
                                                    itemP,
                                                    itemP.imageUrl
                                                      ? itemP.imageUrl
                                                      : "",
                                                    itemP?.id,
                                                    productType,
                                                    itemP?.phaseId,
                                                    itemP.price
                                                  );
                                                }}
                                              >
                                                <Plus className="text-white" />
                                              </span>
                                            </div>
                                            <div className="flex flex-col w-full text-sm my-1">
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Mã:
                                                </span>
                                                <span className="font-light">
                                                  <HoverComponent Num={10}>
                                                    {itemP.code}
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Tên:
                                                </span>
                                                <span className="font-light">
                                                  <HoverComponent Num={10}>
                                                    {itemP.name}
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Có sẵn:
                                                </span>
                                                <span className="font-bold">
                                                  <HoverComponent Num={10}>
                                                    {itemP.availableQuantity}
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Giá thành:
                                                </span>
                                                <span className="font-light text-primary">
                                                  <HoverComponent Num={15}>
                                                    {formatCurrency(
                                                      itemP.price
                                                    )}
                                                  </HoverComponent>{" "}
                                                  .đ
                                                </span>
                                              </div>
                                            </div>
                                          </Card>
                                        ))
                                      ) : (
                                        <div className="text-center text-gray-500">
                                          Không có kết quả.
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center mb-3 gap-3">
                                      <Input
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTermPF}
                                        onChange={(e) =>
                                          setSearchTermPF(e.target.value)
                                        }
                                        className="md:w-[300px] w-full "
                                      />
                                    </div>

                                    <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4 h-[150px]  md:min-h-[180px] overflow-y-auto ">
                                      {dataPF && dataPF.length > 0 ? (
                                        dataPF.map((item) => (
                                          <Card
                                            className="h-[90px]  flex gap-2 shadow-md group relative"
                                            key={item.id}
                                          >
                                            <div className="group relative w-[100px] h-[90px] shadow-md rounded-md">
                                              <ImageIconShipmentFormPF
                                                dataImage={item}
                                              />
                                              <Check
                                                className={`${
                                                  shipmentDetailRequests.some(
                                                    (item1) =>
                                                      item1.itemId === item.id
                                                  )
                                                    ? "absolute top-0 right-0 bg-primary text-white"
                                                    : "hidden"
                                                }`}
                                              />
                                              <span
                                                className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6 bg-primary-backgroudPrimary"
                                                onClick={() => {
                                                  handleAddProducts(
                                                    item,
                                                    item.image
                                                      ? item.image
                                                      : "",
                                                    item?.id,
                                                    productType,
                                                    "",
                                                    item.price
                                                  );
                                                }}
                                              >
                                                <Plus className="text-white" />
                                              </span>
                                            </div>
                                            <div className="flex flex-col w-full text-sm my-1">
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Mã:
                                                </span>
                                                <span className="font-light">
                                                  <HoverComponent Num={10}>
                                                    {item.code}
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Tên:
                                                </span>
                                                <span className="font-light">
                                                  <HoverComponent Num={10}>
                                                    {item.name}
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Số lượng có sẵn:
                                                </span>
                                                <span className="font-light">
                                                  <HoverComponent Num={10}>
                                                    {
                                                      item.totalAvailableQuantity
                                                    }
                                                  </HoverComponent>
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="font-medium">
                                                  Giá thành:
                                                </span>
                                                <span className="font-light text-primary">
                                                  <HoverComponent Num={15}>
                                                    {formatCurrency(item.price)}
                                                  </HoverComponent>{" "}
                                                  .đ
                                                </span>
                                              </div>
                                            </div>
                                          </Card>
                                        ))
                                      ) : (
                                        <div className="text-center text-gray-500">
                                          Không có kết quả.
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-end">
                                <span
                                  onClick={handleClear}
                                  className="text-sm rounded-md bg-primary hover:bg-primary/90 cursor-pointer text-white px-3.5 py-2.5"
                                >
                                  Bỏ chọn tất cả
                                </span>
                              </CardFooter>
                            </Card>
                          </TabsContent>
                          <TabsContent value="password">
                            <Card>
                              <CardHeader>
                                <TitleComponent
                                  title="Vật liệu"
                                  description="Danh sách nguyên vật liệu đã nhập."
                                />
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <Input
                                  placeholder="Tìm kiếm nguyên vật liệu..."
                                  value={searchTermM}
                                  onChange={(e) =>
                                    setSearchTermM(e.target.value)
                                  }
                                  className="md:w-[300px] w-full mb-3"
                                />
                                <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4 h-[150px]  md:min-h-[180px] overflow-y-auto ">
                                  {dataM && dataM.length > 0 ? (
                                    dataM.map((item) => (
                                      <Card
                                        className="h-[90px]  flex gap-2 shadow-md group relative"
                                        key={item.id}
                                      >
                                        <div className="group relative w-[100px] h-[90px] shadow-md rounded-md">
                                          <ImageIconMaterial dataImage={item} />
                                          <Check
                                            className={`${
                                              shipmentDetailRequests.some(
                                                (item1) =>
                                                  item1.itemId === item.id
                                              )
                                                ? "absolute top-0 right-0 bg-primary text-white"
                                                : "hidden"
                                            }`}
                                          />
                                          <span
                                            className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6 bg-primary-backgroudPrimary"
                                            onClick={() =>
                                              handleAddProducts(
                                                item,
                                                item?.image,
                                                item?.id,
                                                materialType
                                              )
                                            }
                                          >
                                            <Plus className="text-white" />
                                          </span>
                                        </div>

                                        <div className="flex flex-col w-full text-sm my-1">
                                          <div className="flex gap-2">
                                            <span className="font-medium">
                                              Tên:
                                            </span>
                                            <span className="font-light">
                                              <HoverComponent Num={10}>
                                                {item.name}
                                              </HoverComponent>
                                            </span>
                                          </div>
                                          <div className="flex gap-2">
                                            <span className="font-medium">
                                              Mô tả:
                                            </span>
                                            <span className="font-light">
                                              <HoverComponent Num={10}>
                                                {item.description}
                                              </HoverComponent>
                                            </span>
                                          </div>
                                          <div className="flex gap-2">
                                            <span className="font-medium">
                                              Đơn vị:
                                            </span>
                                            <span className="font-light">
                                              <HoverComponent Num={10}>
                                                {item.unit}
                                              </HoverComponent>
                                            </span>
                                          </div>
                                          <div className="flex gap-2">
                                            <span className="font-medium">
                                              Sẵn có:
                                            </span>
                                            <span className="font-light text-primary">
                                              <HoverComponent Num={10}>
                                                {item.quantityInStock}
                                              </HoverComponent>
                                            </span>
                                          </div>
                                        </div>
                                      </Card>
                                    ))
                                  ) : (
                                    <div className="text-center text-gray-500">
                                      Không có kết quả.
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end">
                                <span
                                  onClick={handleClear}
                                  className="text-sm rounded-md bg-primary hover:bg-primary/90 cursor-pointer text-white px-3.5 py-2.5"
                                >
                                  Bỏ chọn tất cả
                                </span>
                              </CardFooter>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="w-full overflow-auto ">
                        {productDetail.length > 0 && (
                          <Card className=" w-[1000px] sm:w-full overflow-auto">
                            <CardHeader>
                              <TitleComponent
                                title="Danh sách mặt hàng"
                                description="Danh sách sản phẩm - nguyên vật liệu trong vận chuyển."
                              />
                            </CardHeader>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    Hình ảnh
                                  </TableHead>
                                  <TableHead>Tên mặt hàng</TableHead>
                                  <TableHead>Giai đoạn</TableHead>
                                  <TableHead>Số lượng</TableHead>
                                  {/* <TableHead>Loại hàng</TableHead> */}
                                  <TableHead>Chất lượng</TableHead>
                                  <TableHead>Giá Tiền</TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {productDetail.map((proDetail, index) => (
                                  <TableRow key={proDetail.itemId}>
                                    <TableCell className="font-medium">
                                      <div className="w-[50px] h-[50px] rounded-md shadow-md">
                                        <Image
                                          src={proDetail.imgProducts}
                                          width={900}
                                          height={900}
                                          alt="ảnh sản phẩm"
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell className=" text-sm">
                                      <HoverComponent Num={15}>
                                        {proDetail.kindOfShip === 0
                                          ? `${proDetail?.item?.code}-${proDetail?.item?.name}`
                                          : `NVL-${proDetail?.item?.name}`}
                                      </HoverComponent>
                                    </TableCell>
                                    <TableCell>
                                      {proDetail.kindOfShip === 0 ? (
                                        companyType === 2 ? (
                                          <Select
                                            defaultValue={phaseId}
                                            onValueChange={(value) =>
                                              handleChange(
                                                proDetail.itemId,
                                                "phaseId",
                                                value,
                                                index
                                              )
                                            }
                                          >
                                            <SelectTrigger className="w-[100px]">
                                              <SelectValue placeholder="Giai đoạn sản phẩm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                {dataPh
                                                  .filter(
                                                    (item) =>
                                                      item.name === "PH_001" ||
                                                      item.name === "PH_002"
                                                  )
                                                  .map((item) => (
                                                    <SelectItem
                                                      key={item.id}
                                                      value={item.id}
                                                    >
                                                      {item.name}
                                                    </SelectItem>
                                                  ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        ) : (
                                          <span className="w-[100px] block">
                                            {dataPh.find(
                                              (item) =>
                                                item.id === proDetail.phaseId
                                            )?.name || "Giai đoạn sản phẩm"}
                                          </span>
                                        )
                                      ) : (
                                        <>Không có</>
                                      )}
                                    </TableCell>

                                    <TableCell>
                                      {proDetail.kindOfShip === 0 ? (
                                        <Input
                                          min={0}
                                          type="number"
                                          name="quantity"
                                          value={
                                            shipmentDetailRequests.find(
                                              (item, i) =>
                                                item.itemId ===
                                                  proDetail.itemId &&
                                                i === index
                                            )?.quantity || 0
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              proDetail.itemId,
                                              "quantity",
                                              parseInt(e.target.value),
                                              index,
                                              proDetail.kindOfShip
                                            )
                                          }
                                          className="w-20 text-center outline-none"
                                        />
                                      ) : (
                                        <Input
                                          min={0}
                                          step={0.01}
                                          type="number"
                                          name="quantity"
                                          value={
                                            shipmentDetailRequests.find(
                                              (item, i) =>
                                                item.itemId ===
                                                  proDetail.itemId &&
                                                i === index
                                            )?.quantity || 0
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              proDetail.itemId,
                                              "quantity",
                                              parseFloat(e.target.value),
                                              index,
                                              proDetail.kindOfShip
                                            )
                                          }
                                          className="w-20 text-center outline-none"
                                        />
                                      )}
                                    </TableCell>
                                    {/* <TableCell>
                                      {proDetail.kindOfShip === 0
                                        ? "Sản phẩm"
                                        : "Vật liệu"}
                                    </TableCell> */}
                                    <TableCell>
                                      {proDetail.kindOfShip === 0 ? (
                                        <Select
                                          defaultValue={String(
                                            proDetail.productPhaseType
                                          )}
                                          onValueChange={(value) =>
                                            handleChange(
                                              proDetail.itemId,
                                              "productPhaseType",
                                              parseInt(value),
                                              index
                                            )
                                          }
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Loại chất lượng sản phẩm" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              {ProductPhaseType.map((item) => (
                                                <SelectItem
                                                  key={item.id}
                                                  value={String(item.id)}
                                                >
                                                  {item.des}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div>Bình thường</div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {proDetail.kindOfShip === 1 ? (
                                        <Input
                                          min={0}
                                          max={20000000000}
                                          type="text"
                                          name="materialPrice"
                                          value={formatCurrency(
                                            shipmentDetailRequests.find(
                                              (item, i) =>
                                                item.itemId ===
                                                  proDetail.itemId &&
                                                i === index
                                            )?.materialPrice || 0
                                          )}
                                          inputMode="numeric"
                                          onChange={(e) =>
                                            handleChange(
                                              proDetail.itemId,
                                              "materialPrice",
                                              parseCurrency(e.target.value),
                                              index
                                            )
                                          }
                                          className="w-[150px] text-left outline-none"
                                        />
                                      ) : (
                                        <span className="font-light text-primary">
                                          {formatCurrency(proDetail.price)} .đ
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleDeleteProducts(
                                            proDetail.itemId,
                                            index
                                          )
                                        }
                                      >
                                        <CircleX />
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Card>
                        )}
                      </div>

                      <Separator className="h-1 my-1" />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={pending}
                      >
                        {pending ? "Đang xử lý" : "Tạo đơn"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
