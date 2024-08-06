import React, { useContext, useEffect, useState } from "react";
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
import ImageDisplay from "./ImageDisplay";
import { ProductUpdateSchema } from "@/schema/product";
import toast, { Toaster } from "react-hot-toast";
import { productApi } from "@/apis/product.api";
import { string, z } from "zod";

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
}

export const ProductUpdateForm: React.FC<ProductID> = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const { ForceRender } = ProductStore();
  // console.log("productId", productId);
  const [updatedProduct, setUpdatedProduct] = useState<ProductData | undefined>(
    undefined
  );
  const [imageRequests, setImageRequests] = useState<any[]>([]);
  const [imageRequestsUpdate, setImageRequestsUpdate] = useState<any[]>([]);

  useEffect(() => {
    const fetchUpdatedProduct = async () => {
      if (productId) {
        setImageRequestsUpdate(productId.imageResponses);
        try {
          const updatedData = await Promise.all(
            productId.imageResponses.map(async (image) => {
              try {
                const { data } = await filesApi.getFile(image.imageUrl);
                return {
                  ...image,
                  imageUrl: data.data,
                };
              } catch (error) {
                console.error("Error getting file:", error);
                return {
                  ...image,
                  imageUrl: "", // Handle error case if needed
                };
              }
            })
          );
          setUpdatedProduct({ ...productId, imageResponses: updatedData });
          setImageRequests(updatedData);
        } catch (error) {
          console.error("Error fetching updated product data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUpdatedProduct();
  }, [productId]);

  // Initialize image requests from productId if available
  const initialImageRequests =
    updatedProduct?.imageResponses.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      isBluePrint: image.isBluePrint,
      isMainImage: image.isMainImage,
    })) || [];
  // console.log('initialImageRequests', initialImageRequests)

  // State to manage image requests

  // console.log('imageRequests', imageRequests)

  // useForm hook for managing form state and validation
  const form = useForm({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: {
      id: productId?.id || "",
      code: productId?.code || "",
      priceFinished:
        productId?.productPhaseSalaries
          .find((item) => item.phaseName === "PH_003")
          ?.salaryPerProduct.toString() || "",
      pricePhase2:
        productId?.productPhaseSalaries
          .find((item) => item.phaseName === "PH_002")
          ?.salaryPerProduct.toString() || "",
      pricePhase1:
        productId?.productPhaseSalaries
          .find((item) => item.phaseName === "PH_001")
          ?.salaryPerProduct.toString() || "",
      size: productId?.size || "",
      description: productId?.description || "",
      name: productId?.name || "",
      isInProcessing: productId?.isInProcessing || false,
      addImagesRequest: initialImageRequests,
    },
  });

  const [imageUrls, setImageUrls] = useState<any>([]);
  const [nameImage, setNameImage] = useState<string[]>([]);
  // const [imageAddRequests, setImageAddRequests] = useState<
  //   {
  //     imageUrl: string;
  //     isBluePrint: boolean;
  //     isMainImage: boolean;
  //   }[]
  // >([]);
  const [imageAddRequests, setImageAddRequests] = useState<any[]>([]);

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
  const limitLength = (text: any, maxLength: any) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };
  // Handle uploading new photos
  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxTotalSize = 2000000; // 2000 KB

    let currentTotalSize = files.reduce((total, file) => total + file.size, 0);

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
  // console.log("removeImageIds", removeImageIds);
  // console.log("imageAddRequests", imageAddRequests);
  // console.log("imageRequests", imageRequests);
  // console.log("imageRequestsUpdate", imageRequestsUpdate);
  const [saveUpdateImage, setSaveUpdateImage] = useState<any[]>([]);
  // console.log("saveUpdateImage", saveUpdateImage);
  // Handle toggling blueprint flag for an image
  const handleToggleBluePrint = (imageUrl: string, id: string) => {
    // console.log('imageUrl=', imageUrl)
    console.log("id", id);
    console.log("image=====", imageRequestsUpdate);
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
        if (existingIndex !== -1) {
          // Update existing entry
          const updatedSaveUpdateImage = [...prevSaveUpdateImage];
          updatedSaveUpdateImage[existingIndex] = {
            ...updatedSaveUpdateImage[existingIndex],
            isBluePrint: !updatedSaveUpdateImage[existingIndex].isBluePrint,
          };
          return updatedSaveUpdateImage;
        } else {
          // Add new entry
          return [
            ...prevSaveUpdateImage,
            {
              id: updatedImage.id,
              imageUrl: updatedImage.imageUrl,
              isBluePrint: !updatedImage.isBluePrint,
              isMainImage: updatedImage.isMainImage,
            },
          ];
        }
      });
    }
  };

  // Handle toggling main image flag for an image
  const handleToggleMainImage = (imageUrl: string, id: string) => {
    console.log("imageUrl=", imageUrl);
    setImageRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl ? { ...req, isMainImage: !req.isMainImage } : req
      )
    );
    setImageAddRequests((prevImageRequests) =>
      prevImageRequests.map((req) =>
        req.imageUrl ? { ...req, isMainImage: !req.isMainImage } : req
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
      setSaveUpdateImage((prevSaveUpdateImage) => {
        const existingIndex = prevSaveUpdateImage.findIndex(
          (item) => item.id === id
        );
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
              imageUrl: updatedImage.imageUrl,
              isBluePrint: updatedImage.isBluePrint,
              isMainImage: !updatedImage.isMainImage,
            },
          ];
        }
      });
    }
  };

  const handlePostImage = async () => {
    setLoading(true);
    const formData = new FormData();
    imageUrls.forEach((imageUrl: any) => {
      formData.append("receivedFiles", imageUrl); // Đảm bảo rằng tên trường tương ứng với server
    });
    try {
      const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
      console.log("Upload successful:", response.data);
      // Xử lý các hành động sau khi tải lên thành công
    } catch (error) {
      console.error("Error uploading files:", error);
      // Xử lý lỗi khi tải lên không thành công
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle form submission
  const onSubmit = async (formData: z.infer<typeof ProductUpdateSchema>) => {
    if (isSubmitting) return; // Ngăn chặn việc submit nhiều lần
    var ImaNull = null;
    // let isHaveMainImage = false;
    // imageAddRequests.forEach((image) => {
    //   if (image.isMainImage === true) {
    //     isHaveMainImage = true;
    //   }
    // });
    // if (isHaveMainImage === false) {
    //   toast.error("Vui lòng chọn ảnh chính cho sản phẩm");
    //   return;
    // }
    setLoading(true);
    setIsSubmitting(true);
    // if (saveUpdateImage.length > 0) {
    //   // Push saveUpdateImage into imageAddRequests array
    //   setImageAddRequests((prevImageAddRequests) => [
    //     ...prevImageAddRequests,
    //     ...saveUpdateImage,
    //   ]);
    // }
    console.log(imageAddRequests);
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
      console.log("============requestBody", requestBody);

      // productApi
      //   .updateProduct(requestBody, formData.id)
      //   .then(({ data }) => {
      //     toast.success(data.message);
      //     ForceRender();
      //   })
      //   .catch((error) => {
      //     console.error("Error updating product:", error);
      //   });

      try {
        const response = await productApi.updateProduct(
          requestBody,
          formData.id
        );
        ForceRender();
        toast.success(response.data.message); // Assuming your API returns a message field in the response
        console.log("Update Successful:", response);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Xử lý lỗi từ server
          const errors = error.response.data.error;
          if (errors === null) {
            toast.error(error.response.data.message);
          }
          if (errors.ImageRequests) {
            toast.error(errors.ImageRequests);
          }

          if (errors.PriceFinished) {
            toast.error(errors.PriceFinished);
          }

          if (errors.Code) {
            toast.error(errors.Code);
          }
          // Sử dụng dấu ngoặc vuông để truy cập thuộc tính có dấu chấm trong tên
          if (errors['UpdateProductRequest.PriceFinished']) {
            toast.error(errors['UpdateProductRequest.PriceFinished']);
          }
          console.log(error.UpdateProductRequest.PriceFinished)
        } else if (error.response.data.message) {
          // Xử lý lỗi khi không có phản hồi từ server
          toast.error(
            "Không có phản hồi từ máy chủ trong khi cập nhật. Vui lòng thử lại sau."
          );
        } else {
          // Xử lý các lỗi khác
          toast.error(`Lỗi không mong muốn trong quá trình cập nhật: ${error.message}`);
        }
        throw error; // Re-throw the error to stop further execution
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Reset trạng thái submit
    }
  };

  useEffect(() => { }, [removeImageIds]);

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };

  const parseCurrency = (value: any) => {
    return value.replace(/,/g, "");
  };
  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-xl">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
                            Mã Sản Phẩm *
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
                            Tên Sản Phẩm *
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
                            Kích Thước *
                          </FormLabel>
                          <Input type="text" {...field} />
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
                              <SelectItem value="true">Đang xử lý</SelectItem>
                              <SelectItem value="false">Chưa xử lý</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-primary">
                            Mô Tả
                          </FormLabel>
                          <Textarea {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                              field.onChange(parseCurrency(e.target.value))
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
                              field.onChange(parseCurrency(e.target.value))
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
                              field.onChange(parseCurrency(e.target.value))
                            }
                          />
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
                    {isSubmitting ? "Loading..." : "GỬI"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
                <Carousel className="flex items-center justify-center w-full md:max-w-[390px] h-full">
                  <CarouselContent>
                    {imageRequests.map((image, index) => (
                      <CarouselItem
                        key={index}
                      >
                        <div className="p-1">
                          <Card>
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
                                onClick={() => handleDeleteImage(index, image.id)}
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
                                    className="flex items-center justify-center text-primary-backgroudPrimary bg-white rounded-md p-2 m-5"
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
                                        Đặt loại ảnh : Bản thiết kế hoặc ảnh chính
                                      </p>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="flex justify-between items-center">
                                        <Label htmlFor={`isBluePrint-${index}`}>
                                          [Ảnh] bản thiết kế
                                        </Label>
                                        <Switch
                                          className="data-[state=checked]:bg-primary"
                                          id={`isBluePrint-${index}`}
                                          checked={image.isBluePrint}
                                          onCheckedChange={() =>
                                            handleToggleBluePrint(
                                              image.imageUrl,
                                              image?.id
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <Label htmlFor={`isMainImage-${index}`}>
                                          [Ảnh] Chính
                                        </Label>
                                        <Switch
                                          className="data-[state=checked]:bg-primary"
                                          id={`isMainImage-${index}`}
                                          checked={image.isMainImage}
                                          onCheckedChange={() =>
                                            handleToggleMainImage(
                                              image.imageUrl,
                                              image?.id
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
                  <div className="  absolute left-[50%] bottom-[6%] transform: translate-x-[50%] transform: translate-y-[50%]">
                    <CarouselNext />
                    <CarouselPrevious />
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
                <label htmlFor="image" className="absolute bottom-0">
                  <Upload
                    size={35}
                    className="flex items-center justify-center text-primary bg-white rounded-md p-2 m-5"
                  />
                </label>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </Form>
  );
};
