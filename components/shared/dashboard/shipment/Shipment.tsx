'use client'

import { CardTitle, Card } from "@/components/ui/card";
import RenderTableShipment from "./table/RenderTable";

export default function Shipment() {
    return (
        <Card className="w-full h-full">
            <div className="!mb-15">
                <CardTitle>
                    <div className="p-3 text-3xl  font-semibold text-[#22c55e] text-center w-full">
                        QUẢN LÝ VẬN CHUYỂN
                    </div>
                </CardTitle>
                <RenderTableShipment />
            </div>
        </Card>
    );
}