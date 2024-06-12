'use client'
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import RenderTableUsers from "./table/users/RenderTable";
import { CardContent } from "../home/DashbroadComponents/Cards/Card";
export default function UsersPage() {
    return (
        <Card>
            <CardTitle>
                <h1 className="p-3 text-2xl text-primary-backgroudPrimary font-medium">NGƯỜI DÙNG</h1>
            </CardTitle>
            <RenderTableUsers />
        </Card>
    );
}