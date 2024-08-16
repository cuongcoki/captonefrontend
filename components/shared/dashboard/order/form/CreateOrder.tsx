// ** import UI
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
} from "@/components/ui/alert-dialog"

// ** import REACT
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse } from "date-fns";

// ** import ICON
import { CalendarIcon, Check, CircleX, Plus, X } from "lucide-react";
import { ChevronDown, Minus, Search } from "lucide-react";

// ** import TYPE & SCHEMA
import { OrderSchema } from "@/schema/order";
import { cn, formatCurrency, limitLength } from "@/lib/utils";
import { orderApi } from "@/apis/order.api";
import toast from "react-hot-toast";
import { companyApi } from "@/apis/company.api";
import { productApi } from "@/apis/product.api";
import { filesApi } from "@/apis/files.api";
import useDebounce from "./useDebounce";
import { setApi } from "@/apis/set.api";
import ImageDisplayDialog from "./imageDisplayDialog";
import Image from "next/image";
import { NoImage } from "@/constants/images";
import { OrderStore } from "../order-store";
import TitleComponent from "@/components/shared/common/Title";
import { phaseApi } from "@/apis/phase.api";
import { shipmentApi } from "@/apis/shipment.api";
import { Phase } from "@/types/shipment.type";
import ImageDisplayDialogSet from "./imageDisplayDialogSet";
import HoverComponent from "@/components/shared/common/hover-card";

const enumCompany = [
  {
    description: "Nhà xưởng",
    id: 0,
    value: "0"
  },

];
// Define Company Type
type Company = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string | null;
  companyType: number;
  companyTypeDescription: string;
  companyEnum: string;
};

export type Product = {
  code: string;
  description: string;
  id: string;
  image: string;
  isInProcessing: boolean;
  name: string;
  price: number;
  size: string;
};

