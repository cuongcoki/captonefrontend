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
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import InputAnimation from "@/components/shared/common/input/input";
import DragAndDropFile from "@/components/shared/common/input/drag&drop-file/drag&drop-file";
import { number } from "zod";
import { materialApi } from "@/apis/material.api";
import { MyContext } from "@/components/shared/dashboard/material/table/data-table";

const linkImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQnXcFa9HVz9wxTvYDQRoPe76rcZuhUPbH2g&s";

export default function UpdateMaterialForm({ id }: { id: string }) {
  const [materialImage, setMaterialImage] = useState<any>("");
  const { forceUpdate } = useContext(MyContext);
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
    materialApi
      .getMaterial(id)
      .then((data) => {
        if (data.data.isSuccess) {
          console.log("DATA GET MATERIAL", data.data.data);
          // fillImage(data.data.data.image);
          fillImage(linkImage);
          data.data.data.quantityPerUnit =
            data.data.data.quantityPerUnit.toString();
          form.reset(data.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, form]);

  const onSubmit = (data: materialType) => {};

  const formSubmit = () => {
    console.log("DATA", form.getValues());
    materialApi
      .updateMaterial(form.getValues())
      .then(({ data }) => {
        if (data.isSuccess) {
          forceUpdate();
          alert("Cập nhật thành công");
        }
      })
      .catch((error) => {
        console.log("ERROR IN UPDATE MATERIAL", error);
      });
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
                  <FormControl>
                    <InputAnimation
                      nameFor="Số lượng mỗi đơn vị"
                      {...field}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const inputValue = event.target.value;
                        const numericInput = inputValue.replace(/\D/g, "");

                        field.onChange(numericInput.toString());
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
          <Button className="mt-3" type="submit" onClick={formSubmit}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
