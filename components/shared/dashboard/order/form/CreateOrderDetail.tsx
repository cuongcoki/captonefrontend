// ** import UI
import { Button } from "@/components/ui/button";

// ** import ICON
import { ChevronDown, Minus, PackagePlus, Pencil, Plus, Search, X } from "lucide-react";

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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
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

export const CreateOrderDetails: React.FC<OrderID> = ({ orderId }) => {
    // console.log('orderId', orderId)
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
    console.log('searchResults', searchResults)

    const [searchTermSet, setSearchTermSet] = useState<string>('');
    const [searchResultsSet, setSearchResultsSet] = useState<any[]>([]);
    console.log('searchResultsSet==============', searchResultsSet)

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
    // console.log('getDetailsProgetDetailsPro=========', getDetailsPro)
    const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);


    console.log("productsRequest", productsRequest);


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


    const onSubmit = async (formData: z.infer<typeof OrderDetailRequestSchema>) => {
        console.log('formData', formData)
        setLoading(true);

    };

    const { pending } = useFormStatus();


    return (

        <div className="grid gap-4  lg:grid-cols-5 lg:gap-8">

            <div className="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Thêm sản phẩm cho đơn hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    <Table className="overflow-x-auto">
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
                                                <TableRow>
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
                                                    z
                                                    <TableCell className="relative">
                                                        <div className="overflow-auto bg-green-200 p-4 w-[200px] h-24 text-justify break-words whitespace-pre-wrap">
                                                            {productsRequest.find(
                                                                (item) => item.productIdOrSetId === product.id
                                                            )?.note || ""}
                                                        </div>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Pencil className="h-4 w-4 m-2 absolute right-0 top-0" />
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Ghi chú</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div>
                                                                        <Label htmlFor="note" className="text-right">
                                                                            Ghi chú của khách hàng
                                                                        </Label>
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
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
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
                    </CardContent>
                </Card>
            </div>

        </div>


    );
}

