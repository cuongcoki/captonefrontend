"use client";

// ** import UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { useState } from "react";
import toast from "react-hot-toast";

import { X } from "lucide-react";
import { shipmentApi } from "@/apis/shipment.api";
import { ShipmentStore } from "../shipment-store";
interface shipmentIDType {
  id: string;
  status: number;
  statusDescription: string;
}

interface ShipmentIDProps {
  shipmentID: shipmentIDType;
}

const OrderStatus = [
  {
    id: 0,
    des: "Đang đợi giao",
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
    name: "PROCESSING",
  },
  {
    id: 3,
    des: "Đã hủy",
    name: "PROCESSING",
  },
];
export const ChangeStatusShipmentShipper: React.FC<ShipmentIDProps> = ({
  shipmentID,
}) => {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { ForceRender } = ShipmentStore();
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };

  const [valueStatus, setValueStatus] = useState<any>(0);

  const handleSelectChange = (value: any, id: string) => {
    setValueStatus(value);
  };

  const handleSubmitOrderStatus = () => {
    const requestBody = {
      shipmentId: shipmentID.id,
      status: valueStatus,
    };
    setLoading(true);
    shipmentApi
      .changeStatusByShipper(shipmentID.id, requestBody)
      .then(({ data }) => {
        setOpen(false);
        ForceRender();
        toast.success(data.message);
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error?.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{shipmentID.statusDescription}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              defaultValue={String(shipmentID.status)}
              onValueChange={(value) =>
                handleSelectChange(Number(value), shipmentID.id)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Hãy chọn loại đơn"
                  defaultValue={shipmentID.status}
                />
              </SelectTrigger>
              <SelectContent>
                {OrderStatus.map((status) => (
                  <SelectItem key={status.id} value={String(status.id)}>
                    {status.des}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleOffDialog}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmitOrderStatus}>Lưu thay đổi</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
