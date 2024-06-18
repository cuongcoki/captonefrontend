"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { set } from "date-fns";

export type ComboboxDataType = {
  value: string;
  label: string;
};

export function ComboboxForForm({
  title,
  data,
  name,
  form,
}: {
  title: string;
  data: ComboboxDataType[];
  name: string;
  form: UseFormReturn<any>;
}) {
  const materialID = form.getValues(name);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(String(materialID));

  React.useEffect(() => {
    setValue(String(materialID));
  }, [materialID]);

  React.useEffect(() => {
    console.log("Value in combobox: ", value);
  }, [value]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((component) => component.value == value)?.label
            : title}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search component..." className="h-9" />
          <CommandList>
            <CommandEmpty>No component found.</CommandEmpty>
            <CommandGroup>
              {data.map((component) => (
                <CommandItem
                  key={component.value}
                  value={component.label}
                  onSelect={(currentValue) => {
                    // setValue(currentValue === value ? "" : currentValue);
                    form.setValue(name, String(component.value));
                    setOpen(false);
                  }}
                >
                  {component.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === component.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
