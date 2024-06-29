import { AddMaterialSchema, AddMaterialType } from "@/schema/material";
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
      quantityInStock: "",
    },
  });

  const handlePostImage = async (file: File) => {
    console.log("handlePostImage");
    if (!file) {
      console.error("No image selected");
      return;
    }

    // setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", file); // Đảm bảo rằng tên trường tương ứng với server và chỉ đăng một ảnh

    try {
      const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
    } catch (error) {
      console.error("Error uploading files:", error);
      // Xử lý lỗi khi tải lên không thành công
    } finally {
      // setLoading(false);
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
  const onSubmit = async (data: AddMaterialType) => {
    const file = (await handleUploadPhoto(materialImage)) as File;
    data.image = file.name;
    // console.log("Material Image", materialImage);
    console.log("Submit DATA", data);
    try {
      await handlePostImage(file);
    } catch (error) {
      console.log("Error in Up Image", error);
    }
    materialApi
      .addMaterial(data)
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success(data.message);
          form.reset();
          forceUpdate();
        }
      })
      .catch((err) => {
        console.log("Error in Add Material: ", err);
      });
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
