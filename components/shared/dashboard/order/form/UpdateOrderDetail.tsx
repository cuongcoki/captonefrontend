// ** import UI
import { Button } from "@/components/ui/button";

// ** import ICON
import {
  Check,
  ChevronDown,
  Minus,
  PenLine,
  Plus,
  Search,
  X,
} from "lucide-react";

// ** import REACT
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderDetailRequestSchema } from "@/schema/order";

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

import * as Dialog from "@radix-ui/react-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { productApi } from "@/apis/product.api";
import toast from "react-hot-toast";
import ImageDisplayDialog from "./imageDisplayDialog";
import { setApi } from "@/apis/set.api";
import { filesApi } from "@/apis/files.api";
import { NoImage } from "@/constants/images";
import useDebounce from "./useDebounce";
import { orderApi } from "@/apis/order.api";
import { OrderStore } from "../order-store";
import TitleComponent from "@/components/shared/common/Title";

interface OrderID {
  orderId?: any;
}

let initialFormValuesProduct: any = null;
export const UpdateOrderDetails: React.FC<OrderID> = ({ orderId }) => {
  //state
  const [open, setOpen] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const { ForceRender } = OrderStore();
  const [openAlert, setOpenAlert] = useState<boolean>(false);


  const handleOnDialog = () => {
    setOpen(true);
  };
  const handleOffDialogA = () => {
    setOpenAlert(false);
  };
 

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [searchTermSet, setSearchTermSet] = useState<string>("");
  const [searchResultsSet, setSearchResultsSet] = useState<any[]>([]);

  const debouncedSearchTermSet = useDebounce(searchTermSet, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchSet = () => {
    setApi
      .searchSets(searchTermSet)
      .then(({ data }) => {
        const dataSearch = data.data;
        return Promise.all(
          dataSearch.map((image: any) => {
            return filesApi
              .getFile(image.imageUrl)
              .then(({ data }) => {
                return {
                  ...image,
                  imageUrl: data.data,
                };
              })
              .catch((error) => {
                return {
                  ...image,
                  imageUrl: "NoImage",
                };
              });
          })
        );
      })
      .then((updatedImages) => {
        setSearchResultsSet(updatedImages);
      })
      .catch((error) => {
        setSearchResultsSet([])
      })
      .finally(() => { });
  };

  const handleSearch = () => {
    productApi
      .searchProduct(searchTerm)
      .then(({ data }) => {

        setSearchResults(data.data);
      })
      .catch((error) => {
        setSearchResults([])
      })
      .finally(() => { });
  };

  useEffect(() => {
    if (debouncedSearchTermSet) {
      handleSearchSet();
    }
  }, [debouncedSearchTermSet, searchTermSet]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm, searchTerm]);

  //  ========================================================= các hàm để thêm sản phẩm  và số lượng vào bộ sản phẩm  =========================================================
  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };
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
    const productRequests = orderId.productOrderResponses.map(
      (product: any) => ({
        productIdOrSetId: product.productId,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        note: product.note,
        isProductId: true,
      })
    );
    const setRequests = orderId.setOrderResponses.map((set: any) => ({
      productIdOrSetId: set.setId,
      quantity: set.quantity,
      unitPrice: set.unitPrice,
      note: set.note,
      isProductId: false,
    }));
    const combinedRequests = [...productRequests, ...setRequests];
    setProductsRequest(combinedRequests);

    const productRequestsPro = orderId.productOrderResponses.map(
      (product: any) => ({
        imageUrl: product.imageProductUrl,
        id: product.productId,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        note: product.note,
        isProductId: true,
        code: product.productCode,
        name: product.productName,
      })
    );
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
    setGetDetailsPro(combinedRequestsPro);
  }, [orderId, fetchTrigger]);

  const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);

  // ** hàm thêm vào danh sách sản phẩm
  const handleAddProducts = (product: any) => {

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
        {
          productIdOrSetId: product.id,
          quantity: 1,
          unitPrice: 1,
          note: "",
          isProductId: checkProducts ? false : true,
        },
      ]);
    }
  };

  const handleMinusProducts = (productId: string) => {
    const updatedDetailsPro = getDetailsPro.filter(
      (product) => product.id !== productId
    );
    setGetDetailsPro(updatedDetailsPro);

    const updatedProductsRequest = productsRequest.filter(
      (product) => product.productIdOrSetId !== productId
    );
    setProductsRequest(updatedProductsRequest);

  };

  const handleChange = (productId: string, name: string, value: any) => {
    if (name == "quantity" && !value) {
      value = 1;
    }

    if (name === "unitPrice" && !value) {
      value = "0";
    }
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

    const productsRequestTrimmed = productsRequest.map((product) => {
      if (product.unitPrice < 0 && product.unitPrice === null) {
        toast.error(`Đơn giá phải lớn hơn 0 cho sản phẩm`);
        throw new Error("Đơn giá phải lớn hơn 0.");
      }

      return {
        productIdOrSetId: product.productIdOrSetId,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        note: product.note.trim(),
        isProductId: product.isProductId,
      };
    });
    const requestBody = {
      orderId: orderId.orderId,
      orderDetailRequests: productsRequestTrimmed,
    };

    try {
      setLoading(true);
      orderApi.createOrderId(requestBody).then(({ data }) => {
        if (data.isSuccess) {
          ForceRender();
          setOpen(false);
          toast.success("Cặp nhật sản phẩm thành công");
        }
      });
    } catch (error: any) {
      if (error.response.data.error) {
        for (const key in error.response.data.error) {
          toast.error(error.response.data.error[key][0]);
        }
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const { pending } = useFormStatus();
  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();
    valueString = valueString.replace(/\D/g, "");
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    let reversed = valueString.split("").reverse().join("");
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
    let formatted = formattedReversed.split("").reverse().join("");
    return formatted;
  };

  const productCheck = 0;
  const setCheck = 1;

  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    setFetchTrigger((prev) => prev + 1);
    form.reset();
    setProductsRequest([]);
    setGetDetailsPro([]);
    setSearchTerm("");
    setSearchTermSet("")
    setSearchResults([]);
    setSearchResultsSet([]);
  }

  useEffect(() => {

  }, [initialFormValuesProduct])

  const handleOffDialog = () => {
    const currentFormValues = productsRequest;
    if (initialFormValuesProduct === null) {
      initialFormValuesProduct = currentFormValues;
    }
    const isFormChanged = JSON.stringify(initialFormValuesProduct) === JSON.stringify(productsRequest);
    if (isFormChanged) {
      setOpen(false);
    } else if (initialFormValuesProduct === null) {
      setOpen(false)
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
        <Dialog.Trigger>
          <div className="rounded p-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <PenLine />
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="visible hidden"></Dialog.Title>
              <Dialog.Description className="visible hidden"></Dialog.Description>
              <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">
                    Chỉnh Sửa Mặt Hàng Của Đơn Hàng
                  </h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4  h-[800px] overflow-auto">
                  <Card >
                    <CardHeader>
                      <TitleComponent
                        title="Danh sách mặt hàng"
                        description="Tìm kiếm - thêm mặt hàng vào đơn đặt hàng."
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center my-4">
                        <div className="flex items-center border w-full rounded-lg px-2 ">
                          <Search className="mr-1 h-4 w-4 shrink-0 opacity-50" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <ChevronDown className="mr-2 h-4 w-4  text-primary-backgroudPrimary" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={handleCheckProduct}>
                                Sản phẩm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleCheckOrder}>
                                Bộ sản phẩm
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {!checkProducts ? (
                            <Input
                              placeholder="Tìm kiếm sản phẩm..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="border-none w-full"
                            />
                          ) : (
                            <Input
                              placeholder="Tìm kiếm bộ sản phẩm..."
                              value={searchTermSet}
                              onChange={(e) => setSearchTermSet(e.target.value)}
                              className="border-none w-full"
                            />
                          )}
                        </div>
                      </div>
                      {!checkProducts ? (
                        <>
                          {searchResults !== null ? (
                            <Card className="my-4">
                              <CardHeader className="font-semibold text-xl">
                                <span>Thông tin sản phẩm</span>
                              </CardHeader>
                              <CardContent className="w-full grid grid-cols-12 gap-4 min-h-[100px]  overflow-y-auto ">
                                {searchResults !== null ? (
                                  searchResults.map((product) => (
                                    <div key={product.id} className="group relative w-[60px] h-[60px] shadow-md">
                                      <div className="font-medium flex flex-col rounded-md">
                                        <ImageDisplayDialog
                                          images={product}
                                          checkProduct={productCheck}
                                        />
                                        <Check
                                          className={`w-5 h-5 ${productsRequest.some(
                                            (item1) => item1.productIdOrSetId === product.id
                                          )
                                            ? "absolute top-0 right-0 bg-primary text-white"
                                            : "hidden"
                                            }`}
                                        />
                                      </div>
                                      <div>
                                        <Button
                                          variant={"ghost"}
                                          size={"icon"}
                                          className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                          onClick={() =>
                                            handleAddProducts(product)
                                          }
                                        >
                                          <Plus className="text-white" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <TableRow className="text-center flex justify-center items-center w-full">
                                    Không tìm thấy sản phẩm nào.
                                  </TableRow>
                                )}
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
                                <span>Thông tin bộ sản phẩm</span>
                              </CardHeader>
                              <CardContent className="w-full grid grid-cols-12 gap-4 min-h-[100px]  overflow-y-auto ">
                                {searchResultsSet !== null ? (
                                  searchResultsSet.map((product) => (
                                    <div key={product.id} className="group relative w-[60px] h-[60px] shadow-md">
                                      <div className="font-medium flex flex-col rounded-md">
                                        <ImageDisplayDialog
                                          images={product}
                                          checkProduct={setCheck}
                                        />
                                        <Check
                                          className={`w-5 h-5 ${productsRequest.some(
                                            (item1) => item1.productIdOrSetId === product.id
                                          )
                                            ? "absolute top-0 right-0 bg-primary text-white"
                                            : "hidden"
                                            }`}
                                        />
                                      </div>
                                      <div>
                                        <Button
                                          variant={"ghost"}
                                          size={"icon"}
                                          className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                          onClick={() =>
                                            handleAddProducts(product)
                                          }
                                        >
                                          <Plus className="text-white" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center flex justify-center items-center w-full">
                                    Không tìm thấy bộ sản phẩm nào.
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ) : (
                            ""
                          )}
                        </>
                      )}

                      <div className="md:col-span-1  md:mt-0">
                        <Card className="mt-4 ">
                          <CardHeader className="font-semibold text-xl">
                            <span>Thông tin sản phẩm đã thêm</span>
                          </CardHeader>
                          <CardContent className="overflow-auto max-h-[350px]">
                            <Table className="overflow-x-auto md:w-full w-[800px]">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">Mặt hàng
                                  </TableHead>
                                  <TableHead>Loại hàng</TableHead>
                                  <TableHead>Số lượng</TableHead>
                                  <TableHead>Đơn giá</TableHead>
                                  <TableHead>Ghi chú</TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>

                              <TableBody >
                                {getDetailsPro.map((product, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium w-[20%]">
                                      <div className="flex flex-col gap-2">
                                        <Image
                                          alt="ảnh mẫu"
                                          className="w-[50px] h-[50px] rounded-lg object-cover"
                                          width={900}
                                          height={900}
                                          src={
                                            product?.imageUrl ===
                                              "Image_not_found"
                                              ? NoImage
                                              : product?.imageUrl
                                          }
                                        />

                                        <div className="font-medium dark:text-white">
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {limitLength(product.code, 10)} - {limitLength(product.name, 15)}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{product.isProductId === true ? "Sản phẩm" : "Bộ sản phẩm"}</TableCell>
                                    <TableCell className="font-medium">
                                      <Input
                                        name="quantity"
                                        value={formatCurrency(
                                          productsRequest.find(
                                            (item) =>
                                              item.productIdOrSetId === product.id
                                          )?.quantity
                                        )}
                                        onChange={(e) =>
                                          handleChange(
                                            product.id,
                                            "quantity",
                                            parseInt(
                                              e.target.value.replace(/\./g, "")
                                            )
                                          )
                                        }
                                        className="w-16 text-left outline-none"
                                      />
                                    </TableCell>

                                    <TableCell className="font-medium">
                                      <Input
                                        name="unitPrice"
                                        step={1}
                                        value={formatCurrency(
                                          productsRequest.find(
                                            (item) =>
                                              item.productIdOrSetId === product.id
                                          )?.unitPrice || 0
                                        )}
                                        onChange={(e) =>
                                          handleChange(
                                            product.id,
                                            "unitPrice",
                                            parseInt(
                                              e.target.value.replace(/\./g, "")
                                            )
                                          )
                                        }
                                        className="w-32 text-left outline-none"
                                      />
                                    </TableCell>

                                    <TableCell className="relative">
                                      {/* <div className="overflow-auto  p-4 w-[200px] h-24 text-justify break-words whitespace-pre-wrap"> */}
                                      <Textarea
                                        id="note"
                                        name="note"
                                        value={
                                          productsRequest.find(
                                            (item) =>
                                              item.productIdOrSetId ===
                                              product.id
                                          )?.note || ""
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            product.id,
                                            "note",
                                            e.target.value
                                          )
                                        }
                                        className="col-span-3 border shadow-md"
                                      />
                                      {/* </div> */}
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

                      <Card className="my-4">
                        <Button
                          onClick={handleSubmit}
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={pending}
                        >
                          {pending ? "Đang xử lý..." : "Chỉnh sửa đơn hàng"}
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
    </>
  );
};
