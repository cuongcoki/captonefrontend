import { Row } from "@tanstack/react-table";
import { UpdateShipment } from "../form/UpdateShipment";

interface DataWithId {
  id: string;
}

interface DataTableRowActionsProps<TData extends DataWithId> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends DataWithId>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <UpdateShipment shipmentIDDes={row.original.id} />
    </>
  );
}
