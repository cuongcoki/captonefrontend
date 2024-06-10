import { materialSchema, materialType } from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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

export default function AddNewMeterialForm() {
  const [materialImage, setMaterialImage] = useState<any>("");

  const ChangeImage = (file: any) => {
    setMaterialImage(file);
  };

  const form = useForm<materialType>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      materialID: "",
      name: "",
      unit: "",
      image: "",
      description: "",
      quantityPerUnit: "",
    },
  });

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
                  <FormControl>
                    <InputAnimation
                      nameFor="Số lượng mỗi đơn vị"
                      {...field}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const inputValue = event.target.value;
                        const numericInput = inputValue.replace(/\D/g, "");

                        field.onChange(numericInput);
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
                  {/* <MaterialFormContext.Provider
                    value={{ ChangeImage: ChangeImage }}
                  >
                    <DragAndDropFile />
                  </MaterialFormContext.Provider> */}
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
            Tạo mới
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
