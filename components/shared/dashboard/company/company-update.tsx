import React from "react";
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
import { CompanyAddSchemaType, companyAddSchema } from "@/schema/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { companyStore } from "@/components/shared/dashboard/company/company-store";
import { Button } from "@/components/ui/button";
import { companyApi } from "@/apis/company.api";
export default function CompanyUpdate({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { tableData, setTableDataIndex } = companyStore();

  const form = useForm<CompanyAddSchemaType>({
    resolver: zodResolver(companyAddSchema),
    defaultValues: {
      name: tableData[index].name.trim(),
      address: tableData[index].address.trim(),
      directorName: tableData[index].directorName.trim(),
      directorPhone: tableData[index].directorPhone.trim(),
      email: tableData[index].email || "",
      companyType: tableData[index].companyType.toString().trim(),
    },
  });
  const onSubmit = (data: CompanyAddSchemaType) => {
    const updateData = {
      id: tableData[index].id,
      companyRequest: {
        name: data.name,
        address: data.address,
        directorName: data.directorName,
        directorPhone: data.directorPhone,
        email: data.email || "",
        companyType: parseInt(data.companyType),
      },
    };

    companyApi
      .updateCompany(updateData)
      .then(() => {
        toast.success("Cập nhật thông tin công ty thành công");
        setTableDataIndex(index, {
          name: data.name,
          address: data.address,
          directorName: data.directorName,
          directorPhone: data.directorPhone,
          email: data.email,
          companyType: parseInt(data.companyType),
          companyEnum: tableData[index].companyEnum,
          companyTypeDescription: tableData[index].companyTypeDescription,
          id: tableData[index].id,
        });
      })
      .catch((error) => {
        if (error.response.data.error) {
          for (const key in error.response.data.error) {
            toast.error(error.response.data.error[key][0]);
          }
        } else {
          toast.error(error.response.data.message);
        }
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[40vw] dark:bg-[#1c1917]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#22c55e] w-full text-center mb-3 ">
            Thông Tin Công Ty
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-left text-primary">
                          Tên công ty *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Vui lòng nhập tên công ty"
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-left text-primary">
                          Địa chỉ *
                        </Label>
                        <Input
                          id="address"
                          placeholder="Vui lòng nhập địa chỉ"
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="directorName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="directorName" className="text-left text-primary">
                        Người đại diện *
                        </Label>
                        <Input
                          id="directorName"
                          placeholder="Vui lòng nhập người đại diện công ty"
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="directorPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="directorPhone" className="text-left text-primary">
                          Số điện thoại *
                        </Label>
                        <Input
                          id="directorPhone"
                          placeholder="Vui lòng nhập số điện thoại "
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-left text-primary">
                          Email
                        </Label>
                        <Input
                          id="email"
                          placeholder="Vui lòng nhập Email"
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {tableData[index].companyType !== 0 && (
                <FormField
                  control={form.control}
                  name="companyType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="companyType" className="text-left text-primary">
                          Loại công ty *
                        </Label>
                        <div className="col-span-3">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại công ty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                className="hover:bg-gray-100"
                                value="0"
                              >
                                Nhà xưởng
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-gray-100"
                                value="1"
                              >
                                Công ty mua đặt hàng
                              </SelectItem>
                              <SelectItem
                                className="hover:bg-gray-100"
                                value="2"
                              >
                                Công ty hợp tác sản xuất
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <Button className="mt-3" type="submit">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
