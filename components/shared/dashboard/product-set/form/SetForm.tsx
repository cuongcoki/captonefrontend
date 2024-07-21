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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useContext, useEffect, useState } from "react";
import { SetSchema } from "@/schema/set";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
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

export const SetForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
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
      if(nameImage === ""){
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
        toast.error("imageUrl (nameImage) is not valid");
      }
    } catch (error:any) {
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

  const { pending } = useFormStatus();
  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger className="rounded p-2 hover:bg-primary/90 bg-primary">
        <Plus onClick={handleOnDialog} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2 max-w-[1100px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
            <div className="bg-white flex flex-col">
              <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                <h2 className="text-2xl text-white">Tạo Bộ Sản Phẩm Mới</h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4 dark:text-white" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[700px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 lg:grid-cols-5 lg:gap-8">
                      <Card className="items-start gap-4 lg:col-span-3 lg:gap-8">
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
                                  <FormLabel className="flex items-center">
                                    Mã Sản Phẩm
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
                                  <FormLabel className="flex items-center">
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
                                  <FormLabel className="flex items-center">
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

                      <Card className="w-full h-full lg:col-span-2">
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

                      <div className="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
                        <Card>
                          <CardHeader>
                            <CardTitle className="font-semibold tracking-tight text-2xl text-primary">
                              Thêm Sản Phẩm Vào Bộ
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center my-4">
                              <Input
                                placeholder="Tìm kiếm mã - tên sản phẩm ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className=""
                              />
                            </div>
                            {searchResults !== null ? (
                              <Card className="my-4">
                                <CardHeader className="font-semibold text-xl">
                                  <span>Thông tin sản phẩm</span>
                                </CardHeader>
                                <CardContent className="overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[100px] text-center">
                                          Hình Ảnh
                                        </TableHead>
                                        <TableHead>Tên Sản Phẩm</TableHead>
                                        <TableHead>Mã Sản Phẩm</TableHead>
                                        <TableHead className="text-left">
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

                            <div className="md:col-span-1 md:mt-0">
                              <Card className="mt-4">
                                <CardHeader className="font-semibold text-xl">
                                  <span>Thông tin sản phẩm đã thêm</span>
                                </CardHeader>
                                <CardContent className="overflow-auto">
                                  {getDetailsPro.map((product, index) => (
                                    <div
                                      className="grid grid-cols-10 items-center py-4"
                                      key={product.id}
                                    >
                                      <div className="col-span-7 flex gap-4">
                                        <Image
                                          alt="ảnh mẫu"
                                          className="w-[100px] h-[100px] object-cover"
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
                                          <div>
                                            <b>Tên: </b>
                                            {limitLength(product.name, 50)}
                                          </div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            <b>Mã: </b>
                                            {limitLength(product.code, 50)}
                                          </div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                            <i>
                                              {limitLength(
                                                product.description,
                                                50
                                              )}
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <input
                                        className="col-span-2 w-16 text-center outline-none border"
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
                                  ))}
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
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
  );
};
