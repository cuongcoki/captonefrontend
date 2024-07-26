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

export default function ProductPhaseChangePhase({ index }: { index: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [to, setTo] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { tableData, ForceRender, phaseData } = productPhaseStore();
  const [loading, setLoading] = useState(false);
  const productPhase = tableData[index];

  const handleChange = () => {
    if (!to) {
      toast.error("Vui lòng chọn loại hàng được chuyển");
      return;
    }

    if (quantity > Number(productPhase.availableQuantity)) {
      toast.error("Số lượng chuyển phải nhỏ hơn số lượng hiện có");
      return;
    }
    setLoading(true);
    productPhaseApi
      .changePhase({
        companyId: productPhase.companyId,
        phaseIdFrom: productPhase.phaseId,
        productId: productPhase.productId,
        phaseIdTo: to,
        quantity: quantity,
      })
      .then((res) => {
        toast.success("Thay giai đoạn hàng thành công");
        ForceRender();
      })
      .catch((e) => {
        toast.error("Thay giai đoạn hàng thất bại");
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
            Thay đổi giai đoạn
          </div>
        </DialogTrigger>
        <DialogContent className="w-[100px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Thay đổi giai đoạn
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-flow-col">
            <div className="space-y-2">
              <Select disabled={true} value={productPhase.phaseId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Giai đoạn sẽ chuyển" />
                </SelectTrigger>
                <SelectContent>
                  {phaseData.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="hover:bg-gray-200"
                    >
                      {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                className="text-sm font-sans ml-1 text-primary"
                // hidden={to == ""}
              >
                Số lượng: {productPhase.availableQuantity}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <MoveRight className="w-10" />
            </div>
            <div className="space-y-2">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Giai đoạn được chuyển" />
                </SelectTrigger>
                <SelectContent>
                  {phaseData
                    .filter((item) => item.id !== productPhase.phaseId)
                    .map((item) => (
                      <SelectItem
                        className="hover:bg-gray-200"
                        key={item.id}
                        value={item.id}
                      >
                        {item.description}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-flow-col gap-x-5">
            <div className="flex justify-center items-center">Số lượng</div>
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
              className="w-[250px]"
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
