import { AddMaterialSchema, AddMaterialType } from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
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

export default function AddNewMeterialForm() {
  const [materialImage, setMaterialImage] = useState<any>("");
  const { forceUpdate } = useContext(MyContext);
  const ChangeImage = (file: any) => {
    setMaterialImage(file);
  };

  const form = useForm<AddMaterialType>({
    resolver: zodResolver(AddMaterialSchema),
    defaultValues: {
      name: "",
      unit: "",
      image: "",
      description: "",
      quantityPerUnit: "",
    },
  });

  const onSubmit = (data: AddMaterialType) => {
    data.image = materialImage.base64;
    console.log("MAterial Image", materialImage);
    console.log("DATA", data);
    try {
      materialApi.addMaterial(data).then(({ data }) => {
        if (data.isSuccess) {
          toast.success(data.message);
          forceUpdate();
        }
      });
    } catch (error) {
      console.log("ERROR IN ADD MATERIAL", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 md:space-x-5">
          <div className="space-y-7">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                  <FormControl>
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
                  <FormControl>
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
            Tạo mới
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
