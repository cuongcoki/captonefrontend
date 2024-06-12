import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
    return (
        <div className="flex items-start justify-between ">
            <div className="sticky  hidden lg:flex  min-h-screen  top-0">
                <Skeleton className="relative min-w-[80px] border-r px-3 pb-`0" />
            </div>
            <main className={`flex-1 bg-slate-100  transition-all duration-300 grid w-full h-full`}>
                <div className="sticky top-0 z-10">
                    <Skeleton className="bg-slate-100 h-12 flex items-center justify-between p-8 border-b border-slate-300 shadow-md" />
                </div>
                <div className="p-2 overflow-auto">
                    <Skeleton className="h-full w-full" />
                </div>
            </main>
        </div>
    );
}