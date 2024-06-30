import { companyApi } from "@/apis/company.api";
import { CompanyContext } from "@/components/shared/dashboard/company/company-table";
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
import { CompanyAddSchemaType, companyAddSchema } from "@/schema/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function CompanyAdd() {
  const { ForceRender } = useContext(CompanyContext);

  const form = useForm<CompanyAddSchemaType>({
    resolver: zodResolver(companyAddSchema),
    defaultValues: {
      name: "",
      address: "",
      directorName: "",
      directorPhone: "",
      email: "",
      companyType: "",
    },
  });
  const onSubmit = (data: CompanyAddSchemaType) => {
    console.log("Submit Company Data", data);
    companyApi
      .createCompany({
        companyRequest: {
          name: data.name,
          address: data.address,
          directorName: data.directorName,
          directorPhone: data.directorPhone,
          email: data.email,
          companyType: parseInt(data.companyType),
        },
      })
      .then(() => {
        toast.success("Tạo công ty thành công");
        ForceRender();
        form.reset();
      })
      .catch((error) => {
        toast.error("Tạo công ty thất bại");
        console.log("Error", error);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Thêm mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[30vw]">
        <DialogHeader>
          <DialogTitle>Thêm mới công ty</DialogTitle>
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
                        <Label htmlFor="name" className="text-left">
                          Tên công ty
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
                        <Label htmlFor="address" className="text-left">
                          Địa chỉ
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
                        <Label htmlFor="directorName" className="text-left">
                          Tên giám đốc
                        </Label>
                        <Input
                          id="directorName"
                          placeholder="Vui lòng nhập tên giám đốc công ty"
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
                        <Label htmlFor="directorPhone" className="text-left">
                          Số điện thoại
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
                        <Label htmlFor="email" className="text-left">
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
              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="companyType" className="text-left">
                        Loại công ty
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
                            <SelectItem className="hover:bg-gray-100" value="0">
                              Nhà xưởng
                            </SelectItem>
                            <SelectItem className="hover:bg-gray-100" value="1">
                              Công ty mua đặt hàng
                            </SelectItem>
                            <SelectItem className="hover:bg-gray-100" value="2">
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
            </div>
            <DialogFooter>
              <Button className="mt-3" type="submit">
                Tạo mới
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}