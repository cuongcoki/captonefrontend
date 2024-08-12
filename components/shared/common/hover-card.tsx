"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


export default function HoverComponent({ children,Num }: { children: any,Num:any }) {
    const limitLength = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };
    return (
        <HoverCard>
            <HoverCardTrigger>{limitLength(String(children), Num)}</HoverCardTrigger>
            <HoverCardContent>
                {children}
            </HoverCardContent>
        </HoverCard>
    );
}