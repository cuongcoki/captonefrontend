import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EllipsisVertical, Trash2, Upload } from "lucide-react";
import { ProductUpdateSchema } from "@/schema/product";
import toast from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filesApi } from "@/apis/files.api";
import { Card } from "@/components/ui/card";
import { CardContent } from "../../home/DashbroadComponents/Cards/Card";
import { ProductStore } from "@/components/shared/dashboard/product/product-store";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
} from "@/components/ui/alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { formatCurrency, generateRandomString, limitLength } from "@/lib/utils";

interface ProductData {
  code: string;
  description: string;
  id: string;
  imageResponses: {
    id: string;
    imageUrl: string;
    isBluePrint: boolean;
    isMainImage: boolean;
  }[];
  isInProcessing: boolean;
  name: string;
  priceFinished: number;
  pricePhase1: number;
  pricePhase2: number;
  size: string;
  productPhaseSalaries: productPhaseSalaries[];
}

interface productPhaseSalaries {
  phaseDescription: string;
  phaseId: string;
  phaseName: string;
  salaryPerProduct: number;
}

interface ProductID {
  productId?: ProductData;
  children?: any;
}

export const ProductUpdateForm: React.FC<ProductID> = ({
  productId,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const { ForceRender } = ProductStore();
  const [updatedProduct, setUpdatedProduct] = useState<ProductData | undefined>(
    undefined
  );
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const [imageRequests, setImageRequests] = useState<any[]>([]);
  const [imageRequestsUpdate, setImageRequestsUpdate] = useState<any[]>([]);
  // console.log("imageRequests",imageRequests)
  // console.log("imageRequestsUpdate",imageRequestsUpdate)
  // console.log("updatedProduct",updatedProduct)
  // console.log("productId",productId)
  useEffect(() => {
    const fetchUpdatedProduct = async () => {
      if (productId) {
        setImageRequestsUpdate(productId.imageResponses);
        try {
          setUpdatedProduct(productId);
          setImageRequests(productId.imageResponses);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUpdatedProduct();
  }, [productId]);

  const initialImageRequests =
    updatedProduct?.imageResponses.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      isBluePrint: image.isBluePrint,
      isMainImage: image.isMainImage,
    })) || [];

  // console.log("productId", productId)
  const phase1 = productId?.productPhaseSalaries.find(
    (p) => p.phaseId === "42ccc305-85c7-4a4a-92c0-bc41669afe25"
  );
  const phase2 = productId?.productPhaseSalaries.find(
    (p) => p.phaseId === "4d2113f9-2009-4c37-82b1-195ecbb9c706"
  );
  const phase3 = productId?.productPhaseSalaries.find(
    (p) => p.phaseId === "0f54b781-8286-42d2-9dce-b19b22b43700"
  );
  const form = useForm({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: {
      id: productId?.id || "",
      code: productId?.code || "",
      priceFinished: phase3?.salaryPerProduct.toString() || "",
      pricePhase2: phase2?.salaryPerProduct.toString() || "",
      pricePhase1: phase1?.salaryPerProduct.toString() || "",
      size: productId?.size || "",
      description: productId?.description || "",
      name: productId?.name || "",
      isInProcessing: productId?.isInProcessing || false,
      addImagesRequest: initialImageRequests,
    },
  });

  const [imageUrls, setImageUrls] = useState<any>([]);
  const [nameImage, setNameImage] = useState<string[]>([]);

  const [imageAddRequests, setImageAddRequests] = useState<any[]>([]);
  // console.log("imageAddRequests",imageAddRequests)
  // Handle uploading new photos
  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxTotalSize = 2000000; // 2000 KB

    let currentTotalSize = files.reduce((total, file) => total + file.size, 0);

    const newImageRequests = files
      .filter((file) => {
        if (!validImageTypes.includes(file.type)) {
          toast.error(
            `File ${limitLength(
              file.name,
              15
            )} không đúng kiểu: .png, .jpg, .jpeg.`
          );
          return false;
        }
        if (file.size > 1000000) {
          // 1000 KB
          toast.error(
            `File ${limitLength(file.name, 15)} Dung lượng không được quá 1M.`
          );
          return false;
        }
        if (currentTotalSize + file.size > maxTotalSize) {
          toast.error(`Vượt quá tổng kích thước giới hạn là 1200 KB.`);
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

    setImageRequests((prevImageRequests) => [
      ...prevImageRequests,
      ...newImageRequests,
    ]);
    setImageAddRequests((prevImageRequests: any) => [
      ...prevImageRequests,
      ...newImageRequests,
    ]);
    setImageUrls((prevImageRequests: any) => [
      ...prevImageRequests,
      ...newImageRequests.map((item) => item.file),
    ]);
    setNameImage((prevNameImage: any) => [
      ...prevNameImage,
      ...newImageRequests.map((item) => item.changedFileName),
    ]);
  };
  const [removeImageIds, setRemoveImageIds] = useState<string[] | null>(null);

  // Handle deleting an image
  const handleDeleteImage = (index: number, imageID: string) => {
    if (imageID !== undefined) {
      setRemoveImageIds((prevRemoveImageIds) => {
        // Kiểm tra xem imageID đã tồn tại trong mảng chưa
        const newRemoveImageIds = prevRemoveImageIds
          ? prevRemoveImageIds.includes(imageID)
            ? prevRemoveImageIds
            : [...prevRemoveImageIds, imageID]
          : [imageID];
        return newRemoveImageIds.length > 0 ? newRemoveImageIds : null;
      });
      setImageAddRequests((prevImageRequests) => {
        return prevImageRequests.filter((id) => id.id !== imageID);
      });
    }

    setImageRequests((prevImageRequests) => {
      return prevImageRequests.filter((_, i) => i !== index);
    });
    setImageUrls((prevImageUrls: any) =>
      prevImageUrls.filter((_: any, i: any) => i !== index)
    );
  };

  const handleDeleteImageUpdate = (id: string) => {
    if (id !== undefined) {
      setRemoveImageIds((prevRemoveImageIds) => {
        const newRemoveImageIds = prevRemoveImageIds
          ? [...prevRemoveImageIds, id]
          : [id];
        return newRemoveImageIds.length > 0 ? newRemoveImageIds : null;
      });
    }
  };

  // Handle toggling blue image flag for an image
  const handleToggleBluePrint = (imageUrl: string, id: string, index: any) => {
    setImageRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl === imageUrl
          ? { ...req, isBluePrint: !req.isBluePrint }
          : req
      )
    );
    setImageAddRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl === imageUrl
          ? { ...req, isBluePrint: !req.isBluePrint }
          : req
      )
    );

    setImageRequestsUpdate((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.id === id ? { ...req, isBluePrint: !req.isBluePrint } : req
      )
    );

    const updatedImage = imageRequestsUpdate.find((item) => item.id === id);
    if (updatedImage) {
      handleDeleteImageUpdate(id);
      setImageAddRequests((prevSaveUpdateImage) => {
        const existingIndex = prevSaveUpdateImage.findIndex(
          (item) => item.id === id
        );
        const getFileNameFromUrl = (url: string) => {
          return url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        };
        if (existingIndex !== -1) {
          const updatedSaveUpdateImage = [...prevSaveUpdateImage];
          updatedSaveUpdateImage[existingIndex] = {
            ...updatedSaveUpdateImage[existingIndex],
            isBluePrint: !updatedSaveUpdateImage[existingIndex].isBluePrint,
          };
          return updatedSaveUpdateImage;
        } else {
          return [
            ...prevSaveUpdateImage,
            {
              id: updatedImage.id,
              imageUrl: getFileNameFromUrl(updatedImage.imageUrl),
              isBluePrint: !updatedImage.isBluePrint,
              isMainImage: updatedImage.isMainImage,
            },
          ];
        }
      });
    }
  };

  // Handle toggling main image flag for an image
  const handleToggleMainImage = (imageUrl: string, id: string, index: any) => {
    setImageRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl === imageUrl
          ? { ...req, isMainImage: !req.isMainImage }
          : req
      )
    );
    setImageAddRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl === imageUrl
          ? { ...req, isMainImage: !req.isMainImage }
          : req
      )
    );

    setImageRequestsUpdate((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.id === id ? { ...req, isMainImage: !req.isMainImage } : req
      )
    );

    const updatedImage = imageRequestsUpdate.find((item) => item.id === id);
    if (updatedImage) {
      handleDeleteImageUpdate(id);
      setImageAddRequests((prevSaveUpdateImage) => {
        const existingIndex = prevSaveUpdateImage.findIndex(
          (item) => item.id === id
        );
        const getFileNameFromUrl = (url: string) => {
          return url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
        };
        if (existingIndex !== -1) {
          // Update existing entry
          const updatedSaveUpdateImage = [...prevSaveUpdateImage];
          updatedSaveUpdateImage[existingIndex] = {
            ...updatedSaveUpdateImage[existingIndex],
            isMainImage: !updatedSaveUpdateImage[existingIndex].isMainImage,
          };
          return updatedSaveUpdateImage;
        } else {
          // Add new entry
          return [
            ...prevSaveUpdateImage,
            {
              id: updatedImage.id,
              imageUrl: getFileNameFromUrl(updatedImage.imageUrl),
              isBluePrint: updatedImage.isBluePrint,
              isMainImage: !updatedImage.isMainImage,
            },
          ];
        }
      });
    }
  };
  // console.log("removeImageIds",removeImageIds)
  const handlePostImage = async () => {
    setLoading(true);
    const formData = new FormData();
    imageUrls.forEach((imageUrl: any) => {
      formData.append("receivedFiles", imageUrl);
    });
    try {
      const response = await filesApi.postFiles(formData);
      // console.log("Upload successful:", response.data);
    } catch (error) {
      // console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(imageAddRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle form submission
  const onSubmit = async (formData: z.infer<typeof ProductUpdateSchema>) => {
    if (isSubmitting) return;
    var ImaNull = null;
    setLoading(true);
    setIsSubmitting(true);
    // console.log(imageAddRequests);
    try {
      await handlePostImage();

      const requestBody = {
        id: formData.id,
        code: formData.code.trim(),
        priceFinished: Number(formData.priceFinished.replace(/\./g, "")),
        pricePhase1: Number(formData.pricePhase1.replace(/\./g, "")),
        pricePhase2: Number(formData.pricePhase2.replace(/\./g, "")),
        size: formData.size.trim(),
        description: formData.description.trim(),
        name: formData.name.trim(),
        isInProcessing: formData.isInProcessing,
        addImagesRequest: imageAddRequests.map((image, index) => ({
          imageUrl: image.changedFileName
            ? image.changedFileName
            : image.imageUrl,
          isBluePrint: image.isBluePrint,
          isMainImage: image.isMainImage,
        })),
        removeImageIds: removeImageIds ? removeImageIds : ImaNull,
      };
      // console.log("requestBody", requestBody)

      try {
        const response = await productApi.updateProduct(
          requestBody,
          formData.id
        );
        setFetchTrigger((prev) => prev + 1);
        setImageAddRequests([]);
        ForceRender();
        setOpen(false);
        toast.success(response.data.message);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Xử lý lỗi từ server
          if (error.response.data.error) {
            for (const key in error.response.data.error) {
              toast.error(error.response.data.error[key][0]);
            }
          } else {
            toast.error(error.response.data.message);
          }
        } else if (error.response.data.message) {
          // Xử lý lỗi khi không có phản hồi từ server
          toast.error(
            "Không có phản hồi từ máy chủ trong khi cập nhật. Vui lòng thử lại sau."
          );
        } else {
          // Xử lý các lỗi khác
          toast.error(
            `Lỗi không mong muốn trong quá trình cập nhật: ${error.message}`
          );
        }
        throw error; // Re-throw the error to stop further execution
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {}, [removeImageIds]);

  const parseCurrency = (value: any) => {
    return value.replace(/,/g, "");
  };

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };

  const handleClearForm = () => {
    setOpen(false);
    setOpenAlert(false);
    setImageAddRequests([]);
    setFetchTrigger((prev) => prev + 1);
  };

  const { formState } = form;
  const handleOffDialog = () => {
    const isDetailsOmage =
      Array.isArray(imageAddRequests) && imageAddRequests.length === 0;

    if (!formState.isDirty && isDetailsOmage) {
      setOpen(false);
      setFetchTrigger((prev) => prev + 1);
    } else {
      setOpenAlert(true);
    }
  };
  return (
    <>
      {openAlert && (
        <AlertDialog open={openAlert}>
          <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn tắt biểu mẫu này không ??
              </AlertDialogTitle>
              <AlertDialogDescription>
                Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
                những dữ liệu mà bạn đã nhập
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleOffDialogA}>
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2  max-w-[900px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-slate-100  flex flex-col ">
                <div className="p-4 flex items-center justify-between bg-primary  rounded-t-md">
                  <h2 className="text-2xl text-white">
                    Chỉnh Sửa Thông Tin Sản Phẩm
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOffDialog}
                  >
                    <X className="w-4 h-4 dark:text-white" />
                  </Button>
                </div>
                <div className="grid gap-4 p-4 overflow-y-auto h-[650px] dark:bg-card">
                  <Form {...form}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-5 rounded-xl">
                      <div className="grid md:col-span-3 auto-rows-max items-start gap-4 lg:gap-8">
                        <Card className="rounded-xl">
                          <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <div className="w-full flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-4">
                                  {/* Code */}
                                  <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center text-primary">
                                          Mã sản phẩm *
                                        </FormLabel>
                                        <Input type="text" {...field} />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* Name */}
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center text-primary">
                                          Tên sản phẩm *
                                        </FormLabel>
                                        <Input type="text" {...field} />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* Size */}
                                  <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center text-primary">
                                          Kích thước *
                                        </FormLabel>
                                        <Input type="text" {...field} />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="md:flex flex-row gap-4">
                                    {/* Price */}
                                    <FormField
                                      control={form.control}
                                      name="pricePhase1"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="flex items-center text-primary">
                                            Giá giai đoạn 1 *
                                          </FormLabel>
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
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    {/* Price */}
                                    <FormField
                                      control={form.control}
                                      name="pricePhase2"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="flex items-center text-primary">
                                            Giá giai đoạn 2 *
                                          </FormLabel>
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
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    {/* Price */}
                                    <FormField
                                      control={form.control}
                                      name="priceFinished"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="flex items-center text-primary">
                                            Giá hoàn thiện *
                                          </FormLabel>
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
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  {/* Description */}
                                  <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="flex items-center text-primary">
                                          Miêu tả
                                        </FormLabel>
                                        <Textarea {...field} />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* IsProse */}
                                  <FormField
                                    control={form.control}
                                    name="isInProcessing"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-primary">
                                          Trạng Thái *
                                        </FormLabel>
                                        <Select
                                          onValueChange={(value) =>
                                            field.onChange(value === "true")
                                          }
                                          value={
                                            field.value !== undefined
                                              ? String(field.value)
                                              : undefined
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Trạng thái" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="true">
                                              Đang sản xuất
                                            </SelectItem>
                                            <SelectItem value="false">
                                              Ngừng sản xuất
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                {/* Submit button */}
                                <Button
                                  type="submit"
                                  className="w-full bg-primary hover:bg-primary/90"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "Đang xử lý..."
                                    : "Chỉnh Sửa Thông Tin"}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid md:col-span-2 auto-rows-max items-start gap-4 lg:gap-8">
                        <Card className=" relative border-none shadow-none">
                          {/* nếu không có ảnh nào thì hiện input này */}
                          {imageRequests.length < 1 && (
                            <CardContent className="h-[60vh]">
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
                            </CardContent>
                          )}

                          {/* nếu có trên 1 ảnh thì hiện input này */}
                          {imageRequests.length > 0 && (
                            <CardContent className="relative w-full h-full">
                              {/* phần hiển thị ảnh xem trước */}
                              <Carousel className="w-full max-w-xs flex justify-center pb-5">
                                <CarouselContent>
                                  {imageRequests.map((image, index) => (
                                    <CarouselItem key={index}>
                                      <div className="p-1">
                                        <Card className="border-none">
                                          <CardContent className="flex aspect-square items-center justify-center p-6 relative bg-black">
                                            <Image
                                              src={image.imageUrl}
                                              alt={`image-${index}`}
                                              width={500}
                                              height={500}
                                              className="h-full w-full object-contain bg-cover bg-center  bg-no-repeat  pointer-events-none"
                                            />
                                            <button
                                              type="button"
                                              className="absolute right-0 top-0 "
                                              onClick={() =>
                                                handleDeleteImage(
                                                  index,
                                                  image.id
                                                )
                                              }
                                            >
                                              <Trash2
                                                size={35}
                                                className="flex items-center justify-center text-primary bg-white rounded-md p-2 m-5"
                                              />
                                            </button>

                                            <HoverCard>
                                              <HoverCardTrigger className="absolute left-0 top-0 ">
                                                <EllipsisVertical
                                                  size={35}
                                                  className="flex items-center justify-center text-primary bg-white rounded-md p-2 m-5"
                                                />
                                              </HoverCardTrigger>
                                              <HoverCardContent
                                                align="start"
                                                className="w-full"
                                              >
                                                <div className="grid gap-4">
                                                  <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">
                                                      Loại ảnh
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                      Đặt loại ảnh : Bản thiết
                                                      kế hoặc ảnh chính
                                                    </p>
                                                  </div>
                                                  <div className="grid gap-2">
                                                    <div className="flex justify-between items-center">
                                                      <Label
                                                        htmlFor={`isBluePrint-${index}`}
                                                      >
                                                        [Ảnh] Bản thiết kế
                                                      </Label>
                                                      <Switch
                                                        className="data-[state=checked]:bg-primary"
                                                        id={`isBluePrint-${index}`}
                                                        checked={
                                                          image.isBluePrint
                                                        }
                                                        onCheckedChange={() =>
                                                          handleToggleBluePrint(
                                                            image.imageUrl,
                                                            image?.id,
                                                            index
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                      <Label
                                                        htmlFor={`isMainImage-${index}`}
                                                      >
                                                        [Ảnh] Chính
                                                      </Label>
                                                      <Switch
                                                        className="data-[state=checked]:bg-primary"
                                                        id={`isMainImage-${index}`}
                                                        checked={
                                                          image.isMainImage
                                                        }
                                                        onCheckedChange={() =>
                                                          handleToggleMainImage(
                                                            image.imageUrl,
                                                            image?.id,
                                                            index
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </HoverCardContent>
                                            </HoverCard>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <div className="  absolute left-[50%] bottom-0 transform: translate-x-[50%] transform: translate-y-[50%]">
                                  <CarouselNext className="text-primary " />
                                  <CarouselPrevious className="text-primary" />
                                </div>
                              </Carousel>

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
                                className="absolute -bottom-4"
                              >
                                <Upload
                                  size={35}
                                  className="flex items-center justify-center text-primary bg-white rounded-md p-2 m-5 border-gray-200 border"
                                />
                              </label>
                            </CardContent>
                          )}
                        </Card>
                      </div>
                    </div>
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
