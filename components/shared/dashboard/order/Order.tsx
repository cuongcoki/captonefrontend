'use client'

import { CardTitle, Card } from "@/components/ui/card";
import RenderTableOrder from "./table/RenderTable";

export default function OrderPage() {

    return (
        <Card className="w-full h-full">
            <div className="!mb-15">
                <CardTitle>
                    <div className="p-3 text-3xl  font-semibold text-[#22c55e] text-center w-full">
                        QUẢN LÝ ĐẶT HÀNG
                    </div>
                </CardTitle>
                <RenderTableOrder />
            </div>
        </Card>
    );
}