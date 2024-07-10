// import UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parse, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";
// import ICON
import { CalendarIcon, Check, CirclePlus, CircleX, Plus, X } from "lucide-react";

// import REACT
import { useEffect, useState } from "react";
import { ShipOrderSchema } from "@/schema/shipOrder";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { shipOrderApi } from "@/apis/shipOrder.api";
import { error } from "console";
import { cn } from "@/lib/utils";
import { userApi } from "@/apis/user.api";
import { UserSearchParams } from "@/types/userTypes";
import Image from "next/image";
import { orderApi } from "@/apis/order.api";
import toast from "react-hot-toast";

// Define Status Enum
const OrderStatus = [
  {
    id: 0,
    des: "Trả hàng lỗi",
    name: "PENDING"
  },
  {
    id: 1,
    des: "Gửi hàng đi",
    name: "PROCESSING"
  },
];



interface ShipOrderDetailRequest {
  itemId: string,
  quantity: number,
  itemKind: number,
}
interface shipOrder {
  shipperId: string;
  kindOfShipOrder: number;
  orderId: string;
  shipDate: string;
  shipOrderDetailRequests: ShipOrderDetailRequest[];
}
interface OrderId {
  orderId?: any;
}

// type của OrderById
interface orderIds {
  id: string,
  companyId: string,
  company: {
    id: string,
    name: string,
    address: string,
    directorName: string,
    directorPhone: string,
    email: string,
    companyEnum: string,
    companyType: number,
    companyTypeDescription: string
  },
  status: number,
  statusType: string,
  statusDescription: string,
  startOrder: string,
  endOrder: string,
  vat: number
}

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

interface OrderIdData {
  orderId: string,
  productOrderResponses: productOrderResponses[],
  setOrderResponses: setOrderResponses[]
}

interface productOrderResponses {
  productId: string,
  productCode: string
  productName: string
  productDescription: string
  imageProductUrl: string,
  quantity: number
  unitPrice: number
  note: number
}
interface setOrderResponses {
  setId: string,
  setName: string,
  setDescription: string,
  imageSetUrl: string,
  productResponses: productResponses[]
  quantity: number
  unitPrice: number
  note: number
}

interface productResponses {
  id: string,
  name: string,
  code: string,
  price: number,
  size: number,
  description: string,
  isInProcessing: boolean,
  imageResponses: imageResponses[]
}
interface imageResponses {
  id: string,
  imageUrl: string,
  isBluePrint: boolean,
  isMainImage: boolean,
}



