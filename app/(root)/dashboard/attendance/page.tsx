import { columnsForAttendance } from "@/components/shared/dashboard/attendance/table/colums";
import { DataTableForAttendance } from "@/components/shared/dashboard/attendance/table/data-table";
import { Card } from "@/components/ui/card";
import {
  attendanceHomeType,
  attendanceProductType,
  attendanceType,
} from "@/schema/attendance";
import React from "react";

// const fakeDataAttendance: attendanceType[] = [
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "2",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "3",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "4",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "1",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "2",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "5",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "3",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "6",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "1",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "2",
//     isSalaryByProduct: "false",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "4",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "3",
//     isSalaryByProduct: "false",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "6",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "2",
//     isSalaryByProduct: "false",
//     isManufacture: "false",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "5",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },

//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "4",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "3",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "1",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "5",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "2",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "6",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "3",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "4",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "1",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "2",
//     isSalaryByProduct: "true",
//     isManufacture: "false",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "5",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "3",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "6",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     isAttendance: "false",
//     hourOverTime: "2",
//     isSalaryByProduct: "true",
//     isManufacture: "true",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     isAttendance: "true",
//     hourOverTime: "4",
//     isSalaryByProduct: "false",
//     isManufacture: "true",
//   },
// ];

// const fakeDateProduct: attendanceProductType[] = [
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     product: { productID: "P1", productName: "ProductA" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "20",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     product: { productID: "P2", productName: "ProductB" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "30",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     product: { productID: "P3", productName: "ProductC" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "40",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     product: { productID: "P4", productName: "ProductD" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "50",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     product: { productID: "P5", productName: "ProductE" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "60",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     product: { productID: "P6", productName: "ProductF" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "70",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     product: { productID: "P7", productName: "ProductG" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "80",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     product: { productID: "P8", productName: "ProductH" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "90",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     product: { productID: "P9", productName: "ProductI" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "100",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     product: { productID: "P10", productName: "ProductJ" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "110",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     product: { productID: "P1", productName: "ProductA" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "120",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     product: { productID: "P2", productName: "ProductB" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "130",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     product: { productID: "P3", productName: "ProductC" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "140",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     product: { productID: "P4", productName: "ProductD" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "150",
//   },
//   {
//     date: "10/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     product: { productID: "P5", productName: "ProductE" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "160",
//   },

//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     product: { productID: "P6", productName: "ProductF" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "170",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     product: { productID: "P7", productName: "ProductG" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "180",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     product: { productID: "P8", productName: "ProductH" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "190",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     product: { productID: "P9", productName: "ProductI" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "200",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     product: { productID: "P10", productName: "ProductJ" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "210",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "1",
//       employeeName: "John Doe",
//       image: "https://example.com/image1.jpg",
//     },
//     product: { productID: "P1", productName: "ProductA" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "220",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "2",
//       employeeName: "Jane Smith",
//       image: "https://example.com/image2.jpg",
//     },
//     product: { productID: "P2", productName: "ProductB" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "230",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "3",
//       employeeName: "Alice Johnson",
//       image: "https://example.com/image3.jpg",
//     },
//     product: { productID: "P3", productName: "ProductC" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "240",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "4",
//       employeeName: "Bob Brown",
//       image: "https://example.com/image4.jpg",
//     },
//     product: { productID: "P4", productName: "ProductD" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "250",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "5",
//       employeeName: "Charlie Davis",
//       image: "https://example.com/image5.jpg",
//     },
//     product: { productID: "P5", productName: "ProductE" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "260",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "6",
//       employeeName: "Diana Evans",
//       image: "https://example.com/image6.jpg",
//     },
//     product: { productID: "P6", productName: "ProductF" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "270",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "7",
//       employeeName: "Eve Foster",
//       image: "https://example.com/image7.jpg",
//     },
//     product: { productID: "P7", productName: "ProductG" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "280",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "1",
//     employee: {
//       employeeID: "8",
//       employeeName: "Frank Green",
//       image: "https://example.com/image8.jpg",
//     },
//     product: { productID: "P8", productName: "ProductH" },
//     phase: { phaseID: "PH1", phaseName: "Phase1" },
//     quantity: "290",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "2",
//     employee: {
//       employeeID: "9",
//       employeeName: "Grace Harris",
//       image: "https://example.com/image9.jpg",
//     },
//     product: { productID: "P9", productName: "ProductI" },
//     phase: { phaseID: "PH2", phaseName: "Phase2" },
//     quantity: "300",
//   },
//   {
//     date: "09/06/2024",
//     slotID: "3",
//     employee: {
//       employeeID: "10",
//       employeeName: "Henry Adams",
//       image: "https://example.com/image10.jpg",
//     },
//     product: { productID: "P10", productName: "ProductJ" },
//     phase: { phaseID: "PH3", phaseName: "Phase3" },
//     quantity: "310",
//   },
// ];

// const transformData = async (
//   attendanceData: attendanceType[],
//   attendanceProductData: attendanceProductType[]
// ): Promise<attendanceHomeType[]> => {
//   const groupedData: Record<
//     string,
//     {
//       morning: attendanceDetailType[];
//       afternoon: attendanceDetailType[];
//       overtime: attendanceDetailType[];
//     }
//   > = {};

//   attendanceData.forEach((record) => {
//     const { date, slotID } = record;
//     if (!groupedData[date]) {
//       groupedData[date] = { morning: [], afternoon: [], overtime: [] };
//     }

//     if (slotID === "1") {
//       groupedData[date].morning.push({
//         image: record.employee.image,
//         employeeName: record.employee.employeeName,
//         employeeID: record.employee.employeeID,
//         products: [],
//         isAttendance: record.isAttendance,
//         hourOverTime: record.hourOverTime,
//         isSalaryByProduct: record.isSalaryByProduct,
//         isManufacture: record.isManufacture,
//       });
//     } else if (slotID === "2") {
//       groupedData[date].afternoon.push({
//         image: record.employee.image,
//         employeeName: record.employee.employeeName,
//         employeeID: record.employee.employeeID,
//         products: [],
//         isAttendance: record.isAttendance,
//         hourOverTime: record.hourOverTime,
//         isSalaryByProduct: record.isSalaryByProduct,
//         isManufacture: record.isManufacture,
//       });
//     } else if (slotID === "3") {
//       groupedData[date].overtime.push({
//         image: record.employee.image,
//         employeeName: record.employee.employeeName,
//         employeeID: record.employee.employeeID,
//         products: [],
//         isAttendance: record.isAttendance,
//         hourOverTime: record.hourOverTime,
//         isSalaryByProduct: record.isSalaryByProduct,
//         isManufacture: record.isManufacture,
//       });
//     }
//   });

//   attendanceProductData.forEach((record) => {
//     const { date, slotID, employee, product, phase, quantity } = record;
//     if (!groupedData[date]) {
//       groupedData[date] = { morning: [], afternoon: [], overtime: [] };
//     }

//     const slotArray =
//       slotID === "1"
//         ? groupedData[date].morning
//         : slotID === "2"
//         ? groupedData[date].afternoon
//         : groupedData[date].overtime;

//     const detailRecord = slotArray.find(
//       (detail) => detail.employeeID === employee.employeeID
//     );

//     if (detailRecord) {
//       detailRecord.products.push({
//         productID: product.productID,
//         productName: product.productName,
//         phaseName: phase.phaseName,
//         quantity,
//       });
//     } else {
//       slotArray.push({
//         image: employee.image,
//         employeeName: employee.employeeName,
//         employeeID: employee.employeeID,
//         products: [
//           {
//             productID: product.productID,
//             productName: product.productName,
//             phaseName: phase.phaseName,
//             quantity,
//           },
//         ],
//         isAttendance: "false",
//         hourOverTime: "0",
//         isSalaryByProduct: "false",
//         isManufacture: "false",
//       });
//     }
//   });

//   return Object.keys(groupedData).map((date) => ({
//     date,
//     morning: groupedData[date].morning,
//     afternoon: groupedData[date].afternoon,
//     overtime: groupedData[date].overtime,
//   }));
// };

// const getDataAttendance = async (): Promise<attendanceType[]> => {
//   return fakeDataAttendance;
// };

// const getDataProduct = async (): Promise<attendanceProductType[]> => {
//   return fakeDateProduct;
// };

const fakeAttendanceHomeData = [
  {
    date: "10/06/2024",
    slots: [
      {
        slotID: "1",
        present: "8",
        totalUser: "10",
        totalProduct: "150",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "9",
        totalUser: "10",
        totalProduct: "160",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "10",
        totalUser: "10",
        totalProduct: "170",
        overTime: "40",
      },
    ],
  },
  {
    date: "09/06/2024",
    slots: [
      {
        slotID: "1",
        present: "7",
        totalUser: "10",
        totalProduct: "140",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "8",
        totalUser: "10",
        totalProduct: "150",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "6",
        totalUser: "10",
        totalProduct: "160",
        overTime: "30",
      },
    ],
  },
  {
    date: "08/06/2024",
    slots: [
      {
        slotID: "1",
        present: "6",
        totalUser: "10",
        totalProduct: "130",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "5",
        totalUser: "10",
        totalProduct: "140",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "7",
        totalUser: "10",
        totalProduct: "150",
        overTime: "20",
      },
    ],
  },
  {
    date: "07/06/2024",
    slots: [
      {
        slotID: "1",
        present: "8",
        totalUser: "10",
        totalProduct: "160",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "7",
        totalUser: "10",
        totalProduct: "170",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "9",
        totalUser: "10",
        totalProduct: "180",
        overTime: "10",
      },
    ],
  },
  {
    date: "06/06/2024",
    slots: [
      {
        slotID: "1",
        present: "7",
        totalUser: "10",
        totalProduct: "150",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "8",
        totalUser: "10",
        totalProduct: "160",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "6",
        totalUser: "10",
        totalProduct: "170",
        overTime: "5",
      },
    ],
  },
  {
    date: "05/06/2024",
    slots: [
      {
        slotID: "1",
        present: "8",
        totalUser: "10",
        totalProduct: "170",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "9",
        totalUser: "10",
        totalProduct: "180",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "7",
        totalUser: "10",
        totalProduct: "190",
        overTime: "8",
      },
    ],
  },
  {
    date: "04/06/2024",
    slots: [
      {
        slotID: "1",
        present: "7",
        totalUser: "10",
        totalProduct: "160",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "8",
        totalUser: "10",
        totalProduct: "170",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "6",
        totalUser: "10",
        totalProduct: "180",
        overTime: "6",
      },
    ],
  },
  {
    date: "03/06/2024",
    slots: [
      {
        slotID: "1",
        present: "8",
        totalUser: "10",
        totalProduct: "180",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "9",
        totalUser: "10",
        totalProduct: "190",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "7",
        totalUser: "10",
        totalProduct: "200",
        overTime: "12",
      },
    ],
  },
  {
    date: "02/06/2024",
    slots: [
      {
        slotID: "1",
        present: "7",
        totalUser: "10",
        totalProduct: "170",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "8",
        totalUser: "10",
        totalProduct: "180",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "6",
        totalUser: "10",
        totalProduct: "190",
        overTime: "9",
      },
    ],
  },
  {
    date: "01/06/2024",
    slots: [
      {
        slotID: "1",
        present: "8",
        totalUser: "10",
        totalProduct: "190",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "9",
        totalUser: "10",
        totalProduct: "200",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "7",
        totalUser: "10",
        totalProduct: "210",
        overTime: "11",
      },
    ],
  },
  {
    date: "31/05/2024",
    slots: [
      {
        slotID: "1",
        present: "7",
        totalUser: "10",
        totalProduct: "180",
        overTime: "0",
      },
      {
        slotID: "2",
        present: "8",
        totalUser: "10",
        totalProduct: "190",
        overTime: "0",
      },
      {
        slotID: "3",
        present: "6",
        totalUser: "10",
        totalProduct: "200",
        overTime: "7",
      },
    ],
  },
];

async function getData(): Promise<attendanceHomeType[]> {
  return fakeAttendanceHomeData;
}

export default async function page() {
  // const data = await transformData(fakeDataAttendance, fakeDateProduct);
  const data = await getData();

  // console.log("DATA FROM ATTENDANCE: data =", data);
  return (
    <>
      <Card className="p-3">
        <DataTableForAttendance columns={columnsForAttendance} data={data} />
      </Card>
    </>
  );
}
