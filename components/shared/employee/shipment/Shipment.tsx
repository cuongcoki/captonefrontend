"use client";

import RenderTableShipment from "./table/RenderTable";
import HeaderComponent from "../../common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RenderTableOrderShipment from "./order/table/RenderTable";
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
            <RenderTableOrderShipment />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
