"use client";
import {
  materialHistoryFormSchema,
  materialHistoryFormType,
  materialSchema,
  materialType,
} from "@/schema/material";
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

import DatePicker from "@/components/shared/common/datapicker/date-picker";
import {
  ComboboxDataType,
  ComboboxForForm,
} from "@/components/shared/common/combobox/combobox-for-form";
import { materiaHistoryApi } from "@/apis/material-history.api";
import { useMaterialHistoryStore } from "@/components/shared/dashboard/material-history/table/material-history-store";
import { format, parse } from "date-fns";
import { MaterialHistoryContext } from "@/components/shared/dashboard/material-history/table/data-table";
import toast from "react-hot-toast";

const linkImage =
  "https://images.pexels.com/photos/986733/pexels-photo-986733.jpeg?cs=srgb&dl=pexels-nickoloui-986733.jpg&fm=jpg";
export default function UpdateMaterialHistoryForm({ id }: { id: string }) {
  const [comboboxData, setComboboxData] = useState<ComboboxDataType[]>([]);
  const { listMaterial } = useMaterialHistoryStore();
  const [importDate, setImportDate] = useState<string>("");
  const { ForceRender } = React.useContext(MaterialHistoryContext);

  const form = useForm<materialHistoryFormType>({
    resolver: zodResolver(materialHistoryFormSchema),
    defaultValues: {
      materialID: "",
      quantity: "",
      price: "",
      importAt: "",
    },
  });

  useEffect(() => {
    console.log("IMPORT DATE:", importDate);
  }, [importDate]);

  useEffect(() => {
    const getComboboxData = async () => {
      setComboboxData(listMaterial);
    };
    getComboboxData();
  }, [listMaterial]);

  useEffect(() => {
    materiaHistoryApi.getMaterialHistory(id).then((res) => {
      // console.log("DATA FETCH FROM API:", res.data.data);
      const formData: materialHistoryFormType = {
        materialID: String(res.data.data.materialId),
        quantity: String(res.data.data.quantity).trim(),
        price: String(res.data.data.price).trim(),
        importAt: res.data.data.importDate,
        description: res.data.data.description.trim(),
      };
      setImportDate(res.data.data.importDate);
      form.reset(formData);
    });
  }, [form, id]);

  // Convert date format from yyyy-MM-dd to dd/MM/yyyy
  function convertDateFormat(inputDate: string) {
    let parts = inputDate.split("-");
    let formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
    return formattedDate;
  }
  // Convert date format from dd/MM/yyyy to yyyy-MM-dd
  function convertDateFormat2(inputDate: string) {
    let parts = inputDate.split("/");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate;
  }

  const onSubmit = (data: materialHistoryFormType) => {
    data.importAt = convertDateFormat(importDate);
    if (parse(data.importAt, "dd/MM/yyyy", new Date()) > new Date()) {
      toast.error("Ngày nhập không được vượt quá ngày hiện tại ");
      return;
    }
    console.log("ON SUBMIT DATA:", data);
    materiaHistoryApi
      .updateMaterialHistory({
        id: id,
        materialId: data.materialID,
        quantity: Number(data.quantity),
        price: Number(data.price),
        importDate: data.importAt,
        description: data.description,
      })
      .then((res) => {
        console.log("UPDATE MATERIAL HISTORY SUCCESS", res.data);
        ForceRender();
        toast.success("Cập nhật thành công");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="materialID"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboboxForForm
                  title="Vui lòng chọn nguyên liệu"
                  data={comboboxData}
                  name="materialID"
                  form={form}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Đơn vị</FormLabel> */}
              <FormControl>
                {/* <Input placeholder="Nhập đơn vị ở đây" {...field} /> */}
                <InputAnimation
                  nameFor="Số lượng"
                  {...field}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = event.target.value;
                    // Remove any characters that are not digits or a decimal point
                    let filteredInput = inputValue.replace(/[^\d.]/g, "");

                    // Split by decimal point and ensure only one decimal point is present
                    const parts = filteredInput.split(".");
                    if (parts.length > 2) {
                      // More than one decimal point
                      // Join the first part with the rest of the string, excluding additional decimal points
                      filteredInput = `${parts[0]}.${parts.slice(1).join("")}`;
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputAnimation
                  nameFor="Giá nhập"
                  {...field}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = event.target.value;
                    // Remove any characters that are not digits or a decimal point
                    let filteredInput = inputValue.replace(/[^\d.]/g, "");

                    // Split by decimal point and ensure only one decimal point is present
                    const parts = filteredInput.split(".");
                    if (parts.length > 2) {
                      // More than one decimal point
                      // Join the first part with the rest of the string, excluding additional decimal points
                      filteredInput = `${parts[0]}.${parts.slice(1).join("")}`;
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
                <InputAnimation nameFor="Ghi chú" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="importAt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  selected={new Date(importDate || "")}
                  title={
                    convertDateFormat(importDate) || "Vui lòng chọn ngày nhập"
                  }
                  name={"importAt"}
                  onDayClick={(event: any) => {
                    setImportDate(format(event, "yyyy-MM-dd"));
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button className="mt-3" type="submit">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
