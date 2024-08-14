import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Calendar } from "@/components/ui/calendar";

// import ICON
import { CalendarIcon, Check, CirclePlus, CircleX, PenLine, Plus, X } from "lucide-react";

// import REACT
import { useEffect, useState } from "react";
import { ShipOrderSchema } from "@/schema/shipOrder";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { shipOrderApi } from "@/apis/shipOrder.api";
import { cn } from "@/lib/utils";
import { userApi } from "@/apis/user.api";
import Image from "next/image";
import toast from "react-hot-toast";
import { filesApi } from "@/apis/files.api";
import { OrderStore } from "../../../order-store";

// Define Status Enum
const OrderStatus = [
    {
        id: 0,
        des: "Trả hàng lỗi",
        name: "PENDING"
    },
    {
        id: 1,
        des: "Gửi hàng đi",
        name: "PROCESSING"
    },
];

interface ShipOrderDetailRequest {
    itemId: string,
    quantity: number,
    itemKind: number,
}
interface shipOrder {
    shipOrderId: string
    shipperId: string;
    kindOfShipOrder: number;
    orderId: string;
    shipDate: string;
    shipOrderDetailRequests: ShipOrderDetailRequest[];
}


export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    roleId: number;
    isActive: boolean;
    companyId: string;
    avatar: string;
    companyName: string;
};

interface OrderIdData {
    orderId: string,
    productOrderResponses: productOrderResponses[],
    setOrderResponses: setOrderResponses[]
}

interface productOrderResponses {
    productId: string,
    productCode: string
    productName: string
    productDescription: string
    imageProductUrl: string,
    quantity: number
    unitPrice: number
    note: number
}
interface setOrderResponses {
    setId: string,
    setName: string,
    setDescription: string,
    imageSetUrl: string,
    productResponses: productResponses[]
    quantity: number
    unitPrice: number
    note: number
}

interface productResponses {
    id: string,
    name: string,
    code: string,
    price: number,
    size: number,
    description: string,
    isInProcessing: boolean,
    imageResponses: imageResponses[]
}
interface imageResponses {
    id: string,
    imageUrl: string,
    isBluePrint: boolean,
    isMainImage: boolean,
}


interface Product {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: imageResponses[];
}

interface Set {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: imageResponses[];
}

interface ShipOrderDetailResponse {
    product: Product | null;
    set: Set | null;
    quantity: number;
}

interface ShipOrder {
    shipOrderId: string
    shipperId: string;
    shipperName: string;
    shipDate: string;
    status: number;
    statusDescription: string;
    deliveryMethod: number;
    deliveryMethodDescription: string;
    shipOrderDetailResponses: ShipOrderDetailResponse[];
}

interface FormUpdateShipOrderProps {
    shipOrderId: ShipOrder;
    orderId: OrderIdData;
}

