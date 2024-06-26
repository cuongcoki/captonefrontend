"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSearchParams } from "@/types/userTypes";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchOptions: UserSearchParams;
  roles: any;
};

export default function TableUserFeature({ searchOptions, roles }: Props) {
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

  const isActiveChange = (value: string) => {
    setIsActive(value);
    handleSearch("isActive", value)();
  };

  const roleIdChange = (value: string) => {
    setRoleId(value);
    handleSearch("roleId", value)();
  };

  const searchTearmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTearm(event.target.value);
    handleSearch("searchTearm", event.target.value)();
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

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Tìm kiếm nhân viên..."
        value={searchTearm}
        onChange={searchTearmChange}
        className="max-w-sm shadow-sm"
      />
      <Select value={roleId} onValueChange={(value) => roleIdChange(value)}>
        <SelectTrigger className="w-[280px]">
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
        <SelectTrigger className="w-[180px] ">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Đang làm</SelectItem>
          <SelectItem value="false">Đã nghỉ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
