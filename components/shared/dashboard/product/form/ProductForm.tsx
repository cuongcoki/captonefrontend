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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { ProductSchema } from "@/schema";

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

import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X } from "lucide-react";
import ImageDisplay from "./ImageDisplay";

import toast from "react-hot-toast";

import { productApi } from "@/apis/product.api";
import { filesApi } from "@/apis/files.api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import * as Dialog from "@radix-ui/react-dialog";
import { ProductStore } from "@/components/shared/dashboard/product/product-store";

const initialImageRequests = [
  {
    imageUrl: "", // Chỉ cần khởi tạo các trường cần thiết, nếu không có giá trị thực tế
    isBluePrint: false,
    isMainImage: false,
  },
];
export const ProductForm = () => {
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

  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<any>([]);
  const [nameImage, setNameImage] = useState<string[]>([]);
  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      code: "",
      priceFinished: "",
      pricePhase1: "",
      pricePhase2: "",
      size: "",
      description: "",
      name: "",
      imageRequests: initialImageRequests,
    },
  });
  const { ForceRender } = ProductStore();

  const [imageRequests, setImageRequests] = useState<
    {
      id: string;
      imageUrl: string;
      isBluePrint: boolean;
      isMainImage: boolean;
    }[]
  >([]);


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

  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxTotalSize = 2000000; // 2000 KB

    let currentTotalSize = imageRequests.reduce(
      (total, req: any) => total + req.file.size,
      0
    );
    const limitLength = (text: any, maxLength: any) => {
      if (text.length > maxLength) {
        return `${text.slice(0, maxLength)}...`;
      }
      return text;
    };

    const newImageRequests = files
      .filter((file) => {
        if (!validImageTypes.includes(file.type)) {
          toast.error(`File ${limitLength(file.name, 15)} không đúng kiểu: .png, .jpg, .jpeg.`);
          return false;
        }
        if (file.size > 1000000) {
          // 1000 KB
          toast.error(`File ${limitLength(file.name, 15)} Dung lượng không được quá 1M.`);
          return false;
        }
        if (currentTotalSize + file.size > maxTotalSize) {
          toast.error(
            `Vượt quá tổng kích thước giới hạn là 1200 KB.`
          );
          return false;
        }
        currentTotalSize += file.size;
        return true;
      })
      .map((file) => {
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

        return {
          file: newFile,
          imageUrl: URL.createObjectURL(newFile),
          isBluePrint: false,
          isMainImage: false,
          changedFileName: changedFileName,
        };
      });

    setImageRequests((prevImageRequests: any) => [
      ...prevImageRequests,
      ...newImageRequests,
    ]);
    setImageUrls((prevImageUrls: any) => [
      ...prevImageUrls,
      ...newImageRequests.map((item) => item.file),
    ]);
    setNameImage((prevNameImage: any) => [
      ...prevNameImage,
      ...newImageRequests.map((item) => item.changedFileName),
    ]);
  };

  // ** hàm xóa ảnh theo index
  const handleDeleteImage = (index: number) => {
    setImageRequests((prevImageRequests) =>
      prevImageRequests.filter((_, i) => i !== index)
    );
    setImageUrls((prevImageUrls: any) =>
      prevImageUrls.filter((_: any, i: any) => i !== index)
    );
    setNameImage((prevNameImage: any) =>
      prevNameImage.filter((_: any, i: any) => i !== index)
    );
  };

  // ** hàm set true false cho Blueprint
  const handleToggleBlueprint = (index: number) => {
    setImageRequests((prevImageRequests) =>
      prevImageRequests.map((req, i) =>
        i === index ? { ...req, isBluePrint: !req.isBluePrint } : req
      )
    );
  };

  // ** hàm set true false cho MainImage
  const handleToggleMainImage = (index: number) => {
    setImageRequests((prevImageRequests) =>
      prevImageRequests.map((req, i) =>
        i === index ? { ...req, isMainImage: !req.isMainImage } : req
      )
    );
  };

  const handlePostImage = async () => {
    setLoading(true);
    const formData = new FormData();
    imageUrls.forEach((imageUrl: any) => {
      formData.append("receivedFiles", imageUrl);
    });
    try {
      const response = await filesApi.postFiles(formData);
      console.log("Upload successful:", response.data);

    } catch (error) {
      console.error("Error uploading files:", error);

    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
    setLoading(true);
    try {
      await handlePostImage();

      if (imageRequests && nameImage) {
        const requestBody = {
          code: data.code.trim(),
          priceFinished: Number(data.priceFinished.replace(/\./g, "")),
          pricePhase1: Number(data.pricePhase1.replace(/\./g, "")),
          pricePhase2: Number(data.pricePhase2.replace(/\./g, "")),
          size: data.size.trim(),
          description: data.description.trim(),
          name: data.name.trim(),
          imageRequests: imageRequests.map((image, index) => ({
            imageUrl: nameImage[index],
            isBluePrint: image.isBluePrint,
            isMainImage: image.isMainImage,
          })),
        };

        console.log("=====requestBody Product Form =====", requestBody);

        const response = await productApi.createProduct(requestBody);
        if (response.data.isSuccess) {
          toast.success(response.data.message);
          setTimeout(() => {
            setOpen(false);
            ForceRender();
          }, 2000);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("imageUrl (nameImage) không hợp lệ");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        const errors = error.response.data.error;

        if (errors.ImageRequests) {
          toast.error(errors.ImageRequests);
        }

        if (errors.PriceFinished) {
          toast.error(errors.PriceFinished);
        }

        if (errors.Code) {
          toast.error(errors.Code);
        }

        if (errors['UpdateProductRequest.PriceFinished']) {
          toast.error(errors['UpdateProductRequest.PriceFinished']);
        }
        console.log(error.UpdateProductRequest.PriceFinished)
      } else {
        console.error("Lỗi khi gửi biểu mẫu:", error);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const parseCurrency = (value: any) => {
    return value.replace(/,/g, "");
  };

  const { pending } = useFormStatus();

  const handleClearForm = () => {
    setOpen(false)
    setOpenAlert(false)
    form.reset();
    setImageRequests([])
  }
  const handleOffDialog = () => {
    // Kiểm tra xem mảng có rỗng hay không
    const isArrayEmpty = (arr: any) => {
      return Array.isArray(arr) && arr.length === 0;
    };

    // Sử dụng hàm này để kiểm tra mảng imageRequests
    const isDetailsProEmpty = isArrayEmpty(imageRequests);

    console.log(isDetailsProEmpty);
    console.log("form", form.getValues())
    console.log("imageRequests", imageRequests)
    // Kiểm tra giá trị cụ thể của form
    const isCodeIdEmpty = form.getValues().code === "";
    const isDescriptionEmpty = form.getValues().description === "";
    const isNameEmpty = form.getValues().name === "";
    const isPriceFinishedEmpty = form.getValues().priceFinished === "";
    const isPricePhase1Empty = form.getValues().pricePhase1 === "";
    const isPricePhase2Empty = form.getValues().pricePhase2 === "";
    const isSizeEmpty = form.getValues().size === "";

    // Nếu tất cả các trường trong form đều trống hoặc không có giá trị và các mảng rỗng
    if (isDetailsProEmpty && isCodeIdEmpty && isDescriptionEmpty && isNameEmpty && isPriceFinishedEmpty && isPricePhase1Empty && isPricePhase2Empty && isSizeEmpty) {
      setOpen(false);
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
        <Dialog.Trigger className="rounded p-2 hover:bg-primary/90 bg-primary">
          <Plus onClick={handleOnDialog} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className="overflow-auto w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-slate-100  flex flex-col ">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Thêm Sản Phẩm</h2>
                  <Button variant="outline" size="icon" onClick={handleOffDialog}>
                    <X className="w-4 h-4 dark:text-white" />
                  </Button>
                </div>
                <div className="grid gap-4 p-4 overflow-y-auto h-[650px] dark:bg-card">
                  <Form {...form}>
                    {/* Phần đăng hình ảnh */}

                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-primary">
                          Thông tin sản phẩm
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6 ">
                        <Card className=" relative border-none shadow-none">
                          <div className="h-[300px] md:h-full">
                            {/* nếu không có ảnh nào thì hiện input này */}
                            {imageRequests.length < 1 && (
                              <div style={{ width: "100%", height: "100%" }}>
                                <input
                                  id="image"
                                  type="file"
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  onChange={(e) => handleUploadPhotos(e)}
                                  multiple
                                />
                                <label
                                  htmlFor="image"
                                  className="max-w-full max-h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                >
                                  <Upload
                                    size={100}
                                    className="text-white flex items-center justify-center bg-primary rounded-md p-5 max-w-[100%] max-h-[100%] cursor-pointer my-0 mx-auto"
                                  />
                                  <span className="text-l text-gray-500 font-medium">
                                    Hãy tải ảnh sản phẩm lên
                                  </span>
                                </label>
                              </div>
                            )}

                            {/* nếu có trên 1 ảnh thì hiện input này */}
                            {imageRequests.length > 0 && (
                              <div className="relative w-full h-full">
                                {/* phần hiển thị ảnh xem trước */}
                                <ImageDisplay
                                  images={imageRequests}
                                  onDelete={handleDeleteImage}
                                  onToggleBlueprint={handleToggleBlueprint}
                                  onToggleMainImage={handleToggleMainImage}
                                />

                                {/* Phần add thêm image */}
                                <input
                                  id="image"
                                  type="file"
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  onChange={(e) => handleUploadPhotos(e)}
                                  multiple
                                />
                                <label
                                  htmlFor="image"
                                  className="absolute bottom-0"
                                >
                                  <Upload
                                    size={35}
                                    className="flex items-center justify-center text-primary bg-white rounded-md p-2 m-5"
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </Card>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                          {/* Phần nhập dữ liệu thông tin */}
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4">
                              {/* code */}
                              <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-primary">
                                      Mã Sản Phẩm *
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
                                      Tên Sản Phẩm *
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {/* size */}
                              <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-primary">
                                      Kích Thước *
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="md:flex flex-row gap-4">
                                {/* price */}
                                <FormField
                                  control={form.control}
                                  name="pricePhase1"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Giá giai đoạn 1 *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          inputMode="numeric"
                                          {...field}
                                          value={formatCurrency(field.value)}
                                          onChange={(e) =>
                                            field.onChange(
                                              parseCurrency(e.target.value)
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {/* price */}
                                <FormField
                                  control={form.control}
                                  name="pricePhase2"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Giá giai đoạn 2 *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          inputMode="numeric"
                                          {...field}
                                          value={formatCurrency(field.value)}
                                          onChange={(e) => {
                                            const rawValue = e.target.value.replace(
                                              /[^\d.]/g,
                                              ""
                                            ); // Loại bỏ các ký tự không phải số hoặc dấu chấm
                                            field.onChange(rawValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {/* priceFinished */}
                                <FormField
                                  control={form.control}
                                  name="priceFinished"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Giá hoàn thiện *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          inputMode="numeric"
                                          {...field}
                                          value={formatCurrency(field.value)}
                                          onChange={(e) => {
                                            const rawValue = e.target.value.replace(
                                              /[^\d.]/g,
                                              ""
                                            ); // Loại bỏ các ký tự không phải số hoặc dấu chấm
                                            field.onChange(rawValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
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
                                      <Textarea
                                        {...field}
                                        className="h-[120px]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* <Separator className="h-1" /> */}
                            <Button
                              type="submit"
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={pending}
                            >
                              {loading ? "Loading..." : "GỬI"}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
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