export default function CreateOrder() {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { ForceRender } = OrderStore();

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };

  // useForm hook for managing form state and validation
  const form = useForm({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      companyId: "",
      //   status: 0,
      startOrder: "",
      endOrder: "",
      vat: 0,
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTermAll, setSearchTermAll] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(1000);
  const [company, setCompany] = useState<Company[]>([]);
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [idOrder, setIdOrder] = useState<string>();

  useEffect(() => {
    const fetchDataCompany = async () => {
      const { data } = await companyApi.getCompanyByType(1);
      setCompany(data.data);
    };
    fetchDataCompany();
  }, [currentPage, pageSize, searchTermAll]);

  // ========================================================= các hàm để tìm kiếm sp và thêm =========================================================

  const [checkProducts, setCheckProducts] = useState<boolean>(false);
  const handleCheckProduct = () => {
    setCheckProducts(false);
  };
  const handleCheckOrder = () => {
    setCheckProducts(true);
  };

  // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [searchTermSet, setSearchTermSet] = useState<string>();
  const [searchResultsSet, setSearchResultsSet] = useState<any[]>([]);

  const debouncedSearchTermSet = useDebounce(searchTermSet, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchSet = () => {
    setApi
      .searchSets(searchTermSet)
      .then(({ data }) => {
        const dataSearch = data.data;
        return Promise.all(
          dataSearch.map((image: any) => {
            return filesApi
              .getFile(image.imageUrl)
              .then(({ data }) => {
                return {
                  ...image,
                  imageUrl: data.data,
                };
              })
              .catch((error) => {
                return {
                  ...image,
                  imageUrl: "NoImage",
                };
              });
          })
        );
      })
      .then((updatedImages) => {
        setSearchResultsSet(updatedImages);
      })
      .catch((error) => {
        setSearchResultsSet([])
      })
      .finally(() => { });
  };

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSizeS, setPageSizeS] = useState<number>(100);

  // console.log("searchResults", searchResultsSet)
  // console.log("searchResults", searchResults)
  useEffect(() => {
    const handleSearch = () => {
      setLoading(true);
      productApi
        .searchProductForSet(searchTerm, pageIndex, pageSizeS)
        .then(({ data }) => {
          setSearchResults(data.data.data);
        })
        .catch((error) => {
          toast.error("không tìm thấy");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    handleSearch();
  }, [searchTerm, pageIndex, pageSizeS]);

  // console.log("dataP", searchResults)

  useEffect(() => {

    if (debouncedSearchTermSet) {
      handleSearchSet();
    }
  }, [debouncedSearchTermSet, searchTermSet]);

  useEffect(() => {
    if (debouncedSearchTerm) {
    }
  }, [debouncedSearchTerm, searchTerm]);

  // ========================================================= các hàm để thêm sản phẩm và số lượng vào bộ sản phẩm =========================================================

  const [getDetailsPro, setGetDetailsPro] = useState<any[]>([]);
  const [productsRequest, setProductsRequest] = useState<
    {
      productIdOrSetId: string;
      quantity: number;
      unitPrice: string;
      note: string;
      isProductId: boolean;
    }[]
  >([]);
  const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);

  // ** hàm thêm vào danh sách sản phẩm
  const handleAddProducts = (product: any, productType: any) => {
    // Kiểm tra xem sản phẩm đã có trong danh sách setGetDetailsProUpdate chưa
    const existingDetailProUpdate = getDetailsProUpdate.some(
      (item) => item.productId === product.id
    );

    if (existingDetailProUpdate) {
      return toast.error("Sản phẩm đã tồn tại");
    }

    // Kiểm tra xem sản phẩm đã có trong danh sách getDetailsPro chưa
    const existingDetailProduct = getDetailsPro.find(
      (item) => item.id === product.id
    );

    if (!existingDetailProduct) {
      // Nếu chưa có, thêm sản phẩm vào danh sách getDetailsPro
      const updatedProduct = {
        ...product,
        productType: productType, // Thêm thuộc tính productType vào product
      };
      const updatedDetailsPro = [...getDetailsPro, updatedProduct];
      setGetDetailsPro(updatedDetailsPro);
    }

    // Kiểm tra xem sản phẩm đã có trong danh sách productsRequest chưa
    const existingProduct = productsRequest.find(
      (item) => item.productIdOrSetId === product.id
    );

    if (existingProduct) {
      // Nếu đã có, tăng số lượng lên 1
      const updatedProductsRequest = productsRequest.map((item) =>
        item.productIdOrSetId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setProductsRequest(updatedProductsRequest);
    } else {
      // Nếu chưa có, thêm sản phẩm vào danh sách với số lượng là 1 và các thuộc tính khác
      setProductsRequest([
        ...productsRequest,
        {
          productIdOrSetId: product.id,
          quantity: 1,
          unitPrice: product.price,
          note: "",
          isProductId: checkProducts ? false : true,
        },
      ]);
    }
  };

  const handleMinusProducts = (productId: string) => {
    const updatedDetailsPro = getDetailsPro.filter(
      (product) => product.id !== productId
    );
    setGetDetailsPro(updatedDetailsPro);

    // Lọc sản phẩm cần xóa khỏi productsRequest
    const updatedProductsRequest = productsRequest.filter(
      (product) => product.productIdOrSetId !== productId
    );
    setProductsRequest(updatedProductsRequest);

    // toast.success("Đã xóa sản phẩm khỏi danh sách");
  };

  const handleChange = (productId: string, name: string, value: any) => {
    if (name == "quantity" && !value) {
      value = 1;
    }

    if (name === "unitPrice" && !value) {
      value = "0";
    }
    setProductsRequest((prev) => {
      return prev.map((item) => {
        if (item.productIdOrSetId === productId) {
          return { ...item, [name]: value };
        }
        return item;
      });
    });
  };

  const onSubmit = async (formData: z.infer<typeof OrderSchema>) => {
    const productsRequestTrimmed = productsRequest.map((product) => ({
      productIdOrSetId: product.productIdOrSetId,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      note: product.note.trim(),
      isProductId: product.isProductId,
    }));
    const requestBody = {
      companyId: formData.companyId,
      status: 0,
      startOrder: formData.startOrder,
      endOrder: formData.endOrder,
      vat: formData.vat,
      orderDetailRequests: productsRequestTrimmed,
    };
    setLoading(true);
    try {
      const response = await orderApi.createOrder(requestBody);
      setIdOrder(response.data.data);
      toast.success("Tạo đơn hàng thành công");
      if (response.data.isSuccess) {
        ForceRender();
        setOpen(false)
        setNextStep(true);
      }
    } catch (error: any) {
      if (error.response.data.error) {
        const Check = error.response.data.error;
        if (typeof (Check) === 'string') {
          toast.error(Check);
        } else {
          for (const key in error.response.data.error) {
            toast.error(error.response.data.error[key][0]);
          }
        }
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const productCheck = 0;
  const setCheck = 1;

  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    form.reset();
    setProductsRequest([]);
    setGetDetailsPro([]);
    setSearchTerm("");
    setSearchTermSet("")
    setSearchResults([]);
    setSearchResultsSet([]);
  }

  const { formState } = form;
  const handleOffDialog = () => {
    // Kiểm tra xem mảng có rỗng hay không
    const isDetailsProEmpty = Array.isArray(getDetailsPro) && getDetailsPro.length === 0;
    const isProductsRequestEmpty = Array.isArray(productsRequest) && productsRequest.length === 0;

    // Nếu tất cả các trường trong form đều trống hoặc không có giá trị và các mảng rỗng
    if (isDetailsProEmpty && isProductsRequestEmpty && !formState.isDirty) {
      setOpen(false);
    } else {
      setOpenAlert(true);
    }
  };

  const productType = 0;
  const setType = 1;
  return (
    <>
      {
        openAlert && (
          <AlertDialog open={openAlert} >
            <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn tắt biểu mẫu này không ??</AlertDialogTitle>
                <AlertDialogDescription>
                  Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn những dữ liệu mà bạn đã nhập
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleOffDialogA}>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearForm}>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
          <Plus />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className="w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Tạo Đơn Đặt Hàng</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOffDialog}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid p-4 overflow-y-auto h-[650px] gap-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      <Card>
                        <CardHeader>
                          <TitleComponent
                            title="Thông tin đơn hàng"
                            description="Thông tin công ty - thuế - thời gian đặt hàng của đơn đặt hàng."
                          />
                        </CardHeader>
                        <CardContent className="flex gap-4">
                          <div className="flex flex-col gap-4 w-full">
                            <FormField
                              control={form.control}
                              name="companyId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-primary-backgroudPrimary">
                                    Công ty *
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder="Hãy chọn công ty"
                                          defaultValue={field.value}
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {company.map((item) => (
                                        <SelectItem
                                          key={item.id}
                                          value={item.id}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex gap-6 items-start ">
                              <FormField
                                control={form.control}
                                name="vat"
                                render={({ field }) => (
                                  <FormItem >
                                    <FormLabel className="">
                                      <div className="mb-2 text-primary">
                                        %Thuế
                                      </div>
                                    </FormLabel>
                                    <FormControl className="mt-2">
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value.toString()}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn % thuế" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">
                                            0%
                                          </SelectItem>
                                          <SelectItem value="5">
                                            5%
                                          </SelectItem>
                                          <SelectItem value="8">
                                            8%
                                          </SelectItem>
                                          <SelectItem value="10">
                                            10%
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="startOrder"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center text-primary">
                                      Ngày bắt đầu *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[240px] pl-3 text-left font-normal",
                                              !field.value &&
                                              "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              field.value
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
                                              ? parse(
                                                field.value,
                                                "dd/MM/yyyy",
                                                new Date()
                                              )
                                              : undefined
                                          }
                                          onSelect={(date: any) =>
                                            field.onChange(
                                              format(date, "dd/MM/yyyy")
                                            )
                                          }
                                          // disabled={(date) =>
                                          //   date > new Date() || date < new Date("1900-01-01")
                                          // }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="endOrder"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center text-primary">
                                      Ngày kết thúc *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[240px] pl-3 text-left font-normal",
                                              !field.value &&
                                              "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              field.value
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
                                              ? parse(
                                                field.value,
                                                "dd/MM/yyyy",
                                                new Date()
                                              )
                                              : undefined
                                          }
                                          onDayClick={(date: any) =>
                                            field.onChange(
                                              format(date, "dd/MM/yyyy")
                                            )
                                          }
                                          disabled={(date) =>
                                            date < new Date("2024-01-01")
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="grid gap-4 lg:grid-cols-5 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
                          <Card>
                            <CardHeader>
                              <TitleComponent
                                title="Danh sách mặt hàng"
                                description="Tìm kiếm - thêm mặt hàng vào đơn đặt hàng."
                              />
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col  items-center my-4">
                                <div className="flex items-center border w-full rounded-lg px-2 ">
                                  <Search className="mr-1 h-4 w-4 shrink-0 opacity-50" />
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <ChevronDown className="mr-2 h-4 w-4 text-primary-backgroudPrimary" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      <DropdownMenuItem
                                        onClick={handleCheckProduct}
                                      >
                                        Sản phẩm
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={handleCheckOrder}>
                                        Bộ sản phẩm
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  {!checkProducts ? (
                                    <Input
                                      placeholder="Tìm kiếm mã - tên sản phẩm ..."
                                      value={searchTerm}
                                      onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                      }}
                                      className="border-none w-full"
                                    />
                                  ) : (
                                    <Input
                                      placeholder="Tìm kiếm bộ sản phẩm..."
                                      value={searchTermSet}
                                      onChange={(e) =>
                                        setSearchTermSet(e.target.value)
                                      }
                                      className="border-none w-full"
                                    />
                                  )}
                                </div>
                              </div>

                              {!checkProducts ? (
                                <Card className="my-4">
                                  <CardHeader className="font-semibold text-xl">
                                    <span>Thông tin sản phẩm</span>
                                  </CardHeader>
                                  <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4 h-[150px]  md:min-h-[180px] overflow-y-auto ">
                                    {searchResults !== null ? (
                                      searchResults.map((product) => (
                                        <Card className="h-[90px] flex gap-2 shadow-md group relative" key={product.id} >
                                          <div className="group relative w-[100px] h-[90px] shadow-md rounded-md">
                                            <ImageDisplayDialog
                                              images={product}
                                              checkProduct={productCheck}
                                            />
                                            <Check
                                              className={`w-5 h-5 ${productsRequest.some(
                                                (item1) => item1.productIdOrSetId === product.id
                                              )
                                                ? "absolute top-0 right-0 bg-primary text-white"
                                                : "hidden"
                                                }`}
                                            />
                                            <span
                                              className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                              onClick={() =>
                                                handleAddProducts(product, productType)
                                              }
                                            >
                                              <Plus className="text-white" />
                                            </span>
                                          </div>

                                          <div className="flex flex-col w-full text-sm my-1">
                                            <div className="flex gap-2">
                                              <span className="font-medium">Mã:</span>
                                              <span className="font-light">
                                                <HoverComponent Num={10}>
                                                  {product.code}
                                                </HoverComponent>
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <span className="font-medium">Tên:</span>
                                              <span className="font-light">
                                                <HoverComponent Num={10}>
                                                  {product.name}
                                                </HoverComponent>
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <span className="font-medium">Kích thước:</span>
                                              <span className="font-light">
                                                <HoverComponent Num={10}>
                                                  {product.size}
                                                </HoverComponent>
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <span className="font-medium">Giá thành:</span>
                                              <span className="font-light text-primary">
                                                <HoverComponent Num={10}>{formatCurrency(product.price)}</HoverComponent> .đ</span>
                                            </div>
                                          </div>
                                        </Card>
                                      ))
                                    ) : (
                                      <div className="text-center text-gray-500">Không có kết quả.</div>
                                    )}
                                  </div>
                                </Card>
                              ) : (
                                <Card className="my-4">
                                  <CardHeader className="font-semibold text-xl">
                                    <span>Thông tin bộ sản phẩm</span>
                                  </CardHeader>
                                  <div className=" w-full grid grid-cols-3 md:grid-cols-3 gap-4 h-[150px]  md:min-h-[180px] overflow-y-auto ">
                                    {searchResultsSet !== null ? (
                                      searchResultsSet.map((product) => (
                                        <Card className=" h-[90px] flex gap-2 shadow-md group relative" key={product.id} >
                                          <div className="group relative w-[100px] max-h-[90px] shadow-md rounded-md">
                                            <ImageDisplayDialogSet
                                              images={product}
                                              checkProduct={setCheck}
                                            />
                                            <Check
                                              className={`w-5 h-5 ${productsRequest.some(
                                                (item1) => item1.productIdOrSetId === product.id
                                              )
                                                ? "absolute top-0 right-0 bg-primary text-white"
                                                : "hidden"
                                                }`}
                                            />
                                          </div>
                                          <div>
                                            <span
                                              className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                              onClick={() =>
                                                handleAddProducts(product, setType)
                                              }
                                            >
                                              <Plus className="text-white" />
                                            </span>
                                          </div>

                                          <div className="flex flex-col w-full text-sm my-1">
                                            <div className="flex gap-2">
                                              <span className="font-medium">Mã:</span>
                                              <span className="font-light">
                                                <HoverComponent Num={10} >
                                                  {product.code}
                                                </HoverComponent>
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <span className="font-medium">Tên:</span>
                                              <span className="font-light">
                                                <HoverComponent Num={20} >
                                                  {product.name}
                                                </HoverComponent>
                                              </span>
                                            </div>

                                          </div>
                                        </Card>
                                      ))
                                    ) : (
                                      <div className="text-center text-gray-500">Không có kết quả.</div>
                                    )}
                                  </div>
                                </Card>
                              )}

                              <div className="md:col-span-1 md:mt-0 md:w-full w-[1000px]">
                                <Card className="mt-4">
                                  <CardHeader className="font-semibold text-xl">
                                    <span>Thông tin mặt hàng thêm vào đơn đặt hàng</span>
                                  </CardHeader>
                                  <CardContent >
                                    <Table >
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[100px]">Mặt hàng
                                          </TableHead>
                                          <TableHead>Loại hàng</TableHead>
                                          <TableHead>Số lượng</TableHead>
                                          <TableHead>Đơn giá</TableHead>
                                          <TableHead>Ghi chú</TableHead>
                                          <TableHead></TableHead>
                                        </TableRow>
                                      </TableHeader>

                                      <TableBody >
                                        {getDetailsPro.map((product, index) => (
                                          <TableRow key={index} >
                                            <TableCell className="font-medium w-[20%]">
                                              <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1">
                                                  <Image
                                                    alt="ảnh mẫu"
                                                    className="w-[50px] h-[50px] rounded-lg object-cover"
                                                    width={900}
                                                    height={900}
                                                    src={
                                                      product?.imageUrl && product.imageUrl !== "Image_not_found"
                                                        ? product.imageUrl
                                                        : product?.image === "Image_not_found"
                                                          ? NoImage
                                                          : product?.image
                                                    }
                                                  />
                                                </div>

                                                <div className="font-medium dark:text-white">
                                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {limitLength(product.code, 10)} - {limitLength(product.name, 15)}
                                                  </div>
                                                </div>
                                              </div>
                                            </TableCell>
                                            <TableCell>{product.productType === 0 ? "Sản phẩm" : "Bộ sản phẩm"}</TableCell>
                                            <TableCell className="font-medium">
                                              <Input
                                                name="quantity"
                                                value={formatCurrency(
                                                  productsRequest.find(
                                                    (item) =>
                                                      item.productIdOrSetId ===
                                                      product.id
                                                  )?.quantity
                                                )}
                                                onChange={(e) =>
                                                  handleChange(
                                                    product.id,
                                                    "quantity",
                                                    parseInt(
                                                      e.target.value.replace(
                                                        /\./g,
                                                        ""
                                                      )
                                                    )
                                                  )
                                                }
                                                className="w-16 text-left outline-none"
                                              />
                                            </TableCell>

                                            <TableCell className="font-medium">
                                              <Input
                                                name="unitPrice"
                                                step={1}
                                                value={formatCurrency(
                                                  productsRequest.find(
                                                    (item) =>
                                                      item.productIdOrSetId ===
                                                      product.id
                                                  )?.unitPrice || 0
                                                )}
                                                onChange={(e) =>
                                                  handleChange(
                                                    product.id,
                                                    "unitPrice",
                                                    parseInt(
                                                      e.target.value.replace(
                                                        /\./g,
                                                        ""
                                                      )
                                                    )
                                                  )
                                                }
                                                className="w-32 text-left outline-none"
                                              />
                                            </TableCell>

                                            <TableCell className="relative">
                                              {/* <div className="overflow-auto bg-green-200 p-4 w-[200px] h-24 text-justify break-words whitespace-pre-wrap"> */}
                                              <Textarea
                                                id="note"
                                                name="note"
                                                value={
                                                  productsRequest.find(
                                                    (item) =>
                                                      item.productIdOrSetId ===
                                                      product.id
                                                  )?.note || ""
                                                }
                                                onChange={(e) =>
                                                  handleChange(
                                                    product.id,
                                                    "note",
                                                    e.target.value
                                                  )
                                                }
                                                className="col-span-3 "
                                              />
                                              {/* </div> */}
                                            </TableCell>

                                            <TableCell className="">
                                              <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                  handleMinusProducts(product.id)
                                                }
                                              >
                                                <CircleX />
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <Card>
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? "Đang xử lý..." : "Tạo đơn đặt hàng"}
                        </Button>
                      </Card>
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
