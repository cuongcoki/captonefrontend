'use client'
import { CardTitle, Card } from "@/components/ui/card";
import RenderTableSet from "./table/sets/RenderTable";

export default function SetPage() {

    return (
        <Card className="w-full h-full">
            <CardTitle className="p-3 text-2xl text-primary-backgroudPrimary font-medium">BỘ SẢN PHẨM</CardTitle>
            <RenderTableSet />
        </Card>
    );
}