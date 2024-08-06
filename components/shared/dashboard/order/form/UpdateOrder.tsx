// ** import UI
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  FormDescription,
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
import {
  CalendarIcon,
  PencilLine,
  PenLine,
  Plus,
  Truck,
  X,
} from "lucide-react";

// ** import TYPE & SCHEMA
import {
  UpdateOrderSchema,
} from "@/schema/order";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { orderApi } from "@/apis/order.api";
import toast from "react-hot-toast";
import { companyApi } from "@/apis/company.api";
import { OrderStore } from "../order-store";
import { shipOrderApi } from "@/apis/shipOrder.api";

interface OrderId {
  orderId?: orderIds;
}
interface orderIds {
  id: string;
  companyId: any;
  company: {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyEnum: string;
    companyType: number;
    companyTypeDescription: string;
  };
  status: any;
  statusType: any;
  statusDescription: string;
  startOrder: any;
  endOrder: any;
  vat: any;
}

// Define Status Enum
const OrderStatus = [
  {
    id: 0,
    des: "Đã nhận đơn hàng",
    name: "PENDING",
  },
  {
    id: 1,
    des: "Đang thực hiện",
    name: "PROCESSING",
  },
  {
    id: 2,
    des: "Đã hoàn thành",
    name: "COMPLETED",
  },
  {
    id: 3,
    des: "Đã hủy đơn hàng",
    name: "CANCELED",
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
  companyEnum: string; // Nếu có nhiều loại công ty khác nhau, bạn có thể thêm vào đây
};

interface ShipOrder {
  shipOrderId: string;
  shipperId: string;
  shipperName: string;
  shipDate: string;
  status: number;
  statusDescription: string;
  deliveryMethod: number;
  deliveryMethodDescription: string;

}

let initialFormValues: any = null;
export default function UpdateOrder({ orderId }: OrderId) {
  //state
  const [open, setOpen] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const { ForceRender } = OrderStore();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleOnDialog = () => {
    setOpen(true);
  };
  const handleOffDialogA = () => {
    setOpenAlert(false);
  };
  const handleOnDialogA = () => {
    setOpenAlert(true);
  };
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<orderIds>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTermAll, setSearchTermAll] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [company, setCompany] = useState<Company[]>([]);

  const form = useForm({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      companyId: "",
      status: 0,
      startOrder: "",
      endOrder: "",
      vat: 0,
    },
  });

  const formatDate = (dateString: any) => {
    try {
      const [year, month, day] = dateString.split("-");
      const formattedDay = day.padStart(2, "0");
      const formattedMonth = month.padStart(2, "0");
      return `${formattedDay}/${formattedMonth}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Trả về giá trị gốc nếu có lỗi
    }
  };
  // console.log("data", data);
  // console.log("ordeeidddddd", orderId);
  useEffect(() => {
    const fetchDataCompany = async () => {
      const { data } = await companyApi.getCompanyByType(1);
      setCompany(data.data);
    };
    fetchDataCompany();
    if (orderId) {
      form.reset({
        companyId: orderId.companyId,
        status: orderId.status,
        startOrder: formatDate(orderId.startOrder),
        endOrder: formatDate(orderId.endOrder),
        vat: orderId.vat,
      });
    }
  }, [orderId, currentPage, pageSize, searchTermAll, form, fetchTrigger]);

  const [dataShipOrder, setDataShipOrder] = useState<ShipOrder[]>([]);
  useEffect(() => {
    setLoading(true);
    if (orderId) {
      shipOrderApi
        .getShipOrderID(orderId.id)
        .then(({ data }) => {
          setDataShipOrder(data.data);
        })
        .catch((error) => {
          console.error("Error fetching ship order data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId,]);
  // console.log('orderIddataShipOrderdataShipOrderdataShipOrder===dataShipOrder', dataShipOrder)

  // console.log('orderId', orderId)

  const onSubmit = async (formData: z.infer<typeof UpdateOrderSchema>) => {
    console.log("formData", formData);
    setLoading(true);
    const requestBody = {
      ...formData,
      orderId: orderId?.id,
    };
    orderApi
      .updateOrder(requestBody)
      .then(({ data }) => {
        if (data.isSuccess) {
          ForceRender();
          setOpen(false)
          console.log("dâtupdatessss", data);
          toast.success("Cặp nhật đơn hàng thành công");
        }
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error("Ngày kết thúc phải lớn hàn ngày bất đầu");
        }
        console.log("errordddddddddd", error);
      });
  };

  const { pending } = useFormStatus();
  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    setFetchTrigger((prev) => prev + 1);
    form.reset();
  }




  const handleOffDialog = () => {
    const currentFormValues = form.getValues();

    // Lưu giá trị ban đầu của form nếu chưa được lưu
    if (initialFormValues === null) {
      initialFormValues = currentFormValues;
    }

    // console.log("form", currentFormValues);
    // console.log("form compare", initialFormValues);

    const isFormChanged = JSON.stringify(initialFormValues) === JSON.stringify(currentFormValues);
    // console.log("isFormChanged", isFormChanged)
    if (isFormChanged) {
      setOpen(false);
    } else {
      setOpenAlert(true);
    }
  };
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
        <Dialog.Trigger>
          <div className="rounded p-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <PenLine />
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[700px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="visible hidden"></Dialog.Title>
              <Dialog.Description className="visible hidden"></Dialog.Description>
              <div className="flex flex-col space-y-4 rounded-md bg-white">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">
                    Chỉnh sửa sản phẩm đơn hàng
                  </h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className=" p-4 overflow-y-auto">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <Card>
                        <CardContent className="flex gap-6 mt-6">
                          <div className="flex flex-col gap-6 w-full">
                            <FormField
                              control={form.control}
                              name="companyId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-primary">
                                    Công ty đặt hàng *
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={dataShipOrder.some((item) => item.status === 2)}
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
                                        <SelectItem key={item.id} value={item.id}>
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="md:flex gap-4 items-center ">
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel className="text-primary">
                                      Trạng thái *
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
                                            placeholder="Chọn trạng thái"
                                            defaultValue={String(field.value)}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Object.values(OrderStatus).map(
                                          (status) => (
                                            <SelectItem
                                              key={status.id}
                                              value={String(status.id)}
                                            >
                                              {status.des}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="vat"
                                render={({ field }) => (
                                  <FormItem className="space-y-4 w-[40%]">
                                    <FormLabel className="">
                                      <div className="text-primary">%Thuế</div>
                                    </FormLabel>
                                    <FormControl className="">
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value.toString()}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn % thuế" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">0%</SelectItem>
                                          <SelectItem value="5">5%</SelectItem>
                                          <SelectItem value="8">8%</SelectItem>
                                          <SelectItem value="10">10%</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="md:flex gap-4 ">
                              <FormField
                                control={form.control}
                                name="startOrder"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">
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
                                    <FormLabel className="flex items-center text-primary-backgroudPrimary">
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

                            <Card>
                              <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={pending}
                              >
                                {pending ? "Loading..." : "GỬI"}
                              </Button>
                            </Card>
                          </div>
                        </CardContent>
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
