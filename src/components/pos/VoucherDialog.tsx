import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
const VoucherDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  const handleSave = () => {
    console.log("Selected Voucher:", selectedVoucher);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Voucher</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Select onValueChange={(value) => setSelectedVoucher(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voucher1">Voucher 1</SelectItem>
              <SelectItem value="voucher2">Voucher 2</SelectItem>
              <SelectItem value="voucher3">Voucher 3</SelectItem>
            </SelectContent>
          </Select>
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

export default VoucherDialog;