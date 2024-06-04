import { Employee, columns } from "./Column"
import { DataTable } from "./DataTable"

async function getData(): Promise<Employee[]> {
  // Fetch data from your API here.
  return [
    {
      EmployeeID: "EMP001",
      FirstName: "John",
      LastName: "Doe",
      Gender: "Male",
      Address: "123 Main Street, ",
      SalaryByDay: 100,
      Phone: "555-1234",
      Password: "password123",
      Role: 1,
      CreatedBy: "Admin",
      SalaryOT: 150,
      FacilityID: 1,
      IsActive: true,
    },

    {
      EmployeeID: "EMP001",
      FirstName: "nnnnn",
      LastName: "Doe",
      Gender: "Female",
      Address: "123 Main Street, ",
      SalaryByDay: 100,
      Phone: "555-1234",
      Password: "password123",
      Role: 1,
      CreatedBy: "Admin",
      SalaryOT: 150,
      FacilityID: 1,
      IsActive: true,
    },
    {
      EmployeeID: "EMP001",
      FirstName: "jjjjjj",
      LastName: "Doe",
      Gender: "Female",
      Address: "123 Main Street, ",
      SalaryByDay: 100,
      Phone: "555-1234",
      Password: "password123",
      Role: 1,
      CreatedBy: "Admin",
      SalaryOT: 150,
      FacilityID: 1,
      IsActive: true,
    },
    {
      EmployeeID: "EMP001",
      FirstName: "John",
      LastName: "Doe",
      Gender: "Male",
      Address: "123 Main Street, ",
      SalaryByDay: 100,
      Phone: "555-1234",
      Password: "password123",
      Role: 1,
      CreatedBy: "Admin",
      SalaryOT: 150,
      FacilityID: 1,
      IsActive: true,
    },
    {
      EmployeeID: "EMP001",
      FirstName: "John",
      LastName: "Doe",
      Gender: "Female",
      Address: "123 Main Street, ",
      SalaryByDay: 100,
      Phone: "555-1234",
      Password: "password123",
      Role: 1,
      CreatedBy: "Admin",
      SalaryOT: 150,
      FacilityID: 1,
      IsActive: true,
    }

    // ...
  ]
}

export default async function RenderTableUsers() {
  const data = await getData()

  return (
    <div className="px-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
