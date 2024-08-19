import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import storage from "./storage";
import { redirect } from 'next/navigation'
import { jwtDecode } from "jwt-decode";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CheckPermissionEnter = (dataPer: any) => {
  // const storedToken = window.localStorage.getItem("accessToken")
  // const refreshToken = localStorage.getItem("refreshToken")
  // const payload:any = jwtDecode(storedToken || '') 
  // console.log("Pyloadđ ====== ===",payload)
  // console.log("storedToken",storedToken)
  // const data = {
  //   userId: payload?.UserID,
  //   refreshToken: refreshToken
  // }
  // console.log("data",data)
  if (typeof storage !== "undefined" && typeof window !== "undefined") {
    const user = storage.getProfile();
    if (user === null) {
      {
        // window.location.href = "/sign-in";
      }
    }
    if (user?.roleId === dataPer) {
      // console.log("User has permission to enter.");
    } else {
      // console.log("User does not have permission to enter.");
      window.location.href = "/not-found";
    }
  } else {
    // console.warn(
    //   "CheckPermissionEnter: storage or window object not available"
    // );
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


export const limitLength = (text: any, maxLength: any) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};


export const formatCurrency = (value: any): string => {
  if (!value) return "";
  let valueString = value.toString();
  valueString = valueString.replace(/\D/g, "");
  valueString = valueString.replace(/^0+/, "");
  if (valueString === "") return "0";
  let reversed = valueString.split("").reverse().join("");
  let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
  let formatted = formattedReversed.split("").reverse().join("");
  return formatted;
};

export const generateRandomString = (length: number = 5) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function formatDateShort(inputDate:string) {
  if (!inputDate) {
    return inputDate; // Trả về giá trị ban đầu nếu null hoặc rỗng
  }
  const [year, month, day] = inputDate.split('-');
  return `${day}/${month}/${year}`;
}