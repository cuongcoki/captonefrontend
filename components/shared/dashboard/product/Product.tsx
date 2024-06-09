'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import RenderTableProduct from "./table/products/RenderTable";
import { ProductForm } from "./form/ProductForm";

export default function ProductPage() {
    const [open, setOpen] = useState<boolean>(false);
    
    return (
        <div>
            <div className="bg-white ">
                <div className="flex items-center gap-4 p-3">
                    <div className="avatar rounded-full min-h-8 min-w-8 bg-blue-500 text-white font-[700] flex items-center justify-center">
                        <p>TDC</p>
                    </div>
                    <div className="font-medium dark:text-white">
                        <div className="text-2xl">xin chào chủ tịch cương</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">cuong</div>
                    </div>
                </div>
            </div>

            <div className="bg-white mt-2">
                <div className="flex items-center justify-end p-3">
                    <div className="flex items-center space-x-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger>
                                <Button variant={"colorCompany"} className="text-xs">
                                    Thêm mới sản phẩm
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="min-w-[50%]">
                                <DialogTitle className="text-2xl text-primary-backgroudPrimary">Thêm mới sản phẩm</DialogTitle>
                                <Separator className="h-1" />
                                <ProductForm setOpen={setOpen}/>
                            </DialogContent>
                        </Dialog>
                        <Button variant={"outline"}> <EllipsisVertical size={20} /></Button>
                    </div>
                </div>
            </div>

            <div className="bg-white mt-2">
               {/* <RenderTableProduct /> */}
            </div>
        </div>

    );
}