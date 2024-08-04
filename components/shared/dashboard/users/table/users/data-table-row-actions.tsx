"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { userskSchema } from "./data/schema";
import UserBanButton from "@/components/shared/dashboard/users/table/users/user-ban-button";
import { Employee } from "@/components/shared/dashboard/users/table/users/Column";
import UserEditButton from "@/components/shared/dashboard/users/table/users/edit-button";
import { UpdateUser } from "../../form/UsersUpdateForm";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };
  return (
    <DropdownMenu modal={false} onOpenChange={toggleDropdown} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] ">
        <UpdateUser userId={row._valuesCache.id}>
          <Button
            variant="outline"
            className="border-none w-full flex items-center justify-start "
          >
            Chỉnh sửa
          </Button>
        </UpdateUser>
        <UserBanButton setIsOpen={setIsOpen} user={row.original as Employee} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
