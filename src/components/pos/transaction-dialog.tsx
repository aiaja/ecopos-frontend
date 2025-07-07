import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Transaction } from "@/datas/transaction";
import { TransactionService } from "@/services/transaction";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoucherService } from "@/services/voucher";
import { Voucher } from "@/datas/voucher";

interface TransactionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null; // Ubah prop Transaction sesuai dengan interface yang benar
  onSubmit: (transaction: Transaction) => void;
  mode: "create" | "update";
  vouchers: Voucher[];
}

const TransactionsDialog = ({ isOpen, onClose, transaction, onSubmit, mode, vouchers }: TransactionsDialogProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredVouchers = vouchers
    ? vouchers.filter((voucher: Voucher) => {
        const query = searchQuery.toLowerCase();
        return (
          voucher.name.toLowerCase().includes(query) ||
          voucher.code.toLowerCase().includes(query)
        );
      })
    : [];

  const [sortedVouchers, setSortedVouchers] =
    useState<Voucher[]>(filteredVouchers);

  useEffect(() => {
    setSortedVouchers(filteredVouchers);
  }, [searchQuery]);

  const [customerName, setCustomerName] = useState<string>("");
  const [formData, setFormData] = useState<Transaction>({
    date: "",
    note: "",
    voucher_id: null,
    discount_price: 0,
    payed_money: 0,
    money_changes: 0,
    total_price: 0,
    total_cost: 0,
    payment_method_id: "",
    tax: 0,
    tax_price: 0,
    total_qty: 0,
    products: [],
  });

  useEffect(() => {
    if (mode === "update" && transaction) {
      setCustomerName(transaction.note || ""); // Set customer name from the transaction data
      setFormData({
        ...formData,
        date: transaction.date,
        note: transaction.note || "",
        voucher_id: transaction.voucher_id,
        discount_price: transaction.discount_price,
        payed_money: transaction.payed_money,
        money_changes: transaction.money_changes,
        total_price: transaction.total_price,
        total_cost: transaction.total_cost,
        payment_method_id: transaction.payment_method_id,
        tax: transaction.tax,
        tax_price: transaction.tax_price,
        total_qty: transaction.total_qty,
        products: transaction.products,
      });
    } else if (mode === "create") {
      setCustomerName("");
      setFormData({
        date: "",
        note: "",
        voucher_id: null,
        discount_price: 0,
        payed_money: 0,
        money_changes: 0,
        total_price: 0,
        total_cost: 0,
        payment_method_id: "",
        tax: 0,
        tax_price: 0,
        total_qty: 0,
        products: [],
      });
    }
  }, [mode, transaction]);

  const handleSave = async () => {
    // if (customerName.trim() === "") {
    //   alert("Customer name is required.");
    //   return;
    // }

    // Validate form data before submission
    if (formData.total_price <= 0 || formData.payed_money <= 0) {
      alert("Total price and payed money must be greater than 0.");
      return;
    }

    try {
      // Submit the form data to create or update the transaction
      if (mode === "create") {
        await TransactionService.createTransaction("outlet_id", formData); // Call the service to create the transaction
      } else {
        // Update logic, which you would need to handle separately based on your backend
        // For now, it will just call onSubmit with the same form data as an example
        onSubmit(formData);
      }

      onClose(); // Close the dialog after saving
    } catch (error) {
      alert("Error saving transaction. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Transaction" : "Update Transaction"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter paid money..."
            type="number"
            value={formData.payed_money}
            onChange={(e) => setFormData({ ...formData, payed_money: Number(e.target.value) })}
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <Select onValueChange={(value) => setSelectedVoucher(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {sortedVouchers.length > 0 ? (
                sortedVouchers.map((voucher: Voucher) => (
                  <SelectItem key={voucher.code} value={voucher.code}>
                    {voucher.code}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-voucher">No Voucher Available</SelectItem>
              )}
            </SelectContent>
          </Select>
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

export default TransactionsDialog;
