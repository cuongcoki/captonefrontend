
import { Toaster } from "react-hot-toast";


import { MyDrawer } from "@/components/ui/my-drawer";

export default function Header() {

  return (
    <div className=" relative max-w-full  dark:bg-[#1c1917] h-12 flex items-center justify-between p-8 border-t rounded-md border-primary shadow-md ">
      <Toaster />
      <div className="flex items-center justify-center flex-grow">
        <MyDrawer />
      </div>
    </div>
  );
}
