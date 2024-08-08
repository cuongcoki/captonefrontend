"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";

interface DatePickerProps {
  name: string;
  form?: UseFormReturn<any>;
  title: string;
  className?: string;
  [key: string]: any;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ title, className, name, form, ...props }, ref) => {
    const [date, setDate] = React.useState<Date>();

    const dateFromForm = form?.getValues(name);

    React.useEffect(() => {
      if (dateFromForm) {
        setDate(parse(dateFromForm, "dd/MM/yyyy", new Date()));
      }
    }, [dateFromForm]);

    React.useEffect(() => {
      if (form !== undefined && name && date)
        form.setValue(name, format(date, "dd/MM/yyyy"));
      form?.trigger(name);
    }, [date, name, form]);

    return (
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              ),
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>{title}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={setDate}
            initialFocus
            {...props}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
