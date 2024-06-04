import { Facility, columns } from "./Column"
import { DataTable } from "./DataTable"

async function getData(): Promise<Facility[]> {
  // Fetch data from your API here.
  return [
    {
      id: "000000001",
      title: "Hunonic",
      address: "TP thái nguyên",
    },
    {
      id: "000000002",
      title: "sâmdung",
      address: "Thai Nfguyne",
    },

    // ...
  ]
}

export default async function RenderTableFability() {
  const data = await getData()

  return (
    <div className="px-3">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
