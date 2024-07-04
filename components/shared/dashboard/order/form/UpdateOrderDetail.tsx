// ** import UI
import { Button } from "@/components/ui/button";

// ** import ICON
import { ChevronDown, Minus, PackagePlus, PenLine, Pencil, Plus, Search, X } from "lucide-react";

// ** import REACT
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OrderDetailRequestSchema } from "@/schema/order";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import * as Dialog from "@radix-ui/react-dialog";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { productApi } from "@/apis/product.api";
import toast from "react-hot-toast";
import ImageDisplayDialog from "../../product-set/form/imageDisplayDialog";
import { Label } from "@/components/ui/label";
import { setApi } from "@/apis/set.api";
import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
import useDebounce from "./useDebounce";
import { orderApi } from "@/apis/order.api";


type OrderDetailRequest = {
    productIdOrSetId: string;
    quantity: number;
    unitPrice: number;
    note: string;
    isProductId: boolean;
};

type OrderRequest = {
    orderId: string;
    orderDetailRequests: OrderDetailRequest[];
};

interface OrderID {
    orderId?: any;
}

interface productType {
    orderId: any,
    productOrderResponses: productOrderResponses[],
    setOrderResponses: setOrderResponses[],
}
interface productOrderResponses {
    imageProductUrl: any,
    productId: any,
    productName: any,
    quantity: any,
    unitPrice: any,
    note: any
}

interface setOrderResponses {
    imageSetUrl: any,
    setId: any,
    setName: any,
    quantity: any,
    unitPrice: any,
    note: any
}

