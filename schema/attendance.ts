"use client";

import exp from "constants";
import { X } from "lucide-react";
import { describe } from "node:test";
import { list } from "postcss";
import { date, z } from "zod";

export const attendanceSchema = z.object({
  date: z.string(),
  slotID: z.string(),
  userID: z.string(),
  fullName: z.string(),
  isAttendance: z.string(),
  hourOverTime: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "HourOverTime must be a number greater than 0",
    }
  ),
  isSalaryByProduct: z.string(),
  isManufacture: z.string(),
});

export type attendanceType = z.infer<typeof attendanceSchema>;

export const attendanceProductSchema = z.object({
  date: z.string(),
  slotID: z.string(),
  userID: z.string(),
  fullName: z.string(),
  productID: z.string(),
  productName: z.string(),
  phaseID: z.string(),
  phaseName: z.string(),
  quantity: z.string(),
});

export type attendanceProductType = z.infer<typeof attendanceProductSchema>;

// export const attendanceHomeSchema = z.object({
//   date: z.string(),
//   morning: z.array(attendanceDetailSchema),
//   afternoon: z.array(attendanceDetailSchema),
//   overtime: z.array(attendanceDetailSchema),
// });

export const slotDetailSchema = z.object({
  slotID: z.string(),
  present: z.string(),
  totalUser: z.string(),
  totalProduct: z.string(),
  overTime: z.string(),
});

export const attendanceHomeSchema = z.object({
  date: z.string(),
  wareHouse: z.string(),
  wareHouseId: z.string(),
  slots: z.array(slotDetailSchema),
});

export type attendanceHomeType = z.infer<typeof attendanceHomeSchema>;

//------------------------------FOR ATTENDANCE FORM -----------------------------------------------
export const AttendanceFormEmployeeSchema = z.object({
  userID: z.string(),
  userName: z.string(),
  image: z.string(),
});

export type AttendanceFormEmployeeType = z.infer<
  typeof AttendanceFormEmployeeSchema
>;

export const AttendanceEmployeSchema = z.object({
  userID: z.string(),
  image: z.string(),
  isSalaryByProduct: z.string(),
  isManufacture: z.string(),
});

export const AddNewAttendanceSlotSchema = z.object({
  listEmployee: z.array(AttendanceEmployeSchema),
});

export type AddNewAttendanceSlotType = z.infer<
  typeof AddNewAttendanceSlotSchema
>;
//------------------------------- FOR UPDATE ATTENDANCE --------------------------------------------

export const AttendanceDetailProductSchema = z.object({
  productID: z.string(),
  productName: z.string(),
  image: z.string(),
  phaseID: z.string(),
  phaseName: z.string(),
  quantity: z.string(),
});

export type AttendanceDetailProductType = z.infer<
  typeof AttendanceDetailProductSchema
>;

export const AttendanceDetailSchema = z.object({
  image: z.string(),
  userName: z.string(),
  userID: z.string(),
  products: z.array(AttendanceDetailProductSchema),
  isAttendance: z.string(),
  hourOverTime: z.string().refine(
    (value) => {
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    },
    {
      message: "HourOverTime must be a number greater than 0",
    }
  ),
  isSalaryByProduct: z.string(),
  isManufacture: z.string(),
});

export type AttendanceDetailType = z.infer<typeof AttendanceDetailSchema>;
