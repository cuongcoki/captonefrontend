"use client";

import Custom403 from "@/app/403";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const params = useParams<{ id: string }>();
    const user = useAuth();
    useEffect(() => {
    }, [params.id, user.user?.id])
   
    return (
        <div className="flex-center min-h-screen w-full bg-primary-50 bg-dotted-pattern bg-cover bg-fixed bg-center">
            {
                user?.user?.id === params.id ? (
                    <span>{children}</span>
                ):(
                    <Custom403 />
                )
            }
        </div >
    );
}