export const FormUpdateShipOrder: React.FC<FormUpdateShipOrderProps> = ({ shipOrderId, orderId }) => {
    // ** state for dialog
    const [open, setOpen] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);
    const handleOnDialog = () => {
        setOpen(true);
    };

    const handleOffDialogA = () => {
        setOpenAlert(false);
    };

    const handleOnDialogA = () => {
        setOpenAlert(true);
    };

    const { ForceRender } = OrderStore();

    // ** state
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<OrderIdData>({ orderId: "", productOrderResponses: [], setOrderResponses: [] });

    // ** state user
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(11);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [roleId, setRoleId] = useState<number>(4);
    const [searchTearm, setSearchTearm] = useState<string>("");
    const [dataEm, setDataEm] = useState<Employee[]>([]);

    // ** các hàm sử lý logic
    const [shipOrderDetailRequests, setShipOrderDetailRequests] = useState<ShipOrderDetailRequest[]>([]);
    const [productDetail, setProductDetail] = useState<any[]>([]);

    // Hàm thêm sản phẩm
    const handleAddProducts = (imgProducts: string, itemId: string, itemKind: number) => {
        const itemExists = shipOrderDetailRequests.some((item) => item.itemId === itemId);
        if (itemExists) {
            toast.error("sản phẩm này đã thêm");
            return;
        }
        setShipOrderDetailRequests((prev: any) => [
            ...prev,
            { itemId: itemId, quantity: 1, itemKind }
        ]);
        setProductDetail((prev) => [
            ...prev,
            { itemId: itemId, imgProducts, itemKind }
        ]);
    };

    // Hàm xóa sản phẩm
    const handleDeleteProducts = (itemId: string) => {
        setShipOrderDetailRequests((prev) =>
            prev.filter((item) => item.itemId !== itemId)
        );
        setProductDetail((prev) =>
            prev.filter((product) => product.itemId !== itemId)
        );
    };

    // Hàm thay đổi giá trị của một sản phẩm
    const handleChange = (itemId: string, name: keyof ShipOrderDetailRequest, value: any) => {
        setShipOrderDetailRequests((prev) =>
            prev.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, [name]: value };
                }
                return item;
            })
        );
    };
    // ** form
    const form = useForm({
        resolver: zodResolver(ShipOrderSchema),
        defaultValues: {
            shipperId: '',
            kindOfShipOrder: 0,
            shipDate: '',
        },
    });
    const { reset } = form;
    // ** callData
    useEffect(() => {
        const fetchImages = async () => {
            if (shipOrderId && shipOrderId.shipOrderDetailResponses) {
                const details = await Promise.all(
                    shipOrderId.shipOrderDetailResponses.map(async (item) => {
                        const imgResponses = item.product
                            ? item.product.imageResponses
                            : item.set?.imageResponses || [];

                        const imgProducts = await Promise.all(
                            imgResponses.map(async (img) => {
                                try {
                                    const response = await filesApi.getFile(img.imageUrl);
                                    return response.data.data;
                                } catch (error) {
                                    return null;
                                }
                            })
                        );

                        return {
                            itemId: item.product?.id ?? item.set?.id ?? "",
                            imgProducts,
                            itemKind: item.product ? 0 : 1,
                        };
                    })
                );
                setProductDetail(details);
            }
        };

        if (orderId) {
            setOrder(orderId);
        }

        if (shipOrderId && shipOrderId.shipOrderDetailResponses) {
            setShipOrderDetailRequests(
                shipOrderId.shipOrderDetailResponses.map((item) => ({
                    itemId: item.product?.id ?? item.set?.id ?? "",
                    quantity: item.quantity,
                    itemKind: item.product ? 0 : 1,
                }))
            );
            fetchImages();
        }

        if (shipOrderId) {
            reset({
                shipperId: shipOrderId.shipperId,
                kindOfShipOrder: shipOrderId.deliveryMethod,
                shipDate: shipOrderId.shipDate,
            });
        }

    }, [, reset, orderId, shipOrderId,fetchTrigger]);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await userApi.allUsers(
                    roleId,
                    searchTearm,
                    isActive,
                    currentPage,
                    pageSize
                );
                setDataEm(res.data.data.data);
                setCurrentPage(res.data.data.currentPage);
                setTotalPages(res.data.data.totalPages);
            } catch (error: any) {
                if (error?.response.data.status === 400) {
                    setDataEm([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isActive, roleId, searchTearm, currentPage, pageSize, dataEm ]);


    const onSubmit = (data: z.infer<typeof ShipOrderSchema>) => {

        const originalDate = data.shipDate;
        const date = new Date(originalDate);
        date.setUTCHours(23, 59, 59, 0);

        const formattedShipDate = date.toISOString().replace('.000', '');
        const requestBody = {
            id: shipOrderId.shipOrderId,
            shipperId: data.shipperId,
            kindOfShipOrder: data.kindOfShipOrder,
            orderId: order.orderId,
            shipDate: formattedShipDate,
            shipOrderDetailRequests: shipOrderDetailRequests
        };

        setLoading(true)
        shipOrderApi.updateShipOrder(requestBody, shipOrderId.shipOrderId)
            .then(({ data }) => {
                if (data.isSuccess) {
                    ForceRender()
                    setOpen(false)
                    toast.success(data.message);
                }
            })
            .catch(error => {
                if (error.response.data.error) {
                    for (const key in error.response.data.error) {
                        toast.error(error.response.data.error[key][0]);
                    }
                } else {
                    toast.error(error.response.data.message);
                }
            })
            .finally(() => {
                setLoading(false)
            })

    };

    const productType = 0;
    const setType = 1;

    const handleClearForm = () => {
        setOpen(false)
        setOpenAlert(false)
        setFetchTrigger((prev) => prev + 1);
        form.reset();
        setShipOrderDetailRequests([]);
        setProductDetail([]);

    }

    const [originalShipOrderDetailRequests, setOriginalShipOrderDetailRequests] = useState<any[]>([]);

    const { formState } = form;

    const handleOffDialog = () => {
        setOriginalShipOrderDetailRequests(shipOrderDetailRequests);
        const isFormChanged = JSON.stringify(shipOrderDetailRequests) === JSON.stringify(originalShipOrderDetailRequests);

        if (!formState.isDirty && isFormChanged) {
            setOpen(false);
            setFetchTrigger((prev) => prev + 1);
        } else if (Array.isArray(originalShipOrderDetailRequests) && originalShipOrderDetailRequests.length === 0) {
            setOpen(false);
            setFetchTrigger((prev) => prev + 1);
        } else {
            setOpenAlert(true);
        }
    };

    return (
        <>
            {
                openAlert && (
                    <AlertDialog open={openAlert} >
                        <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn muốn tắt biểu mẫu này không ??</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn những dữ liệu mà bạn đã nhập
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleOffDialogA}>Hủy bỏ</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearForm}>Tiếp tục</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
            <Dialog.Root open={open} onOpenChange={handleOnDialog}>
                <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                    <PenLine onClick={handleOnDialog} />
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                        <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[600px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                            <Dialog.Title className="hidden visible">hidden</Dialog.Title>
                            <Dialog.Description className="hidden visible">hidden</Dialog.Description>
                            <div className="bg-slate-100  flex flex-col ">
                                <div className="p-4 flex items-center justify-between bg-primary  rounded-t-md">
                                    <h2 className="text-2xl text-white">Chỉnh sửa đơn vận chuyển</h2>
                                    <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                        <X className="w-4 h-4 dark:text-white" />
                                    </Button>
                                </div>


                                <div className="grid  p-4 overflow-y-auto max-h-[750px] gap-4">
                                    <div className=" w-full grid grid-cols-3 md:grid-cols-6 gap-4 min-h-[100px]  overflow-y-auto ">
                                        {
                                            order.productOrderResponses.map(pro => (
                                                <div className="group relative w-[60px] h-[60px] shadow-lg rounded-md" key={pro.productId}>
                                                    <Image src={pro.imageProductUrl} alt="ảnh sản phẩm" className="w-full h-full object-cover shadow-lg rounded-md" width={900} height={900} />
                                                    <Check className={`h-5 w-5 ${shipOrderDetailRequests.some(item => item.itemId === pro.productId) ? "absolute top-0 right-0 bg-primary  text-white" : "hidden"}`} />
                                                    <span className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6" onClick={() => handleAddProducts(pro.imageProductUrl, pro.productId, productType)}><Plus className="text-white" /></span>
                                                </div>
                                            ))
                                        }
                                        {
                                            order.setOrderResponses.map(pro => (
                                                <div className="group relative w-[60px] h-[60px] shadow-lg rounded-md" key={pro.setId}>
                                                    <Image src={pro.imageSetUrl} alt="ảnh bộ sản phẩm" className="w-full h-full object-cover shadow-lg rounded-md" width={900} height={900} />
                                                    <Check className={`h-5 w-5 ${shipOrderDetailRequests.some(item => item.itemId === pro.setId) ? "absolute top-0 right-0 bg-primary text-white" : "hidden"}`} />
                                                    <span className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6" onClick={() => handleAddProducts(pro.imageSetUrl, pro.setId, setType)}><Plus className="text-white" /></span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {productDetail.length > 0 && (
                                        <Card >
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Ảnh</TableHead>
                                                        <TableHead>Số lượng</TableHead>
                                                        <TableHead>Sản phẩm</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="min-h-[200px] overflow-y-auto">
                                                    {
                                                        productDetail.map((proDetail, index) => (
                                                            <TableRow key={proDetail.itemId}>
                                                                <TableCell className="font-medium">
                                                                    <div className="w-[50px] h-[50px] rounded-md shadow-md">
                                                                        <Image src={proDetail.imgProducts[0]} width={900} height={900} alt="ảnh sản phẩm" className="w-ful h-ful object-contain" />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <input
                                                                        type="number"
                                                                        name="quantity"
                                                                        value={
                                                                            shipOrderDetailRequests.find(
                                                                                (item) => item.itemId === proDetail.itemId
                                                                            )?.quantity || 0
                                                                        }
                                                                        onChange={(e) => handleChange(proDetail.itemId, 'quantity', parseInt(e.target.value))}
                                                                        className="w-16 text-center outline-none"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    {proDetail.itemKind === 0 ? "Sản phẩm" : "Bộ sản phẩm"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button variant={"ghost"} size={"icon"} onClick={() => handleDeleteProducts(proDetail.itemId)}><CircleX /></Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>

                                            </Table>
                                        </Card>
                                    )}
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="w-full flex flex-col gap-4"
                                        >


                                            <FormField
                                                control={form.control}
                                                name="shipperId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-primary-backgroudPrimary">Nhân viên vận chuyển *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-16">
                                                                    <SelectValue placeholder="Hãy chọn nhân viên" defaultValue={field.value} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {dataEm.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id} >
                                                                        <div className="flex items-center gap-4">
                                                                            <Image className="w-12 h-12 rounded-full shadow-md" src={item.avatar} width={900} height={900} alt="ảnh nhân viên" />
                                                                            <div className="font-medium dark:text-white">
                                                                                <div>{item.firstName} {item.lastName}</div>
                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.id}</div>
                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.companyName}</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="kindOfShipOrder"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-primary-backgroudPrimary">
                                                            Loại đơn đặt hàng *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(value) =>
                                                                field.onChange(Number(value))
                                                            }
                                                            defaultValue={String(field.value)}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder="Hãy chọn loại đơn"
                                                                        defaultValue={String(field.value)}
                                                                    />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Object.values(OrderStatus).map((status) => (
                                                                    <SelectItem key={status.id} value={String(status.id)}>
                                                                        {status.des}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="shipDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                                            Ngày đặt hàng *
                                                        </FormLabel>
                                                        <Popover modal={true}>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            (() => {
                                                                                const [year, month, day] = field.value.split('T')[0].split('-');
                                                                                return `${day}/${month}/${year}`;
                                                                            })()
                                                                        ) : (
                                                                            <span>Chọn ngày</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>

                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value ? new Date(new Date(field.value).setDate(new Date(field.value).getDate() - 1)) : undefined}
                                                                    onSelect={(date: any) => {
                                                                        if (date) {
                                                                            // Đảm bảo giờ là 00:00:00 để tránh vấn đề múi giờ
                                                                            date.setHours(0, 0, 0, 0);
                                                                            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                                                                            const formattedDate = utcDate.toISOString().split('T')[0]; // Giữ lại chỉ phần ngày
                                                                            field.onChange(formattedDate);
                                                                        }
                                                                    }}
                                                                    initialFocus
                                                                />

                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />



                                            <Separator className="h-1 my-1" />
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-primary/90"
                                                disabled={loading}
                                            >
                                                {loading ? "Loading..." : "Tạo đơn"}
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}