export const UpdateOrderDetails: React.FC<OrderID> = ({ orderId }) => {
    //state
    const [open, setOpen] = useState<boolean>(false);

    const handleOffDialog = () => {
        setOpen(false);
    };
    const handleOnDialog = () => {
        setOpen(true);
    };

    // console.log('orderIdddddd', orderId)
    const [loading, setLoading] = useState<boolean>(false);
    const [checkProducts, setCheckProducts] = useState<boolean>(false);
    const handleCheckProduct = () => {
        setCheckProducts(false);
    };
    const handleCheckOrder = () => {
        setCheckProducts(true);
    };


    const form = useForm({
        resolver: zodResolver(OrderDetailRequestSchema),
        defaultValues: {
            productIdOrSetId: "",
            quantity: 0,
            unitPrice: 0,
            note: "",
            isProductId: true,
        },
    });
    // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    // console.log('searchResults', searchResults)

    const [searchTermSet, setSearchTermSet] = useState<string>('');
    const [searchResultsSet, setSearchResultsSet] = useState<any[]>([]);
    // console.log('searchResultsSet==============', searchResultsSet)

    const debouncedSearchTermSet = useDebounce(searchTermSet, 500);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleSearchSet = () => {
        setApi.searchSets(searchTermSet)
            .then(({ data }) => {
                const dataSearch = data.data;
                return Promise.all(
                    dataSearch.map((image: any) => {
                        return filesApi.getFile(image.imageUrl)
                            .then(({ data }) => {
                                return {
                                    ...image,
                                    imageUrl: data.data // Assuming data.data is the updated image URL
                                };
                            })
                            .catch(error => {
                                console.error('Error getting file:', error);
                                return {
                                    ...image,
                                    imageUrl: 'NoImage' // Example fallback if there's an error
                                };
                            });
                    })
                );
            })
            .then(updatedImages => {
                setSearchResultsSet(updatedImages);
            })
            .catch(error => {
                toast.error('Không tìm thấy bộ sản phẩm');
            })
            .finally(() => {
            });
    };


    const handleSearch = () => {
        productApi.searchProduct(searchTerm)
            .then(({ data }) => {
                console.log('data searchhhkkkkh', data)

                setSearchResults(data.data);
            })
            .catch(error => {
                toast.error('Không tìm thấy sản phẩm');
            })
            .finally(() => {
            });

    };


    useEffect(() => {
        if (debouncedSearchTermSet) {
            handleSearchSet();
        }
    }, [debouncedSearchTermSet]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch();
        }
    }, [debouncedSearchTerm]);



    //  ========================================================= các hàm để thêm sản phẩm  và số lượng vào bộ sản phẩm  ========================================================= 


    const [getDetailsPro, setGetDetailsPro] = useState<any[]>([]);
    const [productsRequest, setProductsRequest] = useState<
        {
            productIdOrSetId: string;
            quantity: number;
            unitPrice: number;
            note: string;
            isProductId: boolean;
        }[]
    >([]);


    useEffect(() => {

        const productRequests = orderId.productOrderResponses.map((product: any) => ({
            productIdOrSetId: product.productId,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            note: product.note,
            isProductId: true,
        }));
        const setRequests = orderId.setOrderResponses.map((set: any) => ({
            productIdOrSetId: set.setId,
            quantity: set.quantity,
            unitPrice: set.unitPrice,
            note: set.note,
            isProductId: false,
        }));
        const combinedRequests = [...productRequests, ...setRequests];
        // console.log('combinedRequests', combinedRequests)
        setProductsRequest(combinedRequests);



        const productRequestsPro = orderId.productOrderResponses.map((product: any) => ({
            imageUrl: product.imageProductUrl,
            id: product.productId,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            note: product.note,
            isProductId: true,
            code: product.productCode,
            name: product.productName,
        }));
        const setRequestsPro = orderId.setOrderResponses.map((set: any) => ({
            imageUrl: set.imageSetUrl,
            id: set.setId,
            quantity: set.quantity,
            unitPrice: set.unitPrice,
            note: set.note,
            isProductId: false,
            code: set.setCode,
            name: set.setName,
        }));
        const combinedRequestsPro = [...productRequestsPro, ...setRequestsPro];
        setGetDetailsPro(combinedRequestsPro)


    }, [orderId])

    // console.log('getDetailsProgetDetailsPro=========', getDetailsPro)
    const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);


    // console.log("productsRequest===", productsRequest);
    // console.log("getDetailsPro===", getDetailsPro);

    // ** hàm thêm vào danh sách sản phẩm
    const handleAddProducts = (product: any) => {
        console.warn("product", product.id);
        setSearchTerm("");
        setSearchTermSet("");
        // Kiểm tra xem sản phẩm đã có trong danh sách setGetDetailsProUpdate chưa
        const existingDetailProUpdate = getDetailsProUpdate.some(
            (item) => item.productId === product.id
        );

        if (existingDetailProUpdate) {
            return toast.error("Sản phẩm đã tồn tại");
        }

        // Kiểm tra xem sản phẩm đã có trong danh sách getDetailsPro chưa
        const existingDetailProduct = getDetailsPro.find(
            (item) => item.id === product.id
        );

        if (!existingDetailProduct) {
            // Nếu chưa có, thêm sản phẩm vào danh sách getDetailsPro
            const updatedDetailsPro = [...getDetailsPro, product];
            setGetDetailsPro(updatedDetailsPro);
        }

        // Kiểm tra xem sản phẩm đã có trong danh sách productsRequest chưa
        const existingProduct = productsRequest.find(
            (item) => item.productIdOrSetId === product.id
        );

        if (existingProduct) {
            // Nếu đã có, tăng số lượng lên 1
            const updatedProductsRequest = productsRequest.map((item) =>
                item.productIdOrSetId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setProductsRequest(updatedProductsRequest);
        } else {
            // Nếu chưa có, thêm sản phẩm vào danh sách với số lượng là 1 và các thuộc tính khác
            setProductsRequest([
                ...productsRequest,
                { productIdOrSetId: product.id, quantity: 1, unitPrice: 0, note: "", isProductId: checkProducts ? false : true },
            ]);
        }
    };

    const handleMinusProducts = (productId: string) => {
        const updatedDetailsPro = getDetailsPro.filter(
            (product) => product.id !== productId
        );
        setGetDetailsPro(updatedDetailsPro);

        // Lọc sản phẩm cần xóa khỏi productsRequest
        const updatedProductsRequest = productsRequest.filter(
            (product) => product.productIdOrSetId !== productId
        );
        setProductsRequest(updatedProductsRequest);


        toast.success("Đã xóa sản phẩm khỏi danh sách");
    };



    const handleChange = (productId: string, name: string, value: any) => {
        setProductsRequest((prev) => {
            return prev.map((item) => {
                if (item.productIdOrSetId === productId) {
                    return { ...item, [name]: value };
                }
                return item;
            });
        });
    };

    // ========================================================= Xử lý khi người dùng gửi form ========================================================= 


    const handleSubmit = async () => {
        const requestBody = {
            orderId: orderId.orderId,
            orderDetailRequests: productsRequest
        };

        console.log('requestBody', requestBody);

        try {
            setLoading(true);
            orderApi.createOrderId(requestBody)
                .then(({ data }) => {
                    if (data.isSuccess) {
                        // console.log("dataaaa=======", data);
                        toast.success("Cặp nhật sản phẩm thành công")
                    }
                })
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const { pending } = useFormStatus();


    return (


        <Dialog.Root open={open} onOpenChange={handleOnDialog}>
            <Dialog.Trigger className="rounded p-2 hover:bg-gray-200">
                <PenLine />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
                    <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
                        <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4">
                            <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary ">
                                <h2 className="text-2xl text-white">Chỉnh sửa sản phẩm đơn hàng</h2>
                                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="p-4  h-[800px] overflow-auto" >
                                <Card className="">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Thêm sản phẩm cho đơn hàng
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent >
                                        <div className="flex items-center my-4">
                                            <div className="flex items-center border w-full rounded-lg px-2 " >
                                                <Search className="mr-1 h-4 w-4 shrink-0 opacity-50" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <ChevronDown className="mr-2 h-4 w-4  text-primary-backgroudPrimary" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" >
                                                        <DropdownMenuItem onClick={handleCheckProduct}>Sản phẩm</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={handleCheckOrder}>Bộ sản phẩm</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                {
                                                    !checkProducts ? (
                                                        <Input
                                                            placeholder="tìm kiếm tên sản phẩm ..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="border-none w-full"
                                                        />
                                                    ) : (
                                                        <Input
                                                            placeholder="tìm kiếm bộ sản phẩm ..."
                                                            value={searchTermSet}
                                                            onChange={(e) => setSearchTermSet(e.target.value)}
                                                            className="border-none w-full"
                                                        />
                                                    )
                                                }

                                            </div>
                                        </div>
                                        {
                                            !checkProducts ? (
                                                <>
                                                    {searchResults !== null ? (
                                                        <Card className="my-4">
                                                            <CardHeader className="font-semibold text-xl">
                                                                <span>Thông tin sản phẩm</span>
                                                            </CardHeader>
                                                            <CardContent className="overflow-y-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead className="w-[100px]">
                                                                                Ảnh
                                                                            </TableHead>
                                                                            <TableHead>Tên</TableHead>
                                                                            <TableHead>Mã Code</TableHead>
                                                                            <TableHead className="text-right">
                                                                                Thêm
                                                                            </TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>

                                                                    <TableBody>
                                                                        {searchResults !== null ? (
                                                                            searchResults.map((product) => (
                                                                                <TableRow key={product.id}>
                                                                                    <TableCell className="font-medium">
                                                                                        <ImageDisplayDialog
                                                                                            images={product?.imageUrl}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {product?.name}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {product?.code}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="icon"
                                                                                            onClick={() =>
                                                                                                handleAddProducts(product)
                                                                                            }
                                                                                        >
                                                                                            <PackagePlus className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow className="text-center flex justify-center items-center w-full">
                                                                                không thấy sản phẩm nào
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        ""
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {searchResultsSet !== null ? (
                                                        <Card className="my-4">
                                                            <CardHeader className="font-semibold text-xl">
                                                                <span>Thông tin Bộ sản phẩm</span>
                                                            </CardHeader>
                                                            <CardContent className="overflow-y-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead className="w-[100px]">
                                                                                Ảnh
                                                                            </TableHead>
                                                                            <TableHead>Tên</TableHead>
                                                                            <TableHead>Mã Code</TableHead>
                                                                            <TableHead className="text-right">
                                                                                Thêm
                                                                            </TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>

                                                                    <TableBody>
                                                                        {searchResultsSet !== null ? (
                                                                            searchResultsSet.map((product) => (
                                                                                <TableRow key={product.id}>
                                                                                    <TableCell className="font-medium">
                                                                                        <ImageDisplayDialog
                                                                                            images={product?.imageUrl}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {product?.name}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {product?.code}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="icon"
                                                                                            onClick={() =>
                                                                                                handleAddProducts(product)
                                                                                            }
                                                                                        >
                                                                                            <PackagePlus className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))
                                                                        ) : (
                                                                            <TableRow className="text-center flex justify-center items-center w-full">
                                                                                không thấy sản phẩm nào
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        ""
                                                    )}
                                                </>
                                            )
                                        }

                                        <div className="md:col-span-1  md:mt-0">
                                            <Card className="mt-4">
                                                <CardHeader className="font-semibold text-xl">
                                                    <span>Thông tin sản phẩm đã thêm</span>
                                                </CardHeader>
                                                <CardContent >
                                                    <Table className="overflow-x-auto md:w-full w-[800px]">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="w-[100px]">Sản phẩm</TableHead>
                                                                <TableHead>Tên sản phẩm</TableHead>
                                                                <TableHead>Số lượng</TableHead>
                                                                <TableHead>Đơn vị giá</TableHead>
                                                                <TableHead>Ghi chú</TableHead>
                                                                <TableHead className="text-right">Xóa</TableHead>
                                                            </TableRow>
                                                        </TableHeader>

                                                        <TableBody>
                                                            {getDetailsPro.map((product, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="font-medium w-[20%]">
                                                                        <div className="flex  gap-4">
                                                                            <Image
                                                                                alt="ảnh mẫu"
                                                                                className="w-[50px] h-[50px] rounded-lg object-contain"
                                                                                width={900}
                                                                                height={900}
                                                                                src={
                                                                                    product?.imageUrl === "Image_not_found" ? NoImage : product?.imageUrl
                                                                                }
                                                                            />


                                                                            <div className="font-medium dark:text-white">

                                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                    <b>Code: </b>
                                                                                    {product.code}
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {product.name}
                                                                    </TableCell>

                                                                    <TableCell className="font-medium">
                                                                        <input
                                                                            type="number"
                                                                            name="quantity"
                                                                            value={
                                                                                productsRequest.find(
                                                                                    (item) => item.productIdOrSetId === product.id
                                                                                )?.quantity || 0
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleChange(
                                                                                    product.id,
                                                                                    "quantity",
                                                                                    parseInt(e.target.value)
                                                                                )
                                                                            }
                                                                            className="w-16 text-center outline-none"
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell className="font-medium">
                                                                        <input
                                                                            type="number"
                                                                            name="unitPrice"
                                                                            value={
                                                                                productsRequest.find(
                                                                                    (item) => item.productIdOrSetId === product.id
                                                                                )?.unitPrice || 0
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleChange(
                                                                                    product.id,
                                                                                    "unitPrice",
                                                                                    parseInt(e.target.value)
                                                                                )
                                                                            }
                                                                            className="w-16 text-center outline-none"
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell className="relative">
                                                                        <div className="overflow-auto bg-green-200 p-4 w-[200px] h-24 text-justify break-words whitespace-pre-wrap">
                                                                            <Textarea
                                                                                id="note"
                                                                                name="note"
                                                                                value={
                                                                                    productsRequest.find(
                                                                                        (item) => item.productIdOrSetId === product.id
                                                                                    )?.note || ""
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleChange(
                                                                                        product.id,
                                                                                        "note",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className="col-span-3 bg-green-200"
                                                                            />
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="font-medium">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleMinusProducts(product.id)
                                                                            }
                                                                        >
                                                                            <Minus className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>

                                                            ))}
                                                        </TableBody>

                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card>
                                            <Button
                                                onClick={handleSubmit}
                                                type="submit"
                                                className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
                                                disabled={pending}
                                            >
                                                {pending ? "Loading..." : "GỬI"}
                                            </Button>
                                        </Card>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>

    );
}

