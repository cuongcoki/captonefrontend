import { Roles, columns } from "./Column"
import { DataTable } from "./DataTable"

async function getData(): Promise<Roles[]> {
  // Fetch data from your API here.
  return [
    {
      id: "000000001",
      title: "Admin",
      description: "lam cai d gi cung dc",
    },
    {
      id: "000000002",
      title: "User",
      description: "m chi la thang nhan vien",
    },

    // ...
  ]
}

export default async function RenderTableRoles() {
  const data = await getData()

  return (
    <div className="px-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
