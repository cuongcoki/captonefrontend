"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  CardHeader,
  CardTitle,
  CardFooter,
  Card,
  CardContent,
} from "@/components/ui/card";
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useContext, useEffect, useState } from "react";
import { SetSchema } from "@/schema/set";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Minus,
  PackagePlus,
  Phone,
  Plus,
  Upload,
  X,
  icons,
} from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast, { Toaster } from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import { error } from "console";
import ImageDisplayDialog from "./imageDisplayDialog";
import Image from "next/image";
import { Facebook, Youtube } from "lucide-react";
import { filesApi } from "@/apis/files.api";
import { setApi } from "@/apis/set.api";

import * as Dialog from "@radix-ui/react-dialog";
import { NoImage } from "@/constants/images";
import { MyContext } from "../table/sets/RenderTable";
import { Label } from "@/components/ui/label";
let initialFormValuesSetProduct: any = null;
export const SetForm = () => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };
  const handleOnDialogA = () => {
    setOpenAlert(true);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };


  const { forceUpdate } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [imageRequests, setImageRequests] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<File | null>(null);
  const [nameImage, setNameImage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(SetSchema),
    defaultValues: {
      code: "",
      description: "",
      name: "",
    },
  });
  // ** các hàm để sử lý đăng ảnh

  const generateRandomString = (length: number = 5) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  // ** Xử lý khi người dùng tải lên hình ảnh mới
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const newImageRequest = URL.createObjectURL(file);
      setImageRequests(newImageRequest);
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
      setImageUrls(newFile);
      setNameImage(changedFileName);
      // console.log("imageUrls", imageUrls);
    }
  };

  // ** Xử lý khi người dùng xóa một hình ảnh đã có
  const handleDeleteImage = () => {
    setImageRequests(null);
    setImageUrls(null);
  };
  // ** Xử lý khi đăng ảnh
  const handlePostImage = async () => {
    if (!imageUrls) {
      console.error("No image selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", imageUrls); // Đảm bảo rằng tên trường tương ứng với server và chỉ đăng một ảnh

    try {
      const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
      // console.log('Upload successful:', response.data);
      // Xử lý các hành động sau khi tải lên thành công
      const fileName = imageUrls.name; // Lấy tên tệp của ảnh đầu tiên
      const { data } = await filesApi.getFile(fileName);

      // Assuming data.data contains the image name
      // const names = data.data;
      // setNameImage(fileName);
    } catch (error) {
      console.error("Error uploading files:", error);
      // Xử lý lỗi khi tải lên không thành công
    } finally {
      setLoading(false);
    }
  };

  // ** Xử lý khi đăng ảnh xong và lấy ảnh về
  const handleGetImage = async () => {
    if (!imageUrls) {
      console.error("No image selected");
      return;
    }

    setLoading(true);
    try {
      const fileName = imageUrls.name; // Lấy tên tệp của ảnh đầu tiên
      const { data } = await filesApi.getFile(fileName);

      // Assuming data.data contains the image name
      const names = data.data;
      setNameImage(names);
      console.log("Processed image names:", names);
    } catch (error) {
      console.error("Error getting image names:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log('imageRequests', imageRequests)
  // console.log('imageUrls', imageUrls)

  // ** các hàm để tìm kiếm sản phẩm thêm mã Code và Tên sản phẩm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // console.log('searchTerm', searchTerm)
  // console.log("searchResults", searchResults);

  useEffect(() => {
    const handleSearch = () => {
      setLoading(true);
      productApi
        .searchProduct(searchTerm)
        .then(({ data }) => {
          setSearchResults(data.data);
        })
        .catch((error) => {
          toast.error("không tìm thấy");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    handleSearch();
  }, [searchTerm]);

  // ========================================================= các hàm để thêm sản phẩm và số lượng vào bộ sản phẩm =========================================================

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

  // ** hàm thêm vào danh sách sản phẩm
  const handleAddProducts = (product: any) => {
    console.warn("product", product.id);
    setSearchTerm("");

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

  };

  // ** hàm thay đổi số lượng khỏi danh sách sản phẩm
  const handleChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return;
    }
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

  // ========================================================= Xử lý khi người dùng gửi form =========================================================

  const onSubmit = async (data: z.infer<typeof SetSchema>) => {
    setLoading(true);
    // console.log('Submitted data:', data);

    try {
      await handlePostImage();
      if (nameImage === "") {
        toast.error("Hãy chọn 1 ảnh cho bộ sản phẩm")
      }
      if (nameImage) {
        // Thực hiện các hành động khi nameImage có giá trị
        const requestBody = {
          code: data.code,
          description: data.description,
          name: data.name,
          imageUrl: nameImage,
          setProductsRequest: productsRequest,
        };
        console.log("requestBody", requestBody);
        const response = await setApi.createSet(requestBody);
        if (response.data.isSuccess) {
          toast.success(response.data.message);
          setTimeout(() => {
            forceUpdate();
            setOpen(false);
            form.reset();
            setProductsRequest([])
            setGetDetailsPro([]);
            setUpdateProducts([])
          }, 2000);
        } else {
          toast.error(response.data.message);
        }
        // Xử lý response
      } else {
        // Xử lý khi nameImage không có giá trị
        toast.error("Vui lòng chọn ảnh bộ");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        const errors = error.response.data.error;

        if (errors.Description) {
          toast.error(errors.Description);
        }

      } else {
        console.error("Error submitting form:", error);
      }
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };
  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  // console.log("productsRequest", productsRequest);
  // console.log("getDetailsProgetDetailsPro=========", getDetailsPro);

  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    form.reset();
    setProductsRequest([]);
    setGetDetailsPro([]);
    setImageRequests(null)
  }

  const handleOffDialog = () => {
    const currentFormValues = productsRequest;
    // console.log("currentFormValues", initialFormValuesSetProduct)
    // console.log("setProductsRequest", productsRequest)
    if (initialFormValuesSetProduct === null) {
      initialFormValuesSetProduct = currentFormValues;
    }
    const isFormChanged = JSON.stringify(initialFormValuesSetProduct) === JSON.stringify(productsRequest);
    // console.log("isFormChanged", isFormChanged)

    // console.log("form", form.getValues())
    const isCodeIdEmpty = form.getValues().code === "";
    const isDescriptionEmpty = form.getValues().description === "";
    const isNameEmpty = form.getValues().name === "";

    if (isFormChanged && isCodeIdEmpty && isDescriptionEmpty && isNameEmpty) {
      setOpen(false);
    } else {
      setOpenAlert(true);
    }
  };

  const { pending } = useFormStatus();
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
        <Dialog.Trigger className="rounded p-2 hover:bg-primary/90 bg-primary">
          <Plus onClick={handleOnDialog} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2 max-w-[1000px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-white flex flex-col">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Tạo Bộ Sản Phẩm Mới</h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4 dark:text-white" />
                  </Button>
                </div>
                <div className="grid gap-4 p-4 overflow-y-auto h-[700px]">
                  <div className="gap-4 w-full lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-semibold tracking-tight text-2xl text-primary">
                          Thêm Sản Phẩm Vào Bộ
                        </CardTitle>
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
                              <CardContent className="w-full grid grid-cols-5 gap-4 min-h-[100px]  overflow-y-auto ">
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
                                      <div>
                                        <Button
                                          variant={"ghost"}
                                          size={"icon"}
                                          className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 hover:bg-primary h-6 w-6"
                                          onClick={() =>
                                            handleAddProducts(product)
                                          }
                                        >
                                          <Plus className="text-white " />
                                        </Button>
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
                              <span>Thông tin sản phẩm đã thêm</span>
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
                                          product?.imageUrl ===
                                            "Image_not_found"
                                            ? NoImage
                                            : product?.imageUrl
                                        }
                                      />
                                    </div>
                                    <div className="font-medium dark:text-white text-sm">
                                      {limitLength(product.name, 15)} - {limitLength(product.code, 10)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <Label htmlFor="email" >Số lượng</Label>
                                    <Input
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
                                    <Button
                                      className="col-span-1"
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleMinusProducts(product.id)
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex flex-wrap gap-2 lg:gap-5">
                        <Card className="flex-1 items-start gap-4 lg:gap-8">
                          <CardHeader>
                            <CardTitle className="font-semibold tracking-tight text-2xl text-primary">
                              Thông Tin
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* Phần nhập dữ liệu thông tin */}
                            <div className="w-full flex flex-col gap-4 ">
                              {/* code */}
                              <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-primary">
                                      Mã Bộ Sản Phẩm
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* name */}
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-primary">
                                      Tên Bộ Sản Phẩm
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {/* description */}
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-primary">
                                      Mô Tả
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="w-full h-[350px] lg:w-2/5">
                          <CardContent className=" w-full h-full relative pt-6">
                            {/* nếu không có ảnh nào thì hiện input này */}
                            {imageRequests === null && (
                              <div style={{ width: "100%", height: "100%" }}>
                                <input
                                  id="image"
                                  type="file"
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  onChange={(e) => handleUploadPhoto(e)}
                                />
                                <label
                                  htmlFor="image"
                                  className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                >
                                  <Upload
                                    size={70}
                                    className="text-white flex items-center justify-center bg-primary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto"
                                  />
                                  <span className="text-l text-gray-500 font-medium">
                                    Hãy tải ảnh lên
                                  </span>
                                </label>
                              </div>
                            )}

                            {/* nếu có trên 1 ảnh thì hiện input này */}
                            {imageRequests !== null && (
                              <div className="relative w-full h-full">
                                {/* phần hiển thị ảnh xem trước */}
                                <ImageDisplay
                                  images={imageRequests}
                                  onDelete={handleDeleteImage}
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>

                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 my-3"
                        disabled={pending}
                      >
                        {loading ? "Loading..." : "GỬI"}
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
};
