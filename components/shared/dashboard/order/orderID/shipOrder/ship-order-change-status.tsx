import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactElement, ReactNode } from "react";

import { ShipOrder } from "@/components/shared/dashboard/order/orderID/shipOrder/ShipOrder";
export default function ShipOrderChangeStatus({
  children,
  item,
  handleSubmitOrderStatus,
}: {
  children: ReactElement;
  item: ShipOrder;
  handleSubmitOrderStatus: (id: string) => void;
}): ReactElement {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"> {item.statusDescription}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              handleSubmitOrderStatus(item.shipOrderId);
              setOpen(false);
            }}
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
