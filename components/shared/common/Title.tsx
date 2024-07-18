import { CardTitle } from "@/components/ui/card";
import React from "react";

export default function TitleComponent({
    title, description
}: {
    title: string;
    description: string;
}) {
    return (
        <>
            <div>
                <CardTitle className="text-primary">{title}</CardTitle>
                <span className="text-xs font-normal leading-snug text-muted-foreground">{description}</span>
            </div>
        </>
    );
}
