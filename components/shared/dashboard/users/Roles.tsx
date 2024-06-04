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
import RolesForm from "./form/RolesForm";
import { Separator } from "@/components/ui/separator";
import RenderTableRoles from "./table/roles/RenderTable";


export default function RolesPage() {
    return (
        <div className="py-2">
            <header className="bg-white">
                <div className="flex items-center justify-end p-3">
                    <div className="flex items-center space-x-2">
                        <Dialog>
                            <DialogTrigger>
                                <Button variant={"colorCompany"} className="text-xs">
                                    Thêm mới vài trò
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="p-none">
                                <DialogTitle className="text-2xl text-primary-backgroudPrimary">Thêm mới vai trò</DialogTitle>
                                <Separator className="h-1"/>
                                <RolesForm />
                            </DialogContent>
                        </Dialog>
                        <Button variant={"outline"}> <EllipsisVertical size={20} /></Button>
                    </div>
                </div>
            </header>
            <Card className="my-2">
              <RenderTableRoles />
            </Card>
        </div>
    );
}