"use client"
import SignIn from "@/components/shared/sign-in/signIn";
import { CheckLogin } from "@/lib/utils";
import { useEffect } from "react";


export default function SignInPage() {
    useEffect(()=>{
        CheckLogin()
    },[])
    return (
         <SignIn />
    );
}