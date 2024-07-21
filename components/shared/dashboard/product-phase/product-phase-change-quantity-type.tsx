import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { productPhaseStore } from "@/components/shared/dashboard/product-phase/product-phase-store";
import { productPhaseApi } from "@/apis/product-phase.api";
import { ProductPhaseQuantityType } from "@/types/product-phase.type";

export default function ProductPhaseChangeQuantityType({
  index,
}: {
  index: number;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { tableData, changeQuantityType } = productPhaseStore();
  const [loading, setLoading] = useState(false);
  const productPhase = tableData[index];

  const handleChange = () => {
    if (!from) {
      toast.error("Vui lòng chọn loại hàng sẽ chuyển");
      return;
    }
    if (!to) {
      toast.error("Vui lòng chọn loại hàng được chuyển");
      return;
    }
    if (from == to) {
      toast.error(
        "Loại hàng sẽ chuyển và loại hàng được chuyển không được giống nhau"
      );
      return;
    }
    if (
      quantity > Number(productPhase[ProductPhaseQuantityType[Number(from)]])
    ) {
      toast.error("Số lượng chuyển phải nhỏ hơn số lượng hiện có");
      return;
    }
    setLoading(true);
    productPhaseApi
      .changeQuantityType({
        companyId: productPhase.companyId,
        phaseId: productPhase.phaseId,
        productId: productPhase.productId,
        from: parseInt(from),
        to: parseInt(to),
        quantity: quantity,
      })
      .then((res) => {
        toast.success("Thay đổi loại hàng thành công");
        changeQuantityType(index, Number(from), Number(to), quantity);
      })
      .catch((e) => {
        toast.error("Thay đổi loại hàng thất bại");
      })
      .finally(() => {
        setLoading(false);
        setIsOpen(false);
      });
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="hover:bg-gray-200 hover:cursor-pointer  relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Thay đổi loại hàng
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Thay đổi loại hàng
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-flow-col">
            <div className="space-y-2">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại hạng sẽ chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bình thường</SelectItem>
                  <SelectItem value="1">Lỗi bên thứ 3</SelectItem>
                  <SelectItem value="2">Lỗi bên mình</SelectItem>
                  <SelectItem value="3">Hỏng</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm ml-1 text-primary" hidden={from == ""}>
                Số lượng: {productPhase[ProductPhaseQuantityType[Number(from)]]}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <MoveRight className="w-10" />
            </div>
            <div className="space-y-2">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại hạng được chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bình thường</SelectItem>
                  <SelectItem value="1">Lỗi bên thứ 3</SelectItem>
                  <SelectItem value="2">Lỗi bên mình</SelectItem>
                  <SelectItem value="3">Hỏng</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm ml-1 text-primary" hidden={to == ""}>
                Số lượng: {productPhase[ProductPhaseQuantityType[Number(to)]]}
              </div>
            </div>
          </div>
          <div className="grid grid-flow-col gap-x-5">
            <Input
              value={quantity}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseInt(value) <= 1) {
                  setQuantity(1);
                  return;
                }
                setQuantity(parseInt(value));
              }}
              className="w-[350px]"
              placeholder="Nhập số lượng muốn đổi"
            />
            <Button onClick={handleChange} disabled={loading}>
              {loading ? "Đang xử lý" : "Thay đổi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
