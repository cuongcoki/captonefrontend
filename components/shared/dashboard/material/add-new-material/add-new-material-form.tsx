import { AddMaterialSchema, AddMaterialType } from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { AddNewMaterialStore } from "@/components/shared/dashboard/material/add-new-material/add-new-material-store";
import { set } from "date-fns";
import ConfirmAlertDialog from "@/components/shared/common/confirm-alert-dialog/confirm-alert-dialog";

export default function AddNewMeterialForm() {
  const [materialImage, setMaterialImage] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const { forceUpdate } = useContext(MyContext);
  const ChangeImage = (file: any) => {
    setMaterialImage(file);
  };
  const firstValue = useRef<Omit<AddMaterialType, "id">>({
    name: "",
    unit: "",
    image: "",
    description: "",
    quantityPerUnit: "",
    quantityInStock: "",
  });
  const { isOpen, setHandleDialog, setIsOpen } = AddNewMaterialStore();
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
    if (!file) {
      return;
    }
    // setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", file);
    try {
      const response = await filesApi.postFiles(formData);
    } catch (error) {
      // console.error("Error uploading files:", error);
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
  const dropArea = document.querySelector(".drag-area");
  const labelForImage = dropArea?.querySelector("#labelForIamge");

  const onSubmit = async (data: AddMaterialType) => {
    setLoading(true);
    const file = (await handleUploadPhoto(materialImage)) as File;
    data.image = file?.name || " ";
    try {
      await handlePostImage(file);
    } catch (error) {}
    materialApi
      .addMaterial(data)
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success(data.message);
          form.reset();
          setMaterialImage("");
          forceUpdate();
          (labelForImage as HTMLLabelElement).hidden = true;
        }
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error?.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setHandleDialog(() => {
      if (
        isOpen &&
        JSON.stringify(firstValue.current) !== JSON.stringify(form.getValues())
      ) {
        document.getElementById("alert-dialog-trigger")?.click();
        return;
      }
      setIsOpen(!isOpen);
    });
  }, [setHandleDialog, setIsOpen, isOpen, form]);

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
          <ConfirmAlertDialog
            handleAccept={() => {
              setIsOpen(!isOpen);
            }}
          >
            <div id="alert-dialog-trigger"></div>
          </ConfirmAlertDialog>
        </div>
        <DialogFooter>
          <Button id="submit" className="mt-3" type="submit" disabled={loading}>
            {!loading ? "Tạo mới" : "Đang xử lý"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
