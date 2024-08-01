import Image from "next/image";
import Link from "next/link";

import { ImageBackGround, LogoSignIn } from "@/constants/images/index.js";
import FormSignIn from "./formSignIn";

export default function SignIn() {
  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-primary-backgroudPrimary">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Image
              src={LogoSignIn}
              alt="Logo May Tre Dan Tien Huy"
              width={800}
              height={800}
            />
          </div>

          <div className="grid gap-4">
            <FormSignIn />
          </div>
          <div className="flex items-center justify-between text-secondary-backgroudPrimary">
            <Link href="/forgot-password" className="text-sm underline">
              QUÊN MẬT KHẨU
            </Link>

            <Link href="#" className=" inline-block text-sm underline">
              TRỢ GIÚP ?
            </Link>
          </div>
        </div>
      </div>
      <div className=" hidden bg-muted lg:block xs:flex item-center flex-center flex-column justify-center h-full">
        <Image
          src={ImageBackGround}
          alt="Image"
          width="4000"
          height="4000"
          className="object-fill dark:brightness-[0.2] dark:grayscale mx-auto h-full w-full"
        />
      </div>
    </div>
  );
}
