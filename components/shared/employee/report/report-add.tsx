import { companyApi } from "@/apis/company.api";
import { reportApi } from "@/apis/report.api";
import { ReportStore } from "@/components/shared/employee/report/report-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CompanyAddSchemaType } from "@/schema/company";
import { reportAddSchema, ReportAddSchemaType } from "@/schema/report";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function ReportAdd() {
  const { ForceRender } = ReportStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<ReportAddSchemaType>({
    resolver: zodResolver(reportAddSchema),
    defaultValues: {
      description: "",
      reportType: "",
    },
  });
  const onSubmit = (data: ReportAddSchemaType) => {
    console.log("Submit Company Data", data);
    reportApi
      .createReport({
        description: data.description,
        reportType: Number(data.reportType),
      })
      .then(() => {
        toast.success("Tạo đơn thành công");
        ForceRender();
        form.reset();
        setIsOpen(false);
      })
      .catch((error) => {
        toast.error("Tạo đơn thất bại");
        console.log("Error", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-[#22c55e]">
          Thêm mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40vw] dark:bg-[#1c1917]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#22c55e] w-full text-center mb-3">
            Tạo Mới Đơn Khiếu Nại
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại đơn</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại đơn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="hover:bg-gray-100" value="0">
                          Báo cáo về điểm danh
                        </SelectItem>
                        <SelectItem className="hover:bg-gray-100" value="1">
                          Báo cáo về chấm công
                        </SelectItem>
                        <SelectItem className="hover:bg-gray-100" value="2">
                          Báo cáo về lương
                        </SelectItem>
                        <SelectItem className="hover:bg-gray-100" value="3">
                          Các loại đơn khác
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung báo cáo ở đây"
                        className="resize-none h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button className="mt-3" type="submit">
                Gửi đơn
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
