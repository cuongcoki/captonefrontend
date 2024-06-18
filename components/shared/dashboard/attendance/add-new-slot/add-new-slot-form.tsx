import { columnsForAttendanceForm } from "@/components/shared/dashboard/attendance/add-new-slot/table/colums";
import { DataTableForAttendanceForm } from "@/components/shared/dashboard/attendance/add-new-slot/table/data-table";

export default function AddNewAttendanceSlotForm() {
  return (
    <div>
      <DataTableForAttendanceForm columns={columnsForAttendanceForm} />
    </div>
  );
}
