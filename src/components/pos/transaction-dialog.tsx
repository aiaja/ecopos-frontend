import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Transaction, createTransactionSchema } from "@/datas/transaction";
import { TransactionService } from "@/services/transaction";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { VoucherService } from "@/services/voucher";
import { Voucher } from "@/datas/voucher";

interface TransactionsDialogProps {
  transactionId?: string;
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null; // Ubah prop Transaction sesuai dengan interface yang benar
  onSubmit: (transaction: Transaction) => void;
  mode: "create" | "update";
  vouchers: Voucher[];
}

const TransactionsDialog = ({
  transactionId,
  isOpen,
  onClose,
  transaction,
  onSubmit,
  mode,
  vouchers,
}: TransactionsDialogProps) => {
  const [loading, setLoading] = useState(false);

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

  const [defaultValues, setDefaultValues] = useState({
    id: "",
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
    const fetchTransaction = async () => {
      try {
        const response = await TransactionService.getTransactionById(
          localStorage.getItem("outlet_id") || "",
          transactionId
        );
        if (response) {
          setDefaultValues({
            id: response.id || "",
            date: response.date,
            note: response.note || "",
            voucher_id: response.voucher_id,
            discount_price: response.discount_price,
            payed_money: response.payed_money,
            money_changes: response.money_changes,
            total_price: response.total_price,
            total_cost: response.total_cost,
            payment_method_id: response.payment_method_id,
            tax: response.tax,
            tax_price: response.tax_price,
            total_qty: response.total_qty,
            products: response.products || [],
          });
          form.reset({
            id: response.id || "",
            date: response.date,
            note: response.note || "",
            voucher_id: response.voucher_id,
            discount_price: response.discount_price,
            payed_money: response.payed_money,
            money_changes: response.money_changes,
            total_price: response.total_price,
            total_cost: response.total_cost,
            payment_method_id: response.payment_method_id,
            tax: response.tax,
            tax_price: response.tax_price,
            total_qty: response.total_qty,
            products: response.products || [],
          });
        } else {
          console.log("Transaction not found");
        }
      } catch (error) {
        console.error("Error fetching transaction:");
      } finally {
        setLoading(false);
      }
    };
  });

  const form = useForm<z.infer<typeof createTransactionSchema>>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues,
  });

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

  const handleSave = async () => {
    try {
      const newTransaction = {
        name : customerName,
        outlet_id: localStorage.getItem("outlet_id") || "",
      };

      const response = await TransactionService.createTransaction(
        localStorage.getItem("outlet_id") || "",
        newTransaction
      );
      if(response){
        alert("Transaction created successfully");
      } else {
        alert("Failed to create transaction")
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Transaction" : "Update Transaction"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter paid money..."
            type="number"
            value={formData.payed_money}
            onChange={(e) =>
              setFormData({ ...formData, payed_money: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <Select onValueChange={(value) => setSelectedVoucher(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Voucher" />
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
          <Button onClick={handleSave}>
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsDialog;
