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

import React, { useEffect, useRef, useState } from "react";
import UpdateMaterialHistoryForm from "../update-material-history/update-material-history-form";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function MaterialHistoryAction({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="focus:outline-none">
        <DotsHorizontalIcon className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1917] rounded-md shadow-lg z-50">
          <div className="p-2">
            <UpdateMaterialHistoryForm id={id}>
              <div className="hover:bg-gray-300 relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                Cập nhật
              </div>
            </UpdateMaterialHistoryForm>
            <DeleteMaterialHistory id={id} />
          </div>
        </div>
      )}
    </div>
  );
}
