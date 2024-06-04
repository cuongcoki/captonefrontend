
import UserPage from "@/components/shared/dashboard/users/User";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full">
            <UserPage />
            {children}
        </div>
    );
}