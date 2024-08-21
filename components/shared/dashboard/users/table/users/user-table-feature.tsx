import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSearchParams } from "@/types/userTypes";
import { ChangeEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/components/shared/common/customer-hook/use-debounce";

type Props = {
  searchOptions: UserSearchParams;
  roles: any;
  setCurrentPageToOne: () => void;
};

export default function TableUserFeature({
  searchOptions,
  roles,
  setCurrentPageToOne,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isActive, setIsActive] = useState<string>(
    searchOptions.isActive == "false" ? "false" : "true"
  );
  const [roleId, setRoleId] = useState(
    searchOptions.roleId ? searchOptions.roleId.toString() : ""
  );
  const [searchTearm, setSearchTearm] = useState(
    searchOptions.searchTearm ?? ""
  );

  const debouncedSearchTerm = useDebounce(searchTearm, 300);

  const isActiveChange = (value: string) => {
    setIsActive(value);
    handleSearch("isActive", value)();
    setCurrentPageToOne();
  };

  const roleIdChange = (value: string) => {
    setRoleId(value);
    handleSearch("roleId", value)();
    setCurrentPageToOne();
  };

  const searchTearmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTearm(event.target.value);
  };

  const handleSearch = (name: string, term: string) => () => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(name, term);
    } else {
      params.delete(name);
    }
    params.set("page", "1"); // Reset page to 1 on search
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Trigger search when debounced search term changes
  useEffect(() => {
    handleSearch("searchTearm", debouncedSearchTerm)();
    setCurrentPageToOne();
  }, [debouncedSearchTerm]);

  return (
    <div className="flex sm:items-start flex-col sm:flex-row gap-y-5 sm:gap-x-5 ">
      <Input
        placeholder="Tìm kiếm nhân viên..."
        value={searchTearm}
        onChange={searchTearmChange}
        className="max-w-sm shadow-sm"
      />

      <Select value={roleId} onValueChange={(value) => roleIdChange(value)}>
        <SelectTrigger className="md:w-[280px] w-full">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((item: any) => (
            <SelectItem value={item.id} key={item.id}>
              {item.decription}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={isActive} onValueChange={(value) => isActiveChange(value)}>
        <SelectTrigger className="md:w-[180px] w-full">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Đang làm</SelectItem>
          <SelectItem value="false">Nghỉ việc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
