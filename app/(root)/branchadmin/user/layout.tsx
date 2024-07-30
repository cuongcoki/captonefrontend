import HeaderComponent from "@/components/shared/common/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <HeaderComponent
        title="Danh sách nhân viên"
        description="Danh sách nhân viên trong công ty."
      />
      {children}
    </div>
  );
}
