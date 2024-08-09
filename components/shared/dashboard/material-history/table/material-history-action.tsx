import { DeleteMaterialHistory } from "@/components/shared/dashboard/material-history/delete-material-history/delete-material-history";
import UpdateMaterialHistory from "@/components/shared/dashboard/material-history/update-material-history/update-material-history";
import {
  DropdownMenu,
  DropdownMenuContent,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, {useRef, useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function MaterialHistoryAction({
  idMaterialHistory,
}: {
  idMaterialHistory: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpenUpdateDialog = () => {
    document.getElementById(idMaterialHistory)?.click();
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <button className="focus:outline-none">
            <DotsHorizontalIcon className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={5}>
          <div
            onClick={handleOpenUpdateDialog}
            className="hover:bg-gray-300 relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
          >
            Cập nhật
          </div>
          <DropdownMenuSeparator />
          <DeleteMaterialHistory id={idMaterialHistory} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
