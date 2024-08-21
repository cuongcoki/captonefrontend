"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import LoadingDashboard from "./loading";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
    const user = useAuth();
    console.log("user",user)
    useEffect(() => {
        if (user.user === null) {
            redirect(`/sign-in`);
        } else {
            redirect(`/profile/${user.user?.id}`);
        }
    }, [user]);

    return (
        <div>
            <LoadingDashboard />
        </div>
    );
}
