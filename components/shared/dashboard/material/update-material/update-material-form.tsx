"use client";
import { materialSchema, materialType } from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import InputAnimation from "@/components/shared/common/input/input";
import DragAndDropFile from "@/components/shared/common/input/drag&drop-file/drag&drop-file";
import { materialApi } from "@/apis/material.api";
import { MyContext } from "@/components/shared/dashboard/material/table/data-table";
import toast from "react-hot-toast";
import { filesApi } from "@/apis/files.api";
import { UpdateMaterialContext } from "@/components/shared/dashboard/material/update-material/update-material";

const linkImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQnXcFa9HVz9wxTvYDQRoPe76rcZuhUPbH2g&s";

export default function UpdateMaterialForm({ id }: { id: string }) {
  let { setIsUpdate } = useContext(UpdateMaterialContext);
  const [materialImage, setMaterialImage] = useState<any>("");
  const { forceUpdate } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [firstValue, setFirstValue] = useState<materialType>({
    id: "",
    name: "",
    unit: "",
    image: "",
    description: "",
    quantityPerUnit: "",
    quantityInStock: "",
  });

  const fillImage = (fileURL: string) => {
    const iamgeLabel = document.querySelector(".label_image") as HTMLElement;
    const dropArea = document.querySelector(".drag-area") as HTMLElement;
    let imgTag = `<img src="${fileURL}" class="absolute top-0 left-0 w-full h-full object-cover">`;
    if (iamgeLabel) {
      iamgeLabel.innerHTML += imgTag;
      iamgeLabel.hidden = false;
      dropArea.classList.add("active");
    }
  };

  const ChangeImage = (file: any) => {
    setMaterialImage(file);
  };

  const form = useForm<materialType>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      id: "",
      name: "",
      unit: "",
      image: "",
      description: "",
      quantityPerUnit: "",
      quantityInStock: "",
    },
  });
  const handlePostImage = async (file: File) => {
    if (!file) {
      return;
    }

    // setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", file);
    try {
      const response = await filesApi.postFiles(formData);
    } catch (error) {
    } finally {
    }
  };
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
  const handleUploadPhoto = async (file: File) => {
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
      return newFile;
    }
  };

  useEffect(() => {
    materialApi
      .getMaterial(id)
      .then((data) => {
        if (data.data.isSuccess) {
          data.data.data.quantityPerUnit = data.data.data.quantityPerUnit
            .toString()
            .trim();
          data.data.data.quantityInStock = data.data.data.quantityInStock
            .toString()
            .trim();
          data.data.data.description = data.data.data.description.trim();
          data.data.data.unit = data.data.data.unit.trim();
          data.data.data.name = data.data.data.name.trim();
          form.reset(data.data.data);
          setFirstValue(data.data.data);
          filesApi
            .getFile(data.data.data.image as string)
            .then((res) => {
              fillImage(res.data.data);
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, form]);

  const onSubmit = (data: materialType) => {};

  const formSubmit = async () => {
    const file = (await handleUploadPhoto(materialImage)) as File;
    if (file !== null && file !== undefined) {
      form.setValue("image", file.name);
    }
    try {
      await handlePostImage(file);
    } catch (error) {}
    if (form.getValues().quantityInStock === "") {
      return toast.error("Số lượng kho không thể bé hơn 0");
    }
    setLoading(true);
    materialApi
      .updateMaterial(form.getValues())
      .then(({ data }) => {
        if (data.isSuccess) {
          forceUpdate();
          toast.success(data.message);
        }
      })
      .catch((error) => {
        if(error.response.data.status === 500){
          toast.error("Thông tin cập nhật nguyên vật liệu lỗi")
        } else {
          if (error.response.data.error) {
            for (const key in error.response.data.error) {
              toast.error(error.response.data.error[key][0]);
            }
          } else {
            toast.error(error.response.data.message);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const watchedValues = form.watch();
  useEffect(() => {
    if (JSON.stringify(watchedValues) !== JSON.stringify(firstValue)) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [watchedValues, firstValue, setIsUpdate]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 md:space-x-5">
          <div className="space-y-7">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Tên vật liệu</FormLabel> */}
                  <FormControl>
                    <InputAnimation nameFor="Tên vật liệu" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Đơn vị</FormLabel> */}
                  <FormControl>
                    {/* <Input placeholder="Nhập đơn vị ở đây" {...field} /> */}
                    <InputAnimation nameFor="Đơn vị" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityPerUnit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputAnimation
                      nameFor="Số lượng mỗi đơn vị"
                      {...field}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const inputValue = event.target.value;
                        let filteredInput = inputValue.replace(/[^\d.]/g, "");
                        const parts = filteredInput.split(".");
                        if (parts.length > 2) {
                          filteredInput = `${parts[0]}.${parts
                            .slice(1)
                            .join("")}`;
                        }
                        field.onChange(filteredInput);
                      }}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputAnimation nameFor="Miêu tả" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantityInStock"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputAnimation
                      nameFor="Số lượng trong kho"
                      {...field}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const inputValue = event.target.value;
                        let filteredInput = inputValue.replace(/[^\d.]/g, "");
                        const parts = filteredInput.split(".");
                        if (parts.length > 2) {
                          filteredInput = `${parts[0]}.${parts
                            .slice(1)
                            .join("")}`;
                        }
                        field.onChange(filteredInput);
                      }}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <DragAndDropFile ChangeImage={ChangeImage} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button
            className="mt-3"
            type="submit"
            // onClick={formSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
