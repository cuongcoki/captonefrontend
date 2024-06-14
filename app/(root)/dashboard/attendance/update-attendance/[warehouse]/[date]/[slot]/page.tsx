import UpdateAttendance from "@/components/shared/dashboard/attendance/update-attendance/update-attendance";
import { AttendanceDetailType } from "@/schema/attendance";
import { GetServerSideProps } from "next";
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
        phaseID: "P1",
        phaseName: "Pha 1",
        quantity: "10",
        image: "https://example.com/product1.jpg",
      },
      {
        productID: "2",
        productName: "Sản phẩm B",
        phaseID: "P2",
        phaseName: "Pha 2",
        quantity: "20",
        image: "https://example.com/product2.jpg",
      },
      {
        productID: "3",
        productName: "Sản phẩm C",
        phaseID: "P1",
        phaseName: "Pha 1",
        quantity: "10",
        image: "https://example.com/product3.jpg",
      },
      {
        productID: "4",
        productName: "Sản phẩm D",
        phaseID: "P2",
        phaseName: "Pha 2",
        quantity: "20",
        image: "https://example.com/product4.jpg",
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
    userName: "Tran Van Huy",
    userID: "5334567329014",
    products: [],
    isAttendance: "true",
    hourOverTime: "1",
    isSalaryByProduct: "false",
    isManufacture: "false",
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
        phaseID: "P2",
        phaseName: "Pha 2",
        quantity: "7",
        image: "https://example.com/product5.jpg",
      },
      {
        productID: "6",
        productName: "Sản phẩm F",
        phaseID: "P4",
        phaseName: "Pha 4",
        quantity: "12",
        image: "https://example.com/product6.jpg",
      },
    ],
    isAttendance: "true",
    hourOverTime: "1",
    isSalaryByProduct: "false",
    isManufacture: "true",
  },

  // Add more data as needed
];

const getDate = async (): Promise<AttendanceDetailType[]> => {
  return fakeDate;
};

export default async function page({
  params,
}: {
  params: { warehouse: string; date: string; slot: string };
}) {
  return (
    <>
      <UpdateAttendance
        data={fakeDate}
        date={params.date}
        slot={params.slot}
        warehouseID={params.warehouse}
      />
    </>
  );
}
