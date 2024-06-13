import UpdateAttendance from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
import { AttendanceDetailType } from "@/schema/attendance";
import React from "react";

const fakeDate: AttendanceDetailType[] = [
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Nguyen Quang Vinh",
    userID: "123456789012",
    products: [
      {
        productID: "1",
        productName: "Sản phẩm A",
        phaseName: "Pha 1",
        quantity: "10",
      },
      {
        productID: "2",
        productName: "Sản phẩm B",
        phaseName: "Pha 2",
        quantity: "20",
      },
      {
        productID: "3",
        productName: "Sản phẩm C",
        phaseName: "Pha 1",
        quantity: "10",
      },
      {
        productID: "4",
        productName: "Sản phẩm D",
        phaseName: "Pha 2",
        quantity: "20",
      },
    ],
    isAttendance: "true",
    hourOverTime: "1.5",
    isSalaryByProduct: "true",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Le Thi Thanh",
    userID: "123456789013",
    products: [],
    isAttendance: "false",
    hourOverTime: "2",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Tran Van Bao",
    userID: "123456789014",
    products: [
      {
        productID: "5",
        productName: "Sản phẩm E",
        phaseName: "Pha 2",
        quantity: "7",
      },
      {
        productID: "6",
        productName: "Sản phẩm F",
        phaseName: "Pha 4",
        quantity: "12",
      },
    ],
    isAttendance: "true",
    hourOverTime: "1",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Pham Thi Nga",
    userID: "123456789015",
    products: [],
    isAttendance: "false",
    hourOverTime: "3",
    isSalaryByProduct: "true",
    isManufacture: "false",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Nguyen Van An",
    userID: "123456789016",
    products: [
      {
        productID: "9",
        productName: "Sản phẩm I",
        phaseName: "Pha 2",
        quantity: "18",
      },
      {
        productID: "10",
        productName: "Sản phẩm J",
        phaseName: "Pha 4",
        quantity: "11",
      },
    ],
    isAttendance: "true",
    hourOverTime: "1.2",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Tran Thi Mai",
    userID: "123456789017",
    products: [],
    isAttendance: "false",
    hourOverTime: "2.5",
    isSalaryByProduct: "true",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Do Van Thanh",
    userID: "123456789018",
    products: [
      {
        productID: "13",
        productName: "Sản phẩm M",
        phaseName: "Pha 4",
        quantity: "20",
      },
      {
        productID: "14",
        productName: "Sản phẩm N",
        phaseName: "Pha 2",
        quantity: "17",
      },
    ],
    isAttendance: "true",
    hourOverTime: "1.8",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Nguyen Thi Ha",
    userID: "123456789019",
    products: [],
    isAttendance: "true",
    hourOverTime: "2",
    isSalaryByProduct: "true",
    isManufacture: "false",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Pham Van Minh",
    userID: "123456789020",
    products: [],
    isAttendance: "false",
    hourOverTime: "3.5",
    isSalaryByProduct: "true",
    isManufacture: "true",
  },
  {
    image:
      "https://st.quantrimang.com/photos/image/2017/04/08/anh-dai-dien-FB-200.jpg",
    userName: "Tran Thi Lan",
    userID: "123456789021",
    products: [],
    isAttendance: "true",
    hourOverTime: "1.7",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },
];

const getDate = async (): Promise<AttendanceDetailType[]> => {
  return fakeDate;
};

export default async function page() {
  const data = await getDate();
  return (
    <>
      <UpdateAttendance data={data} />
    </>
  );
}
