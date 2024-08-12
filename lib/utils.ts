import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import storage from "./storage";
import { redirect } from 'next/navigation'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CheckPermissionEnter = (dataPer: any) => {
  if (typeof storage !== "undefined" && typeof window !== "undefined") {
    const user = storage.getProfile();
    if (user === null) {
      {
        // window.location.href = "/sign-in";
      }
    }
    if (user.roleId === dataPer) {
      // console.log("User has permission to enter.");
    } else {
      console.log("User does not have permission to enter.");
      window.location.href = "/not-found";
    }
  } else {
    console.warn(
      "CheckPermissionEnter: storage or window object not available"
    );
  }
};

export const CheckLogin = () => {
  if (typeof storage !== "undefined" && typeof window !== "undefined") {
    const token = storage.getProfile();

    if(token !== null){
      redirect(`/profile/${token.id}`)
    }
   
  } else {
    // console.warn(
    //   "đã đăng nhập"
    // );
  }
}

export function formatDate(inputDate: string): string {
  const parts = inputDate.split("-");

  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}
