// ** import UI
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Form,
    FormControl,
    FormDescription,
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

// ** import REACT
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parse } from "date-fns";

// ** import ICON
import { CalendarIcon, Plus, Truck, X } from "lucide-react";

// ** import TYPE & SCHEMA
import { OrderSchema, CompanyRequestSchema } from "@/schema/order";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { orderApi } from "@/apis/order.api";
import toast from "react-hot-toast";

// Define Company Type
type Company = {
    id: string;
    name: string;
    address: string;
    directorName: string;
    directorPhone: string;
    email: string;
    companyType: number;
    companyTypeDescription: string;
};

// Define Status Enum
const OrderStatus = [
    {
        id: 1,
        des: "chưa giải quyết",
        name: "PENDING"
    },
    {
        id: 2,
        des: "xử lý",
        name: "PROCESSING"
    },
    {
        id: 3,
        des: "hoàn thành",
        name: "COMPLETED"
    },
    {
        id: 4,
        des: "đã hủy bỏ",
        name: "CANCELED"
    }
];


export default function CreateOrder() {
    const [open, setOpen] = useState<boolean>(false);
    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    // useForm hook for managing form state and validation
    const form = useForm({
        resolver: zodResolver(OrderSchema),
        defaultValues: {
            companyId: "",
            status: 0,
            startOrder: "",
            endOrder: "",
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [company, setCompany] = useState<Company[]>([]);



    useEffect(() => {
        const fetchDataCompany = async () => {
            const { data } = await orderApi.getAllCompanis(currentPage, pageSize, searchTerm);
            setCompany(data.data.data);
        }
        fetchDataCompany();
    }, [currentPage, pageSize, searchTerm]);
    // console.log(company);

    const onSubmit = async (formData: z.infer<typeof OrderSchema>) => {
        console.log('formData',formData)
        setLoading(true);
        try {
            const response = await orderApi.createOrder(formData); 
            setOpen(false);
            toast.success("Tạo đơn hàng thành công");
        } catch (error) {
            toast.error("Tạo đơn hàng không thành công");
        } finally {
            setLoading(false); 
        }
    };

    // ********************************************* Xữ Lý Thêm Công Ty ********************************************* //

    const [openCompanyForm, setOpenCompanyForm] = useState<boolean>(false);

    const handleToggelCompanyForm = () => {
        setOpenCompanyForm(!openCompanyForm)
    }

    const formCompany = useForm({
        resolver: zodResolver(CompanyRequestSchema),
        defaultValues: {
            name: "",
            address: "",
            directorName: "",
            directorPhone: "",
            email: "",
            companyType: 1,
        },
    });


    const onSubmitCompany = async (data: z.infer<typeof CompanyRequestSchema>) => {
        console.log("data", data);
    };


    const { pending } = useFormStatus();

    return (
        <Dialog.Root open={open} onOpenChange={handleOnDialog}>
            <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                <Plus /> Tạo đơn hàng mới
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                    <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2 max-w-[800px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                        <div className="bg-slate-100 flex flex-col overflow-y-auto">
                            <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary rounded-t-md">
                                <h2 className="text-2xl text-white">Thêm đơn hàng mới</h2>
                                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid gap-4 p-4">

                                <Form {...formCompany}>
                                    <form onSubmit={formCompany.handleSubmit(onSubmitCompany)} className="flex flex-col gap-6" >
                                        <div className="">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg" onClick={handleToggelCompanyForm}>
                                                        {!openCompanyForm ? 'Thêm công ty' : 'Chi tiết công ty'}
                                                    </CardTitle>
                                                </CardHeader>
                                                {
                                                    openCompanyForm && (<CardContent>
                                                        <div className="flex-col flex gap-3">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-6 ">
                                                                <FormField
                                                                    control={formCompany.control}
                                                                    name="name"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full">
                                                                            <FormLabel className="text-primary-backgroudPrimary">
                                                                                Tên *
                                                                            </FormLabel>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    placeholder="Tên công ty"
                                                                                    {...field}
                                                                                    className="relative z-10"
                                                                                />

                                                                            </div>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={formCompany.control}
                                                                    name="address"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full">
                                                                            <FormLabel className="text-primary-backgroudPrimary">
                                                                                Địa chỉ *
                                                                            </FormLabel>
                                                                            <Input
                                                                                placeholder="Địa chỉ"
                                                                                {...field}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />


                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-6 ">
                                                                <FormField
                                                                    control={formCompany.control}
                                                                    name="directorName"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full">
                                                                            <FormLabel className="text-primary-backgroudPrimary">
                                                                                Tên giám đốc *
                                                                            </FormLabel>
                                                                            <Input
                                                                                placeholder="Tên giám đốc"
                                                                                {...field}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={formCompany.control}
                                                                    name="directorPhone"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full">
                                                                            <FormLabel className="text-primary-backgroudPrimary">
                                                                                Số điện thoại giám đốc *
                                                                            </FormLabel>
                                                                            <Input
                                                                                placeholder="Số điện thoại giám đốc"
                                                                                {...field}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-6 ">
                                                                <FormField
                                                                    control={formCompany.control}
                                                                    name="email"
                                                                    render={({ field }) => (
                                                                        <FormItem className="w-full">
                                                                            <FormLabel className="text-primary-backgroudPrimary">
                                                                                Email *
                                                                            </FormLabel>
                                                                            <Input
                                                                                type="email"
                                                                                placeholder="Email"
                                                                                {...field}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                {/* <FormField
                                                                control={formCompany.control}
                                                                name="companyType"
                                                                render={({ field }) => (
                                                                    <FormItem className="w-full">
                                                                        <FormLabel className="text-primary-backgroudPrimary">
                                                                            Loại công ty *
                                                                        </FormLabel>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            /> */}
                                                            </div>

                                                            <Card>
                                                                <Button
                                                                    type="submit"
                                                                    className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
                                                                    disabled={pending}
                                                                >
                                                                    {pending ? "Loading..." : "GỬI"}
                                                                </Button>
                                                            </Card>
                                                        </div>
                                                    </CardContent>)
                                                }

                                            </Card>
                                        </div>

                                    </form>
                                </Form>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" >
                                        <div className="">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        Chi tiết đặt hàng
                                                    </CardTitle>
                                                </CardHeader>

                                                <CardContent className="flex  gap-6">

                                                    <div className="flex flex-col gap-6 w-full">
                                                        <FormField
                                                            control={form.control}
                                                            name="companyId"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-primary-backgroudPrimary">Cơ sở nào *</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Hãy chọn cơ sở" defaultValue={field.value} />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {company.map((item) => (
                                                                                <SelectItem key={item.id} value={item.id}>
                                                                                    {item.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="  flex w-full gap-6">
                                                            <FormField
                                                                control={form.control}
                                                                name="status"
                                                                render={({ field }) => (
                                                                    <FormItem className="w-full">
                                                                        <FormLabel className="text-primary-backgroudPrimary">
                                                                            Trạng thái *
                                                                        </FormLabel>
                                                                        <Select
                                                                            onValueChange={field.onChange}
                                                                            defaultValue={String(field.value)}
                                                                        >
                                                                            <FormControl>
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder="Chọn trạng thái"
                                                                                        defaultValue={field.value}
                                                                                    />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent>
                                                                                {Object.values(OrderStatus).map((status) => (
                                                                                    <SelectItem key={status} value={status}>
                                                                                        {status}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="flex gap-6 items-center">
                                                            <FormField
                                                                control={form.control}
                                                                name="startOrder"
                                                                render={({ field }) => (
                                                                    <FormItem className="flex flex-col">
                                                                        <FormLabel className="flex items-center text-primary-backgroudPrimary">Ngày đặt hàng *</FormLabel>
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
                                                                                            format(parse(field.value, "dd/MM/yyyy", new Date()), "PPP")
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
                                                                                    selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                                                                                    onSelect={(date) => field.onChange(format(date, "dd/MM/yyyy"))}
                                                                                    // disabled={(date) =>
                                                                                    //     date > new Date() || date < new Date("1900-01-01")
                                                                                    // }
                                                                                    initialFocus
                                                                                />
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Truck />
                                                            <FormField
                                                                control={form.control}
                                                                name="endOrder"
                                                                render={({ field }) => (
                                                                    <FormItem className="flex flex-col">
                                                                        <FormLabel className="flex items-center text-primary-backgroudPrimary">Ngày Giao hàng *</FormLabel>
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
                                                                                            format(parse(field.value, "dd/MM/yyyy", new Date()), "PPP")
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
                                                                                    selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                                                                                    onSelect={(date) => field.onChange(format(date, "dd/MM/yyyy"))}
                                                                                    // disabled={(date) =>
                                                                                    //     date > new Date() || date < new Date("1900-01-01")
                                                                                    // }
                                                                                    initialFocus
                                                                                />
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card>
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
                                                disabled={pending}
                                            >
                                                {pending ? "Loading..." : "GỬI"}
                                            </Button>
                                        </Card>

                                    </form>
                                </Form>

                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
