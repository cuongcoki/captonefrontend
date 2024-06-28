import { CardHeader, CardTitle, CardFooter, Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ImageDisplayID from "./ImageDisplayID";
import ImageDisplay from "./ImageDisplay";
import { Textarea } from "@/components/ui/textarea";
import { filesApi } from "@/apis/files.api";

interface ImageResponse {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
}

interface Product {
    id: string;
    name: string;
    code: string;
    price: number;
    size: string;
    description: string;
    isInProcessing: boolean;
    imageResponses: ImageResponse[];
}

interface SetProduct {
    setId: string;
    productId: string;
    quantity: number;
    product: Product;
}

interface SetProductProps {
    setProduct: SetProduct[];
}

export default function SetProduct({ setProduct }: SetProductProps) {
    // ** state
    const [open, setOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<SetProduct | null>(null);

    const handleOpenDialog =  async (pro: SetProduct) => {
        try {
            const updatedImages = await Promise.all(
                pro.product.imageResponses.map(async (image: ImageResponse) => {
                    try {
                        const { data } = await filesApi.getFile(image.imageUrl);
                        return {
                            ...image,
                            imageUrl: data.data // Assuming data.data is the updated image URL
                        };
                    } catch (error) {
                        console.error('Error getting file:', error);
                        return {
                            ...image,
                            imageUrl: '' // Handle error case if needed
                        };
                    }
                })
            );

            const updatedProduct: SetProduct = {
                ...pro,
                product: {
                    ...pro.product,
                    imageResponses: updatedImages
                }
            };

            setSelectedProduct(updatedProduct);
            setOpen(true);
        } catch (error) {
            console.error('Error updating images:', error);
            // Handle error state if necessary
        }
    };
    // console.log('setProductdetaill', setProduct)
    console.log('selectedProductselectedProduct', selectedProduct)
    return (
        <Card x-chunk="dashboard-07-chunk-1">
            <CardHeader>
                <CardTitle>Chi tiết bộ sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã CODE</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Số lượng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            setProduct.map((pro, index) => (
                                <TableRow key={index} onClick={() => handleOpenDialog(pro)}>
                                    <TableCell className="font-semibold">
                                        {pro.product.code}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {pro.product.name}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {pro.quantity}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
            <div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="w-full min-w-[90%] md:min-w-[70%]">
                        <DialogTitle className="visible">
                            {/* Chi tiết bộ sản phẩm */}
                        </DialogTitle>

                        <div className=" w-full min-w-[90%] md:min-w-[70%] bg-white p-2 rounded-lg ">
                            <div className="p-4 flex flex-col justify-between gap-4  md:w-full">
                                <Card>
                                    <CardHeader className="font-semibold text-xl ">
                                        <div className="flex justify-between items-center">
                                            <span>Thông tin sản phẩm</span> <span>Số lượng đặt: {selectedProduct?.quantity}</span>

                                        </div>
                                    </CardHeader>
                                    <CardContent className=" grid-flow-col justify-center gap-6 md:flex ">
                                        <div className="w-1/2 md:w-full ">
                                            {selectedProduct && (
                                                <ImageDisplay images={selectedProduct.product.imageResponses} />
                                            )}
                                        </div>
                                        <div className="w-full md:mt-0 mt-6">
                                            <Card>
                                                <CardHeader className="font-semibold text-xl ">
                                                    <span>Thông tin sản phẩm chi tiết</span>
                                                </CardHeader>
                                                <CardContent className="overflow-auto">
                                                    <div className="w-[100px]"><span className="text-xl font-medium"></span></div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="username">Tên</Label>
                                                        <Input id="username" defaultValue={selectedProduct?.product.name} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="username">Mã Code</Label>
                                                        <Input id="username" defaultValue={selectedProduct?.product.code} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="username">Giá</Label>
                                                        <Input id="username" defaultValue={selectedProduct?.product.price} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="username">Kích thước</Label>
                                                        <Input id="username" defaultValue={selectedProduct?.product.size} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="description">Mô tả</Label>
                                                        <Textarea
                                                            id="description"
                                                            className="min-h-28"
                                                            defaultValue={selectedProduct?.product.description}
                                                        />
                                                    </div>
                                                    {/* <div className="space-y-1">
                                                        <Label htmlFor="username">Kích thước</Label>
                                                        <Input id="username" defaultValue={selectedProduct?.product.isInProcessing ? 'Xử lý' : 'Không xử lý'} />
                                                    </div> */}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>


                            </div>
                        </div>

                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    );
}