import ContentHomePage from "./ContentHome";

export default function HomePage() {
    return (
        <div className="w-full h-full overflow-auto">
            <div className="bg-white h-full">
                <div className="flex items-center gap-4 p-3">
                    <div className="avatar rounded-full min-h-8 min-w-8 bg-blue-500 text-white font-[700] flex items-center justify-center">
                        <p>TDC</p>
                    </div>
                    <div className="font-medium dark:text-white">
                        <div className="text-2xl">xin chào chủ tịch cương</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">cuong</div>
                    </div>
                </div>
                <ContentHomePage />
            </div>

            <div className="bg-white mt-2 overflow-auto h-full">
                
            </div>
        </div>
    );
}