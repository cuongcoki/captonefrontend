
import { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ScanEye, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react"



interface DataTableRowActionsProps<TData extends { id: string }> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };
  return (
    <div className="flex items-center justify-center gap-2">
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
          <ScanEye className="h-5 w-5" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className="w-full fixed z-50 left-1/2 top-1/2 max-w-[1200px] max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white text-gray-900 shadow">
              <div className="bg-slate-100 flex flex-col overflow-y-auto space-y-4 rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-t-md">
                  <h2 className="text-2xl text-white">Tạo Đơn Hàng</h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOffDialog}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid p-4 overflow-y-auto h-[650px] gap-4">

                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}



