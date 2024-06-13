import {
  materialHistoryFormSchema,
  materialHistoryFormType,
  materialHistoryType,
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

import { get } from "http";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import {
  ComboboxDataType,
  ComboboxForForm,
} from "@/components/shared/common/combobox/combobox-for-form";

const FakeDataCombobox: ComboboxDataType[] = [
  {
    value: "1",
    label: "Option 1",
  },
  {
    value: "2",
    label: "Option 2",
  },
  {
    value: "3",
    label: "Option 3",
  },
  {
    value: "4",
    label: "Option 4",
  },
  {
    value: "5",
    label: "Option 5",
  },
];

export default function AddNewMeterialHistoryForm() {
  const [comboboxData, setComboboxData] = useState<ComboboxDataType[]>([]);

  useEffect(() => {
    const getComboboxData = async () => {
      setComboboxData(FakeDataCombobox);
    };
    getComboboxData();
  }, [comboboxData]);

  const form = useForm<materialHistoryFormType>({
    resolver: zodResolver(materialHistoryFormSchema),
    defaultValues: {
      materialID: "",
      quantity: "",
      price: "",
      importAt: "",
    },
  });

  const onSubmit = (data: materialHistoryFormType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: materialHistoryFormType) => {
          console.log(data);
        })}
        className="space-y-7"
      >
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
                <InputAnimation nameFor="Số lượng" {...field} />
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
          name="importAt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  title="Vui lòng chọn ngày nhập"
                  name={"importAt"}
                  form={form}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button className="mt-3" type="submit">
            Tạo mới
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
