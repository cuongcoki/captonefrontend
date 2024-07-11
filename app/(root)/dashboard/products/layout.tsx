"use client";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-[100vh] max-h-max">
      {children}
    </div>
  );
}
