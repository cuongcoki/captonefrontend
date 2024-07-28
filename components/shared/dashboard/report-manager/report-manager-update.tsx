import { reportApi } from "@/apis/report.api";
import { ReportManagerStore } from "@/components/shared/dashboard/report-manager/report-manager-store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reportUpdateSchema, ReportUpdateSchemaType } from "@/schema/report";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function ReportManagerUpdate({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { tableData, updateReport } = ReportManagerStore((state) => ({
    tableData: state.tableData,
    updateReport: state.updateReport,
  }));
  const [isOpen, setIsOpen] = useState(false);

  const [reportData] = useState(tableData[index]);
  const form = useForm<ReportUpdateSchemaType>({
    resolver: zodResolver(reportUpdateSchema),
    defaultValues: {
      replyMessage: reportData.replyMessage || "",
      status:
        reportData.status.toString() === "0"
          ? ""
          : reportData.status.toString() || "",
    },
  });
  useEffect(() => {
    console.log("RENDER UPDATE REPORT");
  }, []);
  const onSubmit = (data: ReportUpdateSchemaType) => {
    console.log("Submit Company Data", data);
    reportApi
      .updateReport({
        id: tableData[index].id,
        replyMessage: data.replyMessage,
        status: Number(data.status),
      })
      .then(() => {
        toast.success("Cập nhật đơn thành công");
        // ForceRender();
        setIsOpen(false);
        updateReport(index, Number(data.status), data.replyMessage);
      })
      .catch((error) => {
        toast.error("Cập nhật đơn thất bại");
        console.log("Error", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[40vw] dark:bg-[#1c1917]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#22c55e] w-full text-center mb-3">
            Cập nhật đơn báo cáo
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vui lòng chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="hover:bg-gray-100" value="1">
                          Đã xử lý
                        </SelectItem>
                        <SelectItem className="hover:bg-gray-100" value="2">
                          Đã từ chối
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
                name="replyMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phản hồi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập phản hồi ở đây"
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
                Lưu phản hồi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
