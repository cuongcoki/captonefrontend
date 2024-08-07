"use client"
import { Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LogoIcon } from '@/constants/images/index.js'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
export default function Custom403() {
  const user= useAuth();
  const router = useRouter();
  const cnfpOptions = {
    colorlib_404_customizer_page_heading: "chúng tôi xin lỗi, trang bạn tìm không thấy !!!",
    colorlib_404_customizer_button_text: "Đi đến trang cá nhân",
    colorlib_404_customizer_button_text1: "Liên hệ với chúng tôi",
    colorlib_404_customizer_social_facebook: "https://facebook.com",
  };


  return (
    <div className="relative h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center bg-opacity-70" style={{ backgroundImage: 'url(your-background-image-url)' }}>
        <div className="absolute inset-0 bg-white "></div>
      </div>

      <div className="relative text-center">
        <div className="relative h-32">
       
          <h1 className="flex justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-black uppercase tracking-widest text-primary-backgroudPrimary">
            4<Image src={LogoIcon} width={90} height={90} alt="image logo"/>3
          </h1>
        </div>
        <h2 className="text-xl font-bold uppercase mt-5 mb-4 text-primary-backgroudPrimary">
          {cnfpOptions.colorlib_404_customizer_page_heading}
        </h2>
        <Link href={`/profile/${user?.user?.id}`} className="inline-block font-bold uppercase bg-primary-backgroudPrimary text-white rounded-full py-3 px-6 m-2 transition-opacity duration-200 hover:opacity-90 border-2 border-primary-backgroudPrimary" >
          {cnfpOptions.colorlib_404_customizer_button_text}
        </Link>
        <Link href={"/"} className="inline-block font-bold uppercase border-2 border-primary-backgroudPrimary text-primary-backgroudPrimary rounded-full py-3 px-6 m-2 transition-opacity duration-200 hover:opacity-90 hover:opacity-90">
          {cnfpOptions.colorlib_404_customizer_button_text1}
        </Link>
        <div className="mt-6">
        {cnfpOptions.colorlib_404_customizer_social_facebook && (
            <a href={cnfpOptions.colorlib_404_customizer_social_facebook} className="text-primary-backgroudPrimary inline-block h-10 w-10 leading-10 text-lg mx-2 transition-colors duration-200 hover:scale-x-110 hover:bg-white rounded-full">
             <Facebook />
            </a>
          )}
          {cnfpOptions.colorlib_404_customizer_social_facebook && (
            <a href={cnfpOptions.colorlib_404_customizer_social_facebook} className="text-primary-backgroudPrimary inline-block h-10 w-10 leading-10 text-lg mx-2 transition-colors duration-200 hover:scale-x-110 hover:bg-white rounded-full">
             <Youtube />
            </a>
          )}
        </div>
      </div>
      
      <p className="absolute bottom-0 w-full text-center py-4 text-white">
        <span>Công Ty Gia Đình</span> <a href="/" className="text-white" target="_blank" rel="noopener noreferrer">Tiến Huy</a>
      </p>
    </div>
  )
}