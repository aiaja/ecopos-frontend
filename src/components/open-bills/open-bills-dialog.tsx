import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

const OpenBillsDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [openbills, setOpenbills] = useState<string | null>(null);

  const handleSave = () => {
    console.log("Openbills saved:", openbills);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Bills</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Type member name..."
            value={openbills || ""}
            onChange={(e) => setOpenbills(e.target.value)}
            maxLength={255}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenBillsDialog;