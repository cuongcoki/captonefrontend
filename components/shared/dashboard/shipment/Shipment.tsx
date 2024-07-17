'use client'

import { CardTitle, Card } from "@/components/ui/card";
import RenderTableShipment from "./table/RenderTable";
import HeaderComponent from "../../common/header";

export default function Shipment() {
    return (
        <>
            <div className="!mb-15">
                <HeaderComponent
                    title="Đơn vận chuyển"
                    description="Danh sách đơn vận chuyển từ công ty và công ty hợp tác."
                />
                <RenderTableShipment />
            </div>
        </>
    );
}