export const FormShipOrder: React.FC<OrderId> = ({ orderId }) => {
  // ** state for dialog
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };

  // ** state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<shipOrder>();
  // const [order, setOrder] = useState<orderIds>(orderId);
  const [order, setOrder] = useState<OrderIdData>({ orderId: "", productOrderResponses: [], setOrderResponses: [] });

  // ** state user
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(11);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [roleId, setRoleId] = useState<number>(4);
  const [searchTearm, setSearchTearm] = useState<string>("");
  const [dataEm, setDataEm] = useState<Employee[]>([]);

  // ** các hàm sử lý logic
  const [shipOrderDetailRequests, setShipOrderDetailRequests] = useState<ShipOrderDetailRequest[]>([]);
  const [productDetail, setProductDetail] = useState<any[]>([]);

  // Hàm thêm sản phẩm
  const handleAddProducts = (imgProducts: string, itemId: string, itemKind: number) => {
    // check id
    const itemExists = shipOrderDetailRequests.some((item) => item.itemId === itemId);
    if (itemExists) {
      toast.error("sản phẩm này đã thêm");
      return;
    }
    setShipOrderDetailRequests((prev: any) => [
      ...prev,
      { itemId: itemId, quantity: 1, itemKind }
    ]);
    setProductDetail((prev) => [
      ...prev,
      { itemId: itemId, imgProducts, itemKind }
    ]);
  };

  // Hàm xóa sản phẩm
  const handleDeleteProducts = (itemId: string) => {
    setShipOrderDetailRequests((prev) =>
      prev.filter((item) => item.itemId !== itemId)
    );
    setProductDetail((prev) =>
      prev.filter((product) => product.itemId !== itemId)
    );
  };

  // Hàm thay đổi giá trị của một sản phẩm
  const handleChange = (itemId: string, name: keyof ShipOrderDetailRequest, value: any) => {
    setShipOrderDetailRequests((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          return { ...item, [name]: value };
        }
        return item;
      })
    );
  };

  // ** callData
  useEffect(() => {
    if (orderId) {
      setOrder(orderId);
    }
  }, [orderId]);

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
        console.log("Response:", res);
      } catch (error: any) {
        console.error("Error fetching user data:");
        if (error?.response.data.status === 400) {
          // toast.error(error?.response.data.message);
          setDataEm([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, dataEm]);

  // ** form
  const form = useForm({
    resolver: zodResolver(ShipOrderSchema),
    defaultValues: {
      shipperId: '',
      kindOfShipOrder: 0,
      shipDate: '',
    },
  });

  const validateShipOrderDetailRequests = (shipOrderDetailRequests: ShipOrderDetailRequest[]) => {
    shipOrderDetailRequests.forEach((detail, index) => {
      if (detail.quantity <= 0) {
        toast.error(`Số lượng cho item ${index + 1} phải lớn hơn 0`);
      }
    });
  };

  const onSubmit = (data: z.infer<typeof ShipOrderSchema>) => {
    console.log('data', data)

    // Gọi hàm kiểm tra
    validateShipOrderDetailRequests(shipOrderDetailRequests);
    const requestBody = {
      shipperId: data.shipperId,
      kindOfShipOrder: data.kindOfShipOrder,
      orderId: order.orderId,
      shipDate: data.shipDate,
      shipOrderDetailRequests: shipOrderDetailRequests
    };

    console.log("requestBody", requestBody);
    setLoading(true)
    shipOrderApi.createShipOrder(requestBody)
      .then(({ data }) => {
        console.log("data", data)
        if (data.isSuccess) {
          toast.success(data.message);
        }
      })
      .catch(error => {
        const errorResponse = error.response?.data?.error;
        if (errorResponse?.ShipDate) {
          toast.error(errorResponse.ShipDate);
        } else {
          toast.error(error.response?.data?.message);
        }
        if (errorResponse?.ShipOrderDetailRequests) {
          toast.error(errorResponse.ShipOrderDetailRequests);
        }
      })
      .finally(() => {
        setLoading(false)
      })

  };

  // consolog
  // console.log("orderFormmmmmmmm", order);
  // console.log("dataEm", dataEm)
  // console.log('shipOrderDetailRequests===', shipOrderDetailRequests)
  // console.log('productDetail==', productDetail)

  const productType = 0;
  const setType = 1;

  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger className="rounded p-2 hover:bg-primary/90 bg-primary">
        <Plus onClick={handleOnDialog} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[500px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
            <Dialog.Title className="hidden visible">
              hidden
            </Dialog.Title>
            <div className="bg-slate-100  flex flex-col ">
              <div className="p-4 flex items-center justify-between bg-primary  rounded-t-md">
                <h2 className="text-2xl text-white">Tạo đơn vận chuyển</h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4 dark:text-white" />
                </Button>
              </div>
              <div className="flex flex-col gap-4 p-4 dark:bg-card max-h-[650px]  overflow-auto">
                <div className=" w-full grid grid-cols-4 gap-4 min-h-[100px]  overflow-y-auto ">
                  {
                    order.productOrderResponses.map(pro => (
                      <div className="group relative w-[100px] h-[100px] shadow-md">
                        <Image src={pro.imageProductUrl} alt="ảnh sản phẩm" className="w-full h-full object-contain" width={900} height={900} />
                        <Check className={`${shipOrderDetailRequests.some(item => item.itemId === pro.productId) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                        <Button variant={"ghost"} size={"icon"} className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 hover:bg-primary" onClick={() => handleAddProducts(pro.imageProductUrl, pro.productId, productType)}><CirclePlus className="text-white" /></Button>
                      </div>
                    ))
                  }
                  {
                    order.setOrderResponses.map(pro => (
                      <div className="group relative w-[100px] h-[100px] shadow-md">
                        <Image src={pro.imageSetUrl} alt="ảnh bộ sản phẩm" className="w-full h-full object-contain" width={900} height={900} />
                        <Check className={`${shipOrderDetailRequests.some(item => item.itemId === pro.setId) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                        <Button variant={"ghost"} size={"icon"} className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 hover:bg-primary " onClick={() => handleAddProducts(pro.imageSetUrl, pro.setId, setType)}><CirclePlus className="text-white" /></Button>
                      </div>
                    ))
                  }
                </div>
                {productDetail.length > 0 && (
                  <Card >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Ảnh</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="min-h-[200px] overflow-y-auto">
                        {
                          productDetail.map((proDetail, index) => (
                            <TableRow >
                              <TableCell className="font-medium">
                                <div className="w-[50px] h-[50px] rounded-md shadow-md">
                                  <Image src={proDetail.imgProducts} width={900} height={900} alt="ảnh sản phẩm" className="w-ful h-ful object-contain" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  name="quantity"
                                  value={
                                    shipOrderDetailRequests.find(
                                      (item) => item.itemId === proDetail.itemId
                                    )?.quantity || 0
                                  }
                                  onChange={(e) => handleChange(proDetail.itemId, 'quantity', parseInt(e.target.value))}
                                  className="w-16 text-center outline-none"
                                />
                              </TableCell>
                              <TableCell>
                                {proDetail.itemKind === 0 ? "Sản phẩm" : "Bộ sản phẩm"}
                              </TableCell>
                              <TableCell>
                                <Button variant={"ghost"} size={"icon"} onClick={() => handleDeleteProducts(proDetail.itemId)}><CircleX /></Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>

                    </Table>
                  </Card>
                )}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4"
                  >


                    <FormField
                      control={form.control}
                      name="shipperId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-backgroudPrimary">Nhân viên vận chuyển *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-16">
                                <SelectValue placeholder="Hãy chọn nhân viên" defaultValue={field.value} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataEm.map((item) => (
                                <SelectItem key={item.id} value={item.id} >
                                  <div className="flex items-center gap-4">
                                    <Image className="w-12 h-12 rounded-full shadow-md" src={item.avatar} width={900} height={900} alt="ảnh nhân viên" />
                                    <div className="font-medium dark:text-white">
                                      <div>{item.firstName} {item.lastName}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.id}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.companyName}</div>
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
                      name="kindOfShipOrder"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-primary-backgroudPrimary">
                            Loại đơn đặt hàng *
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Hãy chọn loại đơn"
                                  defaultValue={String(field.value)}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(OrderStatus).map((status) => (
                                <SelectItem key={status.id} value={String(status.id)}>
                                  {status.des}
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
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center text-primary-backgroudPrimary">
                            Ngày đặt hàng *
                          </FormLabel>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(parseISO(field.value), "dd/MM/yyyy")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? parseISO(field.value) : undefined}
                                onSelect={(date: any) => field.onChange(date.toISOString())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />



                    <Separator className="h-1 my-1" />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Tạo đơn"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}



