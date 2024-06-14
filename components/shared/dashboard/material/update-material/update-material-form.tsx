"use client";
import { materialSchema, materialType } from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import InputAnimation from "@/components/shared/common/input/input";
import DragAndDropFile from "@/components/shared/common/input/drag&drop-file/drag&drop-file";
import { number } from "zod";

const linkImage =
  "data:image/jpeg;base64,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";

export default function UpdateMaterialForm({ id }: { id: string }) {
  const [materialImage, setMaterialImage] = useState<any>("");

  const fillImage = (fileURL: string) => {
    const dropArea = document.querySelector(".drag-area");
    let imgTag = `<img src="${fileURL}" alt="">`;
    if (dropArea) {
      dropArea.innerHTML = imgTag;
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
    },
  });

  useEffect(() => {
    const getMaterialData = () => {
      return Promise.resolve({
        id: id,
        name: "Vật liệu 1",
        unit: "Cái",
        image: linkImage,
        description: "Mô tả vật liệu 1",
        quantityPerUnit: "1",
      } as materialType);
    };

    const fetchData = async () => {
      const data = await getMaterialData();
      if (data.image) {
        fillImage(data.image);
        setMaterialImage(data.image);
      }
      form.reset(data);
    };

    fetchData();
  }, [id, form]); // Thêm id vào dependency array để useEffect được kích hoạt lại khi id thay đổi

  const onSubmit = (data: materialType) => {
    data.image = materialImage;
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex space-x-5 justify-center items-end">
          <div className="space-y-7 w-[400px]">
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
                  {/* <FormLabel>Số lượng mỗi đơn vị</FormLabel> */}
                  <FormControl>
                    {/* <Input
                  placeholder="Nhập số lượng mỗi đơn vị ở đây"
                  {...field}
                /> */}
                    <InputAnimation
                      nameFor="Số lượng mỗi đơn vị"
                      {...field}
                      onChange={(event: any) => {
                        if (Number(event.target.value).toString() !== "NaN") {
                          field.onChange(Number(event.target.value));
                        }
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
                  {/* <FormLabel>Miêu tả</FormLabel> */}
                  <FormControl>
                    {/* <Input placeholder="Nhập miêu tả ở đây" {...field} /> */}
                    <InputAnimation nameFor="Miêu tả" {...field} />
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
          <Button className="mt-3" type="submit">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
