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

import InputAnimation from "@/components/shared/common/input/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { get } from "http";
import DatePicker from "@/components/shared/common/datapicker/date-picker";
import {
  ComboboxDataType,
  ComboboxForForm,
} from "@/components/shared/common/combobox/combobox-for-form";
import { useMaterialHistoryStore } from "@/components/shared/dashboard/material-history/table/material-history-store";
import { materiaHistoryApi } from "@/apis/material-history.api";
import { MaterialHistoryContext } from "@/components/shared/dashboard/material-history/table/data-table";
import toast from "react-hot-toast";
import { ComboboxDemo } from "@/components/shared/common/combobox/combobox_demo";
import { parse } from "date-fns";
import { Plus, X } from "lucide-react";

export default function AddNewMeterialHistoryForm() {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOffDialogA = () => {
    setOpenAlert(false);
  };
  const handleOnDialogA = () => {
    setOpenAlert(true);
  };

  const handleOnDialog = () => {
    setOpen(true);
  };
  const [comboboxData, setComboboxData] = useState<ComboboxDataType[]>([]);
  const { listMaterial } = useMaterialHistoryStore();
  const { ForceRender } = React.useContext(MaterialHistoryContext);

  useEffect(() => {
    const getComboboxData = async () => {
      setComboboxData(listMaterial);
    };
    getComboboxData();
  }, [listMaterial]);

  const form = useForm<materialHistoryFormType>({
    resolver: zodResolver(materialHistoryFormSchema),
    defaultValues: {
      materialID: "",
      quantity: "",
      price: "",
      importAt: "",
      description: "",
    },
  });

  const onSubmit = (data: materialHistoryFormType) => {
    // console.log("SUBMIT DATA", data);
    if (parse(data.importAt, "dd/MM/yyyy", new Date()) > new Date()) {
      toast.error("Ngày nhập không được vượt quá ngày hiện tại ");
      return;
    }
    const requestBody = {
      materialId: data.materialID,
      quantity: data.quantity,
      price: String(data.price.replace(/\./g, "")),
      importDate: data.importAt,
      description: data.description,
    };
    // console.log("requestBodyrequestBodyrequestBody",requestBody)
    materiaHistoryApi.addMaterialHistory(requestBody).then(() => {
      toast.success("Thêm mới lịch sử nhập hàng thành công");
      form.reset();
      ForceRender();
    });
  };

  const handleClearForm = () => {
    setOpen(false);
    setOpenAlert(false);
    form.reset();
  };
  const handleOffDialog = () => {
    const isDescriptionEmpty = form.getValues().description === "";
    const isImportAtEmpty = form.getValues().importAt === "";
    const isMaterialIDEmpty = form.getValues().materialID === "";
    const isPriceEmpty = form.getValues().price === "";
    const isQuantityEmpty = form.getValues().quantity === "";

    // Nếu tất cả các trường trong form đều trống hoặc không có giá trị và các mảng rỗng
    if (
      isDescriptionEmpty &&
      isImportAtEmpty &&
      isMaterialIDEmpty &&
      isPriceEmpty &&
      isQuantityEmpty
    ) {
      setOpen(false);
      form.reset();
    } else {
      setOpenAlert(true);
    }
  };
  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };
  const parseCurrency = (value: any) => {
    return value.replace(/,/g, "");
  };
  return (
    <>
      {openAlert && (
        <AlertDialog open={openAlert}>
          <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn tắt biểu mẫu này không ??
              </AlertDialogTitle>
              <AlertDialogDescription>
                Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
                những dữ liệu mà bạn đã nhập
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleOffDialogA}>
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Button
        className="bg-[#22c55e] mb-2 ml-auto mt-4 md:col-start-2 xl:col-start-3 xl:mt-0"
        onClick={() => handleOnDialog()}
      >
        <Plus /> Nhập mới
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 rounded-2xl">
          <div
            className="fixed inset-0 bg-black opacity-50 blur-sm backdrop:blur-sm backdrop-blur-md"
            onClick={() => handleOffDialog()}
          ></div>
          <div className="relative bg-white dark:bg-[#1c1917] rounded-2xl max-w-[80vw] w-[525px] max-h-[80vh] h-max shadow-lg">
            <div className="bg-[#ffff] flex flex-col rounded-md">
              <div className="p-4 flex items-center justify-between bg-[#00c100] rounded-t-md">
                <h2 className="text-2xl text-white">
                  Nhập Nguyên Vật Liệu Mới
                </h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4 dark:text-white" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[450px] dark:bg-card">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-7"
                  >
                    <FormField
                      control={form.control}
                      name="materialID"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ComboboxForForm
                              title="Vui lòng chọn nguyên vật liệu"
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
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const inputValue = event.target.value;
                                // Remove any characters that are not digits or a decimal point
                                let filteredInput = inputValue.replace(
                                  /[^\d.]/g,
                                  ""
                                );

                                // Split by decimal point and ensure only one decimal point is present
                                const parts = filteredInput.split(".");
                                if (parts.length > 2) {
                                  // More than one decimal point
                                  // Join the first part with the rest of the string, excluding additional decimal points
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputAnimation
                              type="text"
                              nameFor="Giá nhập / Đơn vị"
                              {...field}
                              inputMode="numeric"
                              value={formatCurrency(field.value)}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                field.onChange(
                                  parseCurrency(event.target.value)
                                );
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

                    <Button className="mt-3 w-full bg-[#00c100]" type="submit">
                      Tạo mới
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
