import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ** import REACT
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ** import Components
import { PenLine } from "lucide-react";
import { FormShipOrder } from "./form/FormShipOrder";
import { shipOrderApi } from "@/apis/shipOrder.api";
import { FormUpdateShipOrder } from "./form/FormUpdateShipOrder";
import ImageIconShipOrder from "./ImageIconShipOrder";
import Link from "next/link";
import TitleComponent from "@/components/shared/common/Title";
import { OrderStore } from "../../order-store";
import ShipOrderChangeStatus from "@/components/shared/dashboard/order/orderID/shipOrder/ship-order-change-status";

const OrderStatus = [
  {
    id: 0,
    des: "Đang đợi giao",
    name: "PENDING",
  },
  {
    id: 1,
    des: "Đang được giao",
    name: "PROCESSING",
  },
  {
    id: 2,
    des: "Đã giao thành công",
    name: "PROCESSING",
  },
  {
    id: 3,
    des: "Đã hủy",
    name: "PROCESSING",
  },
];

// type của shipOrder

// type của OrderById
interface OrderIdData {
  orderId: string;
  productOrderResponses: productOrderResponses[];
  setOrderResponses: setOrderResponses[];
}

interface productOrderResponses {
  productId: string;
  productCode: string;
  productName: string;
  productDescription: string;
  imageProductUrl: string;
  quantity: number;
  unitPrice: number;
  note: number;
}
interface setOrderResponses {
  setId: string;
  setName: string;
  setDescription: string;
  imageSetUrl: string;
  productResponses: productResponses[];
  quantity: number;
  unitPrice: number;
  note: number;
}

interface productResponses {
  id: string;
  name: string;
  code: string;
  price: number;
  size: number;
  description: string;
  isInProcessing: boolean;
  imageResponses: imageResponses[];
}
interface imageResponses {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}

interface OrderId {
  orderId?: any;
  checkStatus: any;
}

interface ImageResponse {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: ImageResponse[];
}

interface Set {
  id: string;
  name: string;
  code: string;
  price: number;
  size: string;
  description: string;
  isInProcessing: boolean;
  imageResponses: ImageResponse[];
}

interface ShipOrderDetailResponse {
  product: Product | null;
  set: Set | null;
  quantity: number;
}

export interface ShipOrder {
  shipOrderId: string;
  shipperId: string;
  shipperName: string;
  shipDate: string;
  status: number;
  statusDescription: string;
  deliveryMethod: number;
  deliveryMethodDescription: string;
  shipOrderDetailResponses: ShipOrderDetailResponse[];
  isAccepted: boolean;
}

