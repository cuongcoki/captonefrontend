import { columnsForAttendanceForm } from "@/components/shared/dashboard/attendance/add-new-slot/table/colums";
import { DataTableForAttendanceForm } from "@/components/shared/dashboard/attendance/add-new-slot/table/data-table";
import { AttendanceFormEmployeeType } from "@/schema/attendance";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const fakeAttendanceFormEmployeeData: AttendanceFormEmployeeType[] = [
  {
    userID: "1",
    userName: "Nguyen Van A",
    image: "https://example.com/image1.jpg",
  },
  {
    userID: "2",
    userName: "Tran Thi B",
    image: "https://example.com/image2.jpg",
  },
  {
    userID: "3",
    userName: "Le Van C",
    image: "https://example.com/image3.jpg",
  },
  {
    userID: "4",
    userName: "Pham Thi D",
    image: "https://example.com/image4.jpg",
  },
  {
    userID: "5",
    userName: "Hoang Van E",
    image: "https://example.com/image5.jpg",
  },
  {
    userID: "6",
    userName: "Do Thi F",
    image: "https://example.com/image6.jpg",
  },
  {
    userID: "7",
    userName: "Bui Van G",
    image: "https://example.com/image7.jpg",
  },
  {
    userID: "8",
    userName: "Dang Thi H",
    image: "https://example.com/image8.jpg",
  },
  {
    userID: "9",
    userName: "Nguyen Van I",
    image: "https://example.com/image9.jpg",
  },
  {
    userID: "10",
    userName: "Le Thi J",
    image: "https://example.com/image10.jpg",
  },
  {
    userID: "11",
    userName: "Pham Van K",
    image: "https://example.com/image11.jpg",
  },
  {
    userID: "12",
    userName: "Tran Thi L",
    image: "https://example.com/image12.jpg",
  },
];
export default function AddNewAttendanceSlotForm() {
  const [data, setData] = useState<AttendanceFormEmployeeType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      return fakeAttendanceFormEmployeeData;
    };
    setData(fakeAttendanceFormEmployeeData);
  }, []);

  return (
    <div>
      <DataTableForAttendanceForm
        columns={columnsForAttendanceForm}
        data={data}
      />
    </div>
  );
}
