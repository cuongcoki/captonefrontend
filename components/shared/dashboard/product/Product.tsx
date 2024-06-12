'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import RenderTableProduct from "./table/products/RenderTable";
import { ProductForm } from "./form/ProductForm";
import { CardTitle, Card } from "@/components/ui/card";

export default function ProductPage() {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardTitle>
                <h1 className="p-3 text-2xl text-primary-backgroudPrimary font-medium">SẢN PHẨM</h1>
            </CardTitle>
            <RenderTableProduct />
        </Card>

    );
}