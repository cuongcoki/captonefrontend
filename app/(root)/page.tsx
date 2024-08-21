"use client"
import { useRouter } from "next/navigation";
import LoadingDashboard from "./loading";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
    const user = useAuth();
    const router = useRouter();
    if (user) {
        router.push(`/profile/${user.user?.id}`);
    }
    return (
        <div><LoadingDashboard /></div>
    );
}
