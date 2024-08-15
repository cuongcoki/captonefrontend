"use client";

// ** import UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import * as Dialog from "@radix-ui/react-dialog";

// ** import REACT
import { useState } from "react";
import toast from "react-hot-toast";

import { X } from "lucide-react";
import { shipmentApi } from "@/apis/shipment.api";
import { ShipmentStore } from "../shipment-store";
import { Label } from "@/components/ui/label";
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
export const ChangeStatusShipment: React.FC<ShipmentIDProps> = ({
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
    // if (shipmentID.status === 1) {
    //     return toast.error("Đơn hàng đang trong quá trình vận chuyển ,thay đổi trạng thái sẽ dẫn đến tình trạng nhầm lẫn của của nhận viên vận chuyển")
    // }

    const requestBody = {
      shipmentId: shipmentID.id,
      status: valueStatus,
    };
    setLoading(true);
    shipmentApi
      .changeStatus(shipmentID.id, requestBody)
      .then(({ data }) => {
        ForceRender();
        setOpen(false);
        toast.success(data.message);
      })
      .catch((error) => {
        if (error.response.data.error) {
          for (const key in error.response.data.error) {
            toast.error(error.response.data.error[key][0]);
          }
        } else {
          toast.error(error.response.data.message);
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
          <div className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] w-max font-medium">
            {shipmentID.statusDescription}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi trạng thái đơn vận chuyển</DialogTitle>
          </DialogHeader>
          <CardContent className="flex items-center">
            <Label className="whitespace-nowrap mr-5">Trạng thái</Label>
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
          </CardContent>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleSubmitOrderStatus;
                setOpen(false);
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
