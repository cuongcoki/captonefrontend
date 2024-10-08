import DatePicker from "@/components/shared/common/datapicker/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  materialHistoryFilterSchema,
  materialHistoryFilterType,
} from "@/schema/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function FillterByDate() {
  const form = useForm<materialHistoryFilterType>({
    resolver: zodResolver(materialHistoryFilterSchema),
    defaultValues: {
      from: "",
      to: "",
    },
  });

  const onSubmit = (data: materialHistoryFilterType) => {
    if (data.from > data.to) {
      toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return;
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 my-5">
          <div className="grid grid-cols-2 gap-x-6">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      name="from"
                      form={form}
                      title="Từ ngày"
                      className="w-full"
                      onDayClick={(event: any) => {
                        // console.log(format(event, "dd/MM/yyyy"));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      name="to"
                      form={form}
                      title="Đến ngày"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
