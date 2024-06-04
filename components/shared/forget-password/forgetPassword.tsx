import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { LogoSignIn } from '@/constants/images/index.js'

export default function ForgetPassword() {
    return (
        <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-primary-backgroudPrimary">
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <Image src={LogoSignIn} alt="Logo May Tre Dan Tien Huy" width={800} height={800} />
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2 text-secondary-backgroudPrimary">
                        <Label htmlFor="email">NHẬP SỐ ĐIỆN THOẠI</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                        />
                    </div>
                   
                    <Button type="submit" className="w-full bg-secondary-backgroudPrimary text-primary-backgroudPrimary hover:bg-yellow-300">
                        GỬI MÃ XÁC NHẬN
                    </Button>

                </div>
                <div className="flex items-center justify-between text-secondary-backgroudPrimary">
                    <Link
                        href="/sign-in"
                        className="text-sm underline"
                    >
                        QUAY LẠI ĐĂNG NHẬP
                    </Link>
                    
                    <Link
                        href="/#"
                        className=" inline-block text-sm underline"
                    >
                        TRỢ GIÚP ?
                    </Link>
                </div>
            </div>
        </div>
        <div className="hidden bg-muted lg:block">
            <Image
                src="/placeholder.svg"
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
        </div>
    </div>
    );
}