'use client'

import { CardTitle, Card } from "@/components/ui/card";
import RenderTableOrder from "./table/RenderTable";

export default function OrderPage() {

    return (
        <Card className="w-full h-full">
            <CardTitle className="p-3 text-2xl text-primary-backgroudPrimary font-medium">Đặt hàng</CardTitle>
            <RenderTableOrder />
        </Card>
    );
}