import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PencilLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductUpdateForm } from "@/components/shared/dashboard/product/form/ProductUpdateForm";
import { Label } from "recharts";
import { ProductData } from "@/components/shared/dashboard/product/table/productID/ProductID";

export default function ProductUpdate({
  children,
  product,
}: {
  product: ProductData;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };
  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[900px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
            <div className="bg-slate-100  flex flex-col ">
              <div className="p-4 flex items-center justify-between bg-primary  rounded-t-md">
                <h2 className="text-2xl text-white">
                  Chỉnh Sửa Thông Tin Sản Phẩm
                </h2>
                <Button variant="outline" size="icon">
                  <X
                    className="w-4 h-4 dark:text-white"
                    onClick={handleOffDialog}
                  />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[650px] dark:bg-card">
                <ProductUpdateForm productId={product} />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
