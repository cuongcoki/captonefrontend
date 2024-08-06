
import { shipOrderApi } from "@/apis/shipOrder.api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
const OrderStatus = [
    {
        id: 0,
        des: "Đang đợi giao",
        name: "PENDING",
    },
    {
        id: 1,
        des: "Đang thực hiện",
        name: "PROCESSING",
    },
    {
        id: 2,
        des: "Đã hoàn thành",
        name: "PROCESSING",
    },
    {
        id: 3,
        des: "Đã hủy",
        name: "PROCESSING",
    },
];

import { MyContext } from "../table/RenderTable";

interface PropStatus {
    status?: any
}
export default function ChangeStatusShipOrderEm({ status }: PropStatus) {

    const { forceUpdate } = useContext(MyContext);
    const [valueStatus, setValueStatus] = useState<any>(0);

    const handleSelectChange = (value: any, id: string) => {
        console.log("value", value);
        setValueStatus(value);
    };
    const handleSubmitOrderStatus = (id: string) => {
        console.log("value", valueStatus);
        console.log("id", id);
        const formattedData = {
            shipOrderId: id,
            status: valueStatus,
        };
        console.log("formattedData", formattedData);
        shipOrderApi.updateStatus(formattedData, id).then(({ data }) => {
            forceUpdate();
            console.log("data", data);
            toast.success(data.message);
        });
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        {" "}
                        {status.statusDescription}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="Trạng thái"
                                className="text-right"
                            >
                                Trạng thái
                            </Label>
                            <Select
                                defaultValue={String(status.status)}
                                onValueChange={(value) =>
                                    handleSelectChange(
                                        Number(value),
                                        status.shipOrderId
                                    )
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue
                                        placeholder="Hãy chọn loại đơn"
                                        defaultValue={status.status}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {OrderStatus.map((status) => (
                                        <SelectItem
                                            key={status.id}
                                            value={String(status.id)}
                                        >
                                            {status.des}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={() =>
                                handleSubmitOrderStatus(status.shipOrderId)
                            }

                        >
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}