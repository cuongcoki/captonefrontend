import { DeleteMaterialHistory } from "@/components/shared/dashboard/material-history/delete-material-history/delete-material-history";
import UpdateMaterialHistory from "@/components/shared/dashboard/material-history/update-material-history/update-material-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";

export default function MaterialHistoryAction({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UpdateMaterialHistory id={id}>
          <div className="hover:bg-gray-300 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Cập nhật
          </div>
        </UpdateMaterialHistory>
        <DeleteMaterialHistory id={id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
