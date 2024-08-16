// ** import UI
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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

// ** import ICON
import {
  Check,
  ImageUp,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { X } from "lucide-react";

// ** import REACT
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { useFormStatus } from "react-dom";

import { SetUpdateSchema } from "@/schema/set";
import { setApi } from "@/apis/set.api";
import Image from "next/image";
import { filesApi } from "@/apis/files.api";
import toast from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import ImageDisplayDialog from "./imageDisplayDialog";
import { NoImage } from "@/constants/images";
import { ProductSetStore } from "@/components/shared/dashboard/product-set/product-set-store";
import { Label } from "@/components/ui/label";
import TitleComponent from "@/components/shared/common/Title";
import { MyContext } from "../table/sets/RenderTable";
import { generateRandomString, limitLength } from "@/lib/utils";

interface ImageResponse {
  id: string;
  imageUrl: string;
  isBluePrint: boolean;
  isMainImage: boolean;
}

interface SetID {
  setId: string;
  children: React.ReactNode;
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

export const SetUpdateForm: React.FC<SetID> = ({ setId, children }) => {
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const { forceUpdate } = useContext(MyContext);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };

  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [setProductId, setProductSetId] = useState<any>([]);
  const [nameImage, setNameImage] = useState<any>("");
  const [imageRequests, setImageRequests] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<File | null>(null);

  // ** các hàm để sử lý đăng ảnh
 
  // ** Xử lý khi người dùng tải lên 1 hình ảnh mới
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setLoading(true);
    try {
      if (file) {
        const extension = file.name.substring(file.name.lastIndexOf("."));

        const randomString = generateRandomString();
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        const second = date.getSeconds().toString().padStart(2, "0");

        const changedFileName = `images-${randomString}-${year}${month}${day}${hour}${minute}${second}${extension}`;
        const newFile = new File([file], changedFileName, { type: file.type });
        setNameImage(changedFileName);
        if (!newFile) {
          return;
        }
        const formData = new FormData();
        formData.append("receivedFiles", newFile);

        await filesApi.postFiles(formData);

        const fileName = newFile.name;
        const { data } = await filesApi.getFile(fileName);
        const names = data.data;

        setImageRequests(names);
      } else toast.error("Không có hình ảnh nào được chọn");
    } catch (error) {
      toast.error("Lỗi khi tải hình ảnh lên");
    } finally {
      setLoading(false);
    }
  };


  // ** Xử lý khi người dùng xóa một hình ảnh đã có
  const handleDeleteImage = () => {
    setImageRequests("");
    setImageUrls(null);
  };

  useEffect(() => {
    const fetchDataProductId = async () => {
      setLoading(true);
      try {
        const res = await setApi.getSetId(setId);
        const userData = res.data.data;
        const productData = userData.setProducts;

        // Fetch image responses for each product in setProducts
        const updatedSetProducts: SetProduct[] = await Promise.all(
          productData.map(async (setProduct: any) => {
            const productData: Product = setProduct.product;

            // Fetch image response for the first image only
            const firstImageResponse: ImageResponse =
              productData.imageResponses[0];

            try {
              // Fetch image response for the first image
              const { data } = await filesApi.getFile(
                firstImageResponse.imageUrl
              );
              const updatedFirstImageResponse: ImageResponse = {
                ...firstImageResponse,
                imageUrl: data.data, // Assuming data.data is the updated image URL
              };

              // Update the product with updated first image response
              const updatedProduct: Product = {
                ...productData,
                imageResponses: [updatedFirstImageResponse], // Replace with the updated first image response
              };

              return {
                ...setProduct,
                product: updatedProduct,
              };
            } catch (error) {

              return setProduct;
            }
          })
        );

        setGetDetailsProUpdate(updatedSetProducts);
        setProductSetId(userData);

        // Call filesApi.getFile using async/await
        const fileResponse = await filesApi.getFile(userData.imageUrl);
        const imageData = fileResponse.data.data;

        setImageRequests(imageData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDataProductId();
  }, [setId, fetchTrigger]);

  // useForm hook for managing form state and validation
  const form = useForm({
    resolver: zodResolver(SetUpdateSchema),
    defaultValues: {
      code: "",
      description: "",
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (setProductId) {
      form.reset({
        code: setProductId.code,
        description: setProductId.description,
        name: setProductId.name,
        imageUrl: setProductId.imageUrl,
      });
    }
  }, [setProductId, form]);


  // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    setLoading(true);
    productApi
      .searchProductForSet(searchTerm)
      .then(({ data }) => {
        setSearchResults(data.data.data);
      })
      .catch((error) => {
        setSearchResults([])
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // ** các hàm để thêm sản phẩm và số lượng vào bộ sản phẩm

  // console.log('getDetailsProUpdate', getDetailsProUpdate)
  const [getDetailsPro, setGetDetailsPro] = useState<any[]>([]);
  const [productsRequest, setProductsRequest] = useState<
    {
      productId: string;
      quantity: number;
    }[]
  >([]);

  const [getDetailsProUpdate, setGetDetailsProUpdate] = useState<any[]>([]);
 
  const [updateProducts, setUpdateProducts] = useState<
    {
      productId: string;
      quantity: number;
    }[]
  >([]);

  // ** hàm update số lượng danh sách sản phẩm
  const handleChangeUpdate = (productId: string, newQuantity: number) => {
    const existingProductIndex = updateProducts.findIndex(
      (product) => product.productId === productId
    );

    let updatedProductsRequest;

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại trong danh sách, cập nhật số lượng
      updatedProductsRequest = updateProducts.map((product) => {
        if (product.productId === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
    } else {
      // Nếu sản phẩm chưa tồn tại trong danh sách, thêm sản phẩm vào danh sách với số lượng mới
      updatedProductsRequest = [
        ...updateProducts,
        { productId, quantity: newQuantity },
      ];
    }

    setUpdateProducts(updatedProductsRequest);
  };

  // ** hàm thêm vào danh sách sản phẩm
  const handleAddProducts = (product: any) => {

    //kiểm tra xem sản phẩm đã có trong danh sách setGetDetailsProUpdate chưa
    const exstingDetailProUpdate = getDetailsProUpdate.some(
      (item) => item.productId === product.id
    );

    if (exstingDetailProUpdate) {
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
      (item) => item.productId === product.id
    );

    if (existingProduct) {
      // Nếu đã có, tăng số lượng lên 1
      const updatedProductsRequest = productsRequest.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setProductsRequest(updatedProductsRequest);
    } else {
      // Nếu chưa có, thêm sản phẩm vào danh sách với số lượng là 1
      setProductsRequest([
        ...productsRequest,
        { productId: product.id, quantity: 1 },
      ]);
    }
  };

  // ** hàm xóa khỏi danh sách sản phẩm
  const [removeProductIds, setRemoveProductIds] = useState<string[]>([]);

  const handleDeleteProducts = (productID: string) => {
    setRemoveProductIds([...removeProductIds, productID]);
    const updatedProductsRequest = updateProducts.filter(
      (item) => item.productId !== productID
    );
    setUpdateProducts(updatedProductsRequest);
    const updateProUpdate = getDetailsProUpdate.filter(
      (item) => item.productId !== productID
    );
    setGetDetailsProUpdate(updateProUpdate);
    // toast.success("Đã xóa sản phẩm khỏi danh sách");
  };

  const handleMinusProducts = (productId: string) => {
    const updatedDetailsPro = getDetailsPro.filter(
      (product) => product.id !== productId
    );
    setGetDetailsPro(updatedDetailsPro);

    // Lọc sản phẩm cần xóa khỏi productsRequest
    const updatedProductsRequest = productsRequest.filter(
      (product) => product.productId !== productId
    );
    setProductsRequest(updatedProductsRequest);

    // Nếu sản phẩm có trong danh sách updateProducts, loại bỏ nó
    const updatedUpdateProducts = updateProducts.filter(
      (product) => product.productId !== productId
    );
    setUpdateProducts(updatedUpdateProducts);

    // toast.success("Đã xóa sản phẩm khỏi danh sách");
  };

  // ** hàm thay đổi số lượng khỏi danh sách sản phẩm
  const handleChange = (productId: string, newQuantity: number) => {
    const existingProductIndex = productsRequest.findIndex(
      (product) => product.productId === productId
    );

    let updatedProductsRequest;

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại trong danh sách, cập nhật số lượng
      updatedProductsRequest = productsRequest.map((product) => {
        if (product.productId === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
    } else {
      // Nếu sản phẩm chưa tồn tại trong danh sách, thêm sản phẩm vào danh sách với số lượng mới
      updatedProductsRequest = [
        ...productsRequest,
        { productId, quantity: newQuantity },
      ];
    }

    setProductsRequest(updatedProductsRequest);
  };


  const onSubmit = async (data: z.infer<typeof SetUpdateSchema>) => {
    // Ensure `nameImage` has been updated
    const requestBody = {
      setId: setProductId.id,
      code: data.code,
      description: data.description,
      name: data.name,
      imageUrl: nameImage === "" ? data.imageUrl : nameImage,
      add: productsRequest,
      update: updateProducts,
      removeProductIds: removeProductIds,
    };

    setApi
      .updateSet(requestBody, setProductId.id)
      .then((res) => {
        toast.success(res.data.message);
        form.reset();
        forceUpdate();
        setGetDetailsPro([]);
        setProductsRequest([]);
        setGetDetailsProUpdate([]);
        setUpdateProducts([]);
        setRemoveProductIds([])
        setOpen(false);
      })
      .catch((error) => {
        if (error.response.data.error) {
          for (const key in error.response.data.error) {
            toast.error(error.response.data.error[key][0]);
          }
        } else {
          toast.error(error.response.data.message);
        }
      });
  };

  const { pending } = useFormStatus();

  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    form.reset();
    setProductsRequest([]);
    setGetDetailsPro([]);
    setUpdateProducts([]);
    setRemoveProductIds([]);
    setFetchTrigger((prev) => prev + 1);
  }

  const { formState } = form;

  const [checkImageChange, setCheckImageChange] = useState<any>()

  useEffect(() => {
    setCheckImageChange(imageRequests)
  }, [])

  const handleOffDialog = () => {
    //add product
    const isArrayEmptyAdd = (arr: any) => {
      return Array.isArray(arr) && arr.length === 0;
    };

    const isAddEmpty = isArrayEmptyAdd(productsRequest);

    // update set
    const isArrayEmptyUpdate = (arr: any) => {
      return Array.isArray(arr) && arr.length === 0;
    };

    const isUpdateEmpty = isArrayEmptyUpdate(updateProducts);

    // remove set
    const isArrayEmptyRemove = (arr: any) => {
      return Array.isArray(arr) && arr.length === 0;
    };


    const checkImage = checkImageChange === imageRequests;

    const isRemoveEmpty = isArrayEmptyRemove(removeProductIds);
   
    if (isAddEmpty && !formState.isDirty && isUpdateEmpty && isRemoveEmpty && !checkImage) {
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
        <Dialog.Trigger asChild className="">
          {children}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-white flex flex-col rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Chỉnh Sửa Thông Tin Bộ Sản Phẩm</h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4 dark:text-white" />
                  </Button>
                </div>
                <div className="grid gap-4 p-4 overflow-y-auto h-[750px] dark:bg-card">




                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ">
                          <Card>
                            <CardHeader>
                              <TitleComponent
                                title="Thông tin"
                                description="Thông tin chung của bộ sản phẩm."
                              />
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                              <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center ">
                                      Mã bộ sản phẩm *
                                    </FormLabel>
                                    <Input type="text" {...field} />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      Tên bộ sản phẩm *
                                    </FormLabel>
                                    <Input type="text" {...field} />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center ">
                                      Mô tả *
                                    </FormLabel>
                                    <Textarea {...field} />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                          <Card
                            className="overflow-hidden"
                            x-chunk="dashboard-07-chunk-4"
                          >
                            <CardHeader>
                              <TitleComponent
                                title="Hình ảnh"
                                description="Hình ảnh minh họa của bộ sản phẩm."
                              />
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-2">

                                {
                                  imageRequests === "" ? (
                                    <div className="aspect-square w-full items-center justify-center flex">
                                      Hãy thêm hình ảnh
                                    </div>
                                  ) : (
                                    <Image
                                      alt="ảnh sản phẩm"
                                      className="aspect-square w-full rounded-md object-contain"
                                      height={900}
                                      src={imageRequests}
                                      width={900}
                                    />
                                  )
                                }
                              </div>

                              <div className="flex gap-4 justify-center items-center p-4">
                                <Trash2
                                  className="h-6 w-6 text-red-600"
                                  onClick={handleDeleteImage}
                                />
                                <div style={{ width: "100%", height: "100%" }}>
                                  <input
                                    id="image"
                                    type="file"
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    onChange={(e) => handleUploadPhoto(e)}
                                  />
                                  <label htmlFor="image">
                                    <ImageUp className="h-6 w-6" />
                                  </label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="gap-4 w-full lg:gap-8">
                            <Card>
                              <CardHeader>
                                <TitleComponent
                              title="Danh sách sản phẩm"
                              description="Danh sách các sản phẩm đã có trong bộ sản phẩm."
                            />
                              </CardHeader>
                              <CardContent className="overflow-auto">
                                {getDetailsProUpdate.map((product, index) => (
                                  <div
                                    className="flex items-start justify-between gap-2 py-4"
                                    key={product.productId}
                                  >
                                    <div className="flex items-start gap-6">
                                      {product.product.imageResponses.length > 0 && (
                                        <div className="w-[60px] h-[60px] bg-primary-backgroudPrimary rounded-md shadow-md">
                                          <Image
                                            src={
                                              product.product.imageResponses[0].imageUrl
                                            } // Lấy ảnh đầu tiên từ mảng imageResponses
                                            alt="Ảnh mẫu"
                                            className="w-full h-full object-cover rounded-md"
                                            width={900}
                                            height={900}
                                          />
                                        </div>
                                      )}
                                      <div className="font-medium dark:text-white">
                                        <div className="hidden sm:block">
                                          <b>Tên Sản Phẩm: </b>
                                          {limitLength(product?.product.name, 50)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 ">
                                          <b className="hidden sm:block">Mã: </b>
                                          {limitLength(product?.product.code, 50)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                          <i>
                                            {limitLength(
                                              product?.product.description,
                                              50
                                            )}
                                          </i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <Label htmlFor="email" className="hidden sm:block" >Số lượng</Label>

                                      <Input
                                        min={0}
                                    className="col-span-2 w-16 text-center outline-none"
                                        type="number"
                                        defaultValue={product.quantity || 0}
                                        onChange={(e) =>
                                          handleChangeUpdate(
                                            product.productId,
                                            parseInt(e.target.value)
                                          )
                                        }
                                      />

                                  <span
                                    className="hover:bg-slate-50 cursor-pointer col-span-1 border p-3 rounded-lg"
                                    onClick={() =>
                                      handleDeleteProducts(product.productId)
                                    }
                                  >
                                    <Minus className="h-4 w-4" />
                                  </span>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                      <div className="gap-4 w-full lg:gap-8">
                        <Card>
                          <CardHeader>
                          <TitleComponent
                              title="Thêm sản phẩm vào bộ"
                              description="Tìm kiếm - lựa chọn sản phẩm thêm vào bộ."
                            />
                          </CardHeader>
                          <CardContent className="md:flex w-full gap-6 justify-between items-start">
                            <div className="md:w-[50%] w-full">
                              <div className="flex items-center my-4">
                                <Input
                                  placeholder="Tìm kiếm mã - tên sản phẩm ..."
                                  value={searchTerm}
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                  }}
                                  className=""
                                />
                              </div>
                              {searchResults !== null ? (
                                <Card className="my-4">
                                  <CardHeader className="font-semibold text-xl">
                                    <span>Thông tin sản phẩm</span>
                                  </CardHeader>
                                  <CardContent className="w-full grid grid-cols-3 md:grid-cols-5 gap-4 min-h-[100px]  overflow-y-auto ">
                                    {searchResults !== null ? (
                                      searchResults.map((product) => (
                                        <div key={product.id} className="group relative w-[60px] h-[60px] shadow-md">
                                          <div className="font-medium flex flex-col rounded-md">
                                            <ImageDisplayDialog
                                              images={product}
                                            />
                                          </div>
                                          <Check
                                            className={`w-5 h-5 ${productsRequest.some(
                                              (item1) => item1.productId === product.id
                                            )
                                              ? "absolute top-0 right-0 bg-primary text-white"
                                              : "hidden"
                                              }`}
                                          />
                                          <Check
                                            className={`w-5 h-5 ${getDetailsProUpdate.some(
                                              (item1) => item1.productId === product.id
                                            )
                                              ? "absolute top-0 right-0 bg-primary text-white"
                                              : "hidden"
                                              }`}
                                          />

                                          <div>
                                            <span
                                              className="cursor-pointer absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                              onClick={() =>
                                                handleAddProducts(product)
                                              }
                                            >
                                              <Plus className="text-white " />
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center flex justify-center items-center w-full">
                                        không thấy sản phẩm nào
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="md:w-[50%] w-full">
                              <Card className="mt-4">
                                <CardHeader className="font-semibold text-xl">
                                  <span>Danh sách sản phẩm lựa chọn</span>
                                </CardHeader>
                                <CardContent className="overflow-auto">
                                  {getDetailsPro.map((product, index) => (
                                    <div
                                      className="flex items-start justify-between gap-2 py-4"
                                      key={product.id}
                                    >
                                      <div className="flex flex-col gap-2">
                                        <div className="w-[60px] h-[60px] bg-primary-backgroudPrimary rounded-md shadow-md">
                                          <Image
                                            alt="ảnh mẫu"
                                            className="w-full h-full object-cover rounded-md"
                                            width={900}
                                            height={900}
                                            src={
                                              product?.image ===
                                                "Image_not_found"
                                                ? NoImage
                                                : product?.image
                                            }
                                          />
                                        </div>
                                        <div className="font-medium dark:text-white text-sm">
                                          {limitLength(product.code, 10)} - {limitLength(product.name, 15)}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        <Label htmlFor="email" className="hidden sm:block">Số lượng</Label>
                                        <Input
                                          min={0}
                                          className="w-[60px] text-center outline-none border"
                                          type="number"
                                          value={
                                            productsRequest.find(
                                              (item) =>
                                                item.productId === product.id
                                            )?.quantity || 0
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              product.id,
                                              parseInt(e.target.value)
                                            )
                                          }
                                        />
                                        <span
                                          className="hover:bg-slate-50 cursor-pointer col-span-1 border p-3 rounded-lg"
                                          onClick={() =>
                                            handleMinusProducts(product.id)
                                          }
                                        >
                                          <Minus className="h-4 w-4" />
                                        </span>
                                      </div>

                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={pending}
                        >
                          {pending ? "Đang xử lý..." : "Chỉnh sửa thông tin bộ"}
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
    </>
  );
};
