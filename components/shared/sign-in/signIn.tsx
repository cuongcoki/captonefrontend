import Image from "next/image"
import Link from "next/link"

import { LogoSignIn } from '@/constants/images/index.js'
import FormSignIn from "./formSignIn"

export default function SignIn() {
    return (
        <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-primary-backgroudPrimary">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Image src={LogoSignIn} alt="Logo May Tre Dan Tien Huy" width={800} height={800} />
                    </div>
                   
                    <div className="grid gap-4">
                        {/* <div className="grid gap-2 text-secondary-backgroudPrimary">
                            <Label htmlFor="email">Tài Khoản</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center text-secondary-backgroudPrimary">
                                <Label htmlFor="password">Mật Khẩu</Label>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-secondary-backgroudPrimary text-primary-backgroudPrimary hover:bg-yellow-300">
                            Đăng Nhập
                        </Button> */}
                        <FormSignIn />

                    </div>
                    <div className="flex items-center justify-between text-secondary-backgroudPrimary">
                        <Link
                            href="/forgot-password"
                            className="text-sm underline"
                        >
                            QUÊN MẬT KHẨU
                        </Link>
                        
                        <Link
                            href="#"
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