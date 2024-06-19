import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { UserUpdateFormType } from "@/schema";
import { Control, ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  formControl: Control<UserUpdateFormType> | undefined;
  name: keyof UserUpdateFormType;
  label: string;
};

function UserInput({
  name,
  field,
}: {
  name: keyof UserUpdateFormType;
  field: ControllerRenderProps<UserUpdateFormType, keyof UserUpdateFormType>;
}) {
  if (name === "id") {
    return (
      <InputOTP maxLength={12} {...field} value={String(field.value)}>
        <InputOTPGroup>
          {[...Array(12)].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  } else if (name === "gender") {
    return (
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value.toString()}
        className="flex items-start space-x-2"
      >
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="Male" />
          </FormControl>
          <FormLabel className="font-normal">Nam</FormLabel>
        </FormItem>
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="Female" />
          </FormControl>
          <FormLabel className="font-normal">Nữ</FormLabel>
        </FormItem>
      </RadioGroup>
    );
  } else if (name === "salaryByDay") {
    return <Input type="number" {...field} value={field.value as number} />;
  } else {
    return <Input type="text" {...field} value={field.value} />;
  }
}

export default function AppUserInput({ formControl, name, label }: Props) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
         
              <FormLabel className="flex items-center text-primary-backgroudPrimary">
                {label}
              </FormLabel>
            
                <FormControl>
                  <UserInput name={name} field={field} />
                </FormControl>
                <FormMessage />
            
          </FormItem>
        );
      }}
    />
  );
}
