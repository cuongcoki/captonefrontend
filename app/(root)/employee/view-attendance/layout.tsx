"use client";

import HeaderComponent from "@/components/shared/common/header";

// ** React Imports

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <section>
            <HeaderComponent
                title="Xem điểm danh"
                description="Lịch điểm danh - chấm công của nhân viên."
            />
            {children}
        </section>
    );
}