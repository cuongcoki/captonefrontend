"use client";

import HeaderComponent from "@/components/shared/common/header";

// ** React Imports

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <section>
            <HeaderComponent
                title="Xem điểm danh"
                description="Chi tiết thông tin điểm danh của nhân viên"
            />
            {children}
        </section>
    );
}