export const ShipOrder: React.FC<OrderId> = ({ orderId, checkStatus }) => {
  // ** state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ShipOrder[]>([]);
  const [order, setOrder] = useState<OrderIdData>(orderId);

  // ** callData
  useEffect(() => {
    if (orderId) {
      setOrder(orderId);
    }
  }, [orderId]);
  const [valueStatus, setValueStatus] = useState<any>(0);
  const { force, ForceRender } = OrderStore();

  const handleSelectChange = (value: any, id: string) => {
    setValueStatus(value);
  };
  const handleSubmitOrderStatus = (id: string) => {
    const formattedData = {
      shipOrderId: id,
      status: valueStatus,
    };
    shipOrderApi.updateStatus(formattedData, id).then(({ data }) => {
      toast.success(data.message);
      ForceRender();
    });
  };

  useEffect(() => {
    setLoading(true);
    if (orderId) {
      shipOrderApi
        .getShipOrderID(order.orderId)
        .then(({ data }) => {
          setData(data.data);
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, order, valueStatus, force]);

  // ** handle render order detail
  const [indexItemShipOrder, setIndexItemShipOrder] = useState<number>(0);
  const handleIndex = (index: number) => {
    setIndexItemShipOrder(index);
    console.log(index);
  };

  function formatDate(inputDate: string): string {
    if (!inputDate) return "";
    const [year, month, day] = inputDate.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  }

  const handleAcceptOrder = (shipOrderId: string) => {
    shipOrderApi
      .isAcceptedShipOrder(shipOrderId)
      .then(({ data }) => {
        ForceRender();
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-10 gap-6 ">
      <Card className="sm:col-span-1 md:col-span-10 lg:col-span-7 shadow-sm overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <TitleComponent
              title="Vận chuyển đơn hàng"
              description="Danh sách các đơn hàng vận chuyển."
            />
            {checkStatus === 1 ? <FormShipOrder orderId={orderId} /> : ""}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên vận chuyển</TableHead>
                <TableHead>Ngày giao</TableHead>
                <TableHead>Loại đơn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  className="bg-accent cursor-pointer"
                  key={index}
                  onClick={() => handleIndex(index)}
                >
                  <TableCell>
                    <div className="font-medium">{item.shipperName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {item.shipperId}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.shipDate)}</TableCell>
                  <TableCell>{item.deliveryMethodDescription}</TableCell>
                  <TableCell>
                    {item.isAccepted === false ? (
                      <ShipOrderChangeStatus
                        item={item}
                        handleSubmitOrderStatus={handleSubmitOrderStatus}
                      >
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="Trạng thái" className="text-right">
                              Trạng thái
                            </Label>
                            <Select
                              defaultValue={String(item.status)}
                              onValueChange={(value) =>
                                handleSelectChange(
                                  Number(value),
                                  item.shipOrderId
                                )
                              }
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue
                                  placeholder="Hãy chọn loại đơn"
                                  defaultValue={item.status}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {OrderStatus.map((status) => (
                                  <SelectItem
                                    key={status.id}
                                    value={String(status.id)}
                                  >
                                    {status.des}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </ShipOrderChangeStatus>
                    ) : (
                      <span>{item.statusDescription}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isAccepted === false ? (
                      <span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-yellow-500 hover:bg-yellow-500/80">
                              Xác nhận
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có hoàn toàn chắc chắn không?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn sẽ không thể chỉnh sửa hay bất kỳ thao tác
                                gì cho đơn hàng này nữa, bạn chắc chắn chứ
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleAcceptOrder(item.shipOrderId)
                                }
                              >
                                Xác nhận
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
                    ) : (
                      <span>
                        {item.isAccepted === true
                          ? "Đã xác nhận đơn hàng"
                          : "Chưa xác nhận đơn hàng"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.status === 2 ||
                    item.status === 3 ||
                    checkStatus === false ? (
                      <>
                        {item.isAccepted === false ? (
                          <Button
                            className="rounded p-2 hover:bg-gray text-black bg-gay"
                            onClick={() => {
                              toast.error(
                                "Hãy chuyển sang trạng thái đang đợi giao để chỉnh sửa"
                              );
                            }}
                          >
                            {" "}
                            <PenLine />
                          </Button>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <FormUpdateShipOrder
                        orderId={orderId}
                        shipOrderId={item}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="sm:col-span-1 md:col-span-10 lg:col-span-3 shadow-sm">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Giao hàng
            </CardTitle>
            {data[indexItemShipOrder] && (
              <CardDescription>{`Ngày ${formatDate(
                data[indexItemShipOrder]?.shipDate
              )}`}</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Đơn hàng chi tiết</div>
            <ul className="  h-[260px] overflow-auto">
              {data[indexItemShipOrder]?.shipOrderDetailResponses.map(
                (products, index) => (
                  <li
                    className="p-2 shadow-sm hover:bg-gray-100/90 cursor-pointer"
                    key={index}
                  >
                    <span className="text-muted-foreground flex justify-between items-center ">
                      <span className="w-[50px] h-[50px] shadow-md rounded-md">
                        <Link
                          href={`/dashboard/products/product/${products.product?.id}`}
                        >
                          {" "}
                          <ImageIconShipOrder
                            dataImage={products.product?.imageResponses}
                          />{" "}
                        </Link>
                      </span>
                      {products.product?.code}-{products.product?.name}
                      <span>x</span>
                      <span>{products.quantity}</span>
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
