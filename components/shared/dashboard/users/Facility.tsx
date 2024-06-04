import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
    Card,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Separator } from "@/components/ui/separator";
import FacilityForm from "./form/FacilityForm";
import RenderTableFability from "./table/facility/RenderTable";


export default function FacilityPage() {
    return (
        <div className="py-2 ">
            <header className="bg-white">
                <div className="flex items-center justify-end p-3">
                    <div className="flex items-center space-x-2">
                        <Dialog>
                            <DialogTrigger>
                                <Button variant={"colorCompany"} className="text-xs">
                                    Thêm mới cơ sở
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="p-none">
                                <DialogTitle className="text-2xl text-primary-backgroudPrimary">Thêm mới cơ sở</DialogTitle>
                                <Separator className="h-1"/>
                                <FacilityForm />
                            </DialogContent>
                        </Dialog>
                        <Button variant={"outline"}> <EllipsisVertical size={20} /></Button>
                    </div>
                </div>
            </header>
            <Card className="my-2">
                <RenderTableFability />
            </Card>
        </div>
    );
}