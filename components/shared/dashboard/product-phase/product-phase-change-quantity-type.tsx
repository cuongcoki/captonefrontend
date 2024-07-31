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
import { Separator } from "@/components/ui/separator";

export default function ProductPhaseChangeQuantityType({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { tableData, changeQuantityType, phaseData, ForceRender } =
    productPhaseStore();
  const productPhase = tableData[index];
  const [isOpen, setIsOpen] = React.useState(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [phaseTo, setPhaseTo] = useState<string>(productPhase.phaseId);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    if (!from) {
      toast.error("Vui lòng chọn loại hàng sẽ chuyển");
      return;
    }
    if (!to) {
      toast.error("Vui lòng chọn loại hàng được chuyển");
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
        productId: productPhase.productId,
        from: parseInt(from),
        to: parseInt(to),
        phaseIdFrom: productPhase.phaseId,
        phaseIdTo: phaseTo,
        quantity: quantity,
      })
      .then((res) => {
        toast.success("Thay đổi loại hàng thành công");
        // changeQuantityType(index, Number(from), Number(to), quantity);
        ForceRender();
        setIsOpen(false);
      })
      .catch((error) => {
        for (const key in error.response.data.error) {
          toast.error(error.response.data.error[key][0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* <div className="hover:bg-gray-200 hover:cursor-pointer  relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Cập nhật số lượng sản phẩm
          </div> */}
          {children}
        </DialogTrigger>
        <DialogContent className="min-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Cập nhật sản phẩm
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid grid-cols-12">
            <div className="space-y-2 col-span-5">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại hạng sẽ chuyển" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem className="hover:bg-gray-200 w-full" value="0">
                    Bình thường
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="1">
                    Lỗi bên thứ 3
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="2">
                    Lỗi bên mình
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="3">
                    Hỏng
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm ml-1 text-primary" hidden={from == ""}>
                {/* Số lượng: {productPhase[ProductPhaseQuantityType[Number(from)]]} */}
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2">
              <MoveRight className="w-10" />
            </div>
            <div className="space-y-2 col-span-5">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại hạng được chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:bg-gray-200 w-full" value="0">
                    Bình thường
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="1">
                    Lỗi bên thứ 3
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="2">
                    Lỗi bên mình
                  </SelectItem>
                  <SelectItem className="hover:bg-gray-200 w-full" value="3">
                    Hỏng
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm ml-1 text-primary" hidden={to == ""}>
                {/* Số lượng: {productPhase[ProductPhaseQuantityType[Number(to)]]} */}
              </div>
            </div>
          </div>
          {/* <Separator className="my-1" /> */}
          {/* -------------------------------------------------------------------------------------------------------------------------------- */}
          <div className="grid grid-cols-12 ">
            <div className="space-y-2 col-span-5">
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
                hidden={from == ""}
              >
                {/* Số lượng: {productPhase.availableQuantity} */}
              </div>
            </div>
            <div className="flex items-center justify-center col-span-2">
              <MoveRight className="w-10" />
            </div>
            <div className="space-y-2 col-span-5">
              <Select value={phaseTo} onValueChange={setPhaseTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Giai đoạn được chuyển" />
                </SelectTrigger>
                <SelectContent>
                  {phaseData
                    // .filter((item) => item.id !== productPhase.phaseId)
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
          <Separator />
          <div className="flex gap-x-5">
            <div className="flex justify-start items-center">Số lượng</div>
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
              className="w-[450px]"
              placeholder="Nhập số lượng muốn đổi"
            />
            <Button
              className="ml-auto"
              onClick={handleChange}
              disabled={loading}
            >
              {loading ? "Đang xử lý" : "Thay đổi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
