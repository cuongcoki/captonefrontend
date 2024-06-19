import Image from "next/image";
import { LogoIcon } from '@/constants/images/index.js'
export default function Page() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Image src={LogoIcon} width={50} height={50} alt="loading page" className="animate-spin"/>
        </div>
    );
}