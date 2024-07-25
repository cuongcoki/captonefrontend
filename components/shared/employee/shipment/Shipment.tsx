'use client'

import RenderTableShipment from "./table/RenderTable";
import HeaderComponent from "../../common/header";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
export default function ShipmentByShipper() {
    return (
        <>
            <div className="!mb-15">
                <HeaderComponent
                    title="Đơn vận chuyển"
                    description="Danh sách đơn vận chuyển từ công ty và công ty hợp tác."
                />
                <Tabs defaultValue="shipment" className="">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="shipment">Đơn Vận Chuyển</TabsTrigger>
                        <TabsTrigger value="shiporder">Đơn Đặt Hàng</TabsTrigger>
                    </TabsList>
                    <TabsContent value="shipment">
                    <RenderTableShipment />
                    </TabsContent>
                    <TabsContent value="shiporder">
                        order
                    </TabsContent>
                </Tabs>

         
            </div>
        </>
    );
}