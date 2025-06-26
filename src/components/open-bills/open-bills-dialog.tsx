import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { OpenBills } from "@/datas/openBills";

interface OpenBillsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  openBill: OpenBills | null;
  onSubmit: (values: { customer_name: string }) => void;
  mode: "create" | "update";
}

const OpenBillsDialog = ({ isOpen, onClose, openBill, onSubmit, mode }: OpenBillsDialogProps) => {
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(()=> {
    if (mode === "update" && openBill){
      setCustomerName(openBill.customer_name);
    } else if (mode === "create") {
      setCustomerName("");
    }
  }, [mode, openBill]);

  const handleSave = () => {
    if (customerName.trim() === ""){
      alert("Customer name is required.");
      return;
    }

    const formValues = {
      customer_name: customerName,
    };

    onSubmit(formValues); // Call the onSubmit handler to pass data to the parent
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Open Bill" : "Update Open Bill"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Type customer name..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            maxLength={255}
            required
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{mode === "create" ? "Create" : "Update"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenBillsDialog;
