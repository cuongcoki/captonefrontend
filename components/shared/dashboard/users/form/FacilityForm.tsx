"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { RoleSchema } from "@/schema";

import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator";

export default function FacilityForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(RoleSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit = (data: z.infer<typeof RoleSchema>) => {
        setLoading(true);
        console.log(data);
    };

    const { pending } = useFormStatus();
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-md w-full flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Tên cơ sở</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel className="flex items-center  text-primary-backgroudPrimary">Địa chỉ cơ sở</FormLabel>
                                <FormControl>
                                    <Textarea 
                                     {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <Separator className="h-1"/>
                <FormLabel className="flex items-center "></FormLabel>
                <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" disabled={pending}>
                    {loading ? "Loading..." : "GỬI"}
                </Button>
            </form>
        </Form>
    );
}