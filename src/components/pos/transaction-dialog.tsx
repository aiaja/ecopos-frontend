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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

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
import { PaymentMethod } from "@/datas/paymentMethod";
import { Product } from "@/datas/products";
import { CartItem } from "@/datas/orderDetails";
import { CheckCircle, XCircle } from "lucide-react";

interface TransactionsDialogProps {
  transactionId?: string;
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
  mode: "create" | "update";
  vouchers: Voucher[];
  listPaymentMethod?: PaymentMethod[];
  cartItems: CartItem[];
  orderData?: any; // Order data containing items, subtotal, tax, taxRate, and total
  outletTax: number;
  setCartItems: (items: CartItem[]) => void;
  fetchCartItems: () => void;
  onShowSuccess?: (message: string) => void; // Callback for showing success messages
  onShowError?: (message: string) => void; // Callback for showing error messages
}

const TransactionsDialog = ({
  transactionId,
  isOpen,
  onClose,
  transaction,
  onSubmit,
  mode,
  vouchers,
  listPaymentMethod = [],
  cartItems,
  orderData = {
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 0.11, // Assuming a fixed tax rate of 11%
    total: 0,
  },
  setCartItems,
  fetchCartItems,
  outletTax = 0,
  onShowSuccess = (message: string) => {
    console.log("Success:", message);
  }, // Default success handler
  onShowError = (message: string) => {
    console.error("Error:", message);
  }, // Default error handler
}: TransactionsDialogProps) => {
   const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedVoucherData, setSelectedVoucherData] = useState<Voucher | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Calculate order totals from cart items
  const calculateOrderTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subtotal: 0,
        totalCost: 0,
        totalQty: 0,
        taxPrice: 0,
        discountPrice: 0,
        finalTotal: 0
      };
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0);
    const totalCost = cartItems.reduce((sum, item) => sum + (item.product.initial_price * item.quantity), 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate discount if voucher is selected
    let discountPrice = 0;
    if (selectedVoucherData) {
      if (selectedVoucherData.type === 'percentage') {
        discountPrice = (subtotal * Number(selectedVoucherData.nominal) / 100);
      } else if (selectedVoucherData.type === 'fixed') {
        discountPrice = Number(selectedVoucherData.nominal);
      }
    }

    const totalAfterDiscount = subtotal - discountPrice;
    const taxPrice = (totalAfterDiscount * outletTax) / 100;
    const finalTotal = totalAfterDiscount + taxPrice;

    return {
      subtotal,
      totalCost,
      totalQty,
      taxPrice,
      discountPrice,
      finalTotal
    };
  };

  const orderTotals = calculateOrderTotals();

  // Sample transaction data - replace with your actual data
  const orderDataDumy = {
    items: cartItems.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.selling_price,
      product: item.product
    })),
    subtotal: orderTotals.subtotal,
    tax: orderTotals.taxPrice,
    taxRate: outletTax,
    total: orderTotals.finalTotal,
    discountPrice: orderTotals.discountPrice
  };

  const filteredVouchers = vouchers
    ? vouchers.filter((voucher: Voucher) => {
        const query = searchQuery.toLowerCase();
        return (
          voucher.name.toLowerCase().includes(query) ||
          voucher.code.toLowerCase().includes(query)
        );
      })
    : [];

  const [sortedVouchers, setSortedVouchers] = useState<Voucher[]>(filteredVouchers);

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

  const quickAmounts = [15000, 16000, 20000, 50000, 100000];

  const handleQuickAmount = (amount: number) => {
    setInputValue(amount.toString());
    setPaidAmount(amount);
  };

  const handleNumberInput = (value: string) => {
    if (value === "clear") {
      setInputValue("");
      setPaidAmount(0);
    } else if (value === "backspace") {
      const newValue = inputValue.slice(0, -1);
      setInputValue(newValue);
      setPaidAmount(Number(newValue) || 0);
    } else if (value === ".") {
      if (!inputValue.includes(".")) {
        const newValue = inputValue + value;
        setInputValue(newValue);
        setPaidAmount(Number(newValue) || 0);
      }
    } else {
      const newValue = inputValue + value;
      setInputValue(newValue);
      setPaidAmount(Number(newValue) || 0);
    }
  };

  const handleNoChange = () => {
    setInputValue(orderData.total.toString());
    setPaidAmount(orderData.total);
  };

  const calculateChange = () => {
    return paidAmount - orderData.total;
  };

   const handleVoucherChange = (voucherId: string) => {
    setSelectedVoucher(voucherId);
    if (voucherId === "no-voucher") {
      setSelectedVoucherData(null);
    } else {
      const voucher = vouchers.find(v => v.id === voucherId);
      setSelectedVoucherData(voucher || null);
    }
  };

  const handlePaymentMethodChange = (methodName: string) => {
    setPaymentMethod(methodName);
    const method = listPaymentMethod.find(pm => pm.name === methodName);
    setSelectedPaymentMethodId(method?.id || "");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Create transaction object matching Postman body structure
      const submitTransactions: Transaction = {
        date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        note: "", // Can be made null or empty if no note
        voucher_id: selectedVoucher === "no-voucher" ? null : selectedVoucher,
        discount_price: orderTotals.discountPrice,
        payed_money: paidAmount,
        money_changes: calculateChange(),
        total_price: orderData.total,
        total_cost: orderTotals.totalCost,
        payment_method_id: selectedPaymentMethodId,
        tax: outletTax,
        tax_price: orderTotals.taxPrice,
        total_qty: orderTotals.totalQty,
        products: cartItems.map((item) => ({
          product_id: item.product.id,
          qty: item.quantity,
        })),
      };

      const response = await TransactionService.createTransaction(
        localStorage.getItem("outlet_id") || "",
        submitTransactions
      );
      
      if (response) {
        setCartItems([]);
        fetchCartItems();
        onShowSuccess("Transaction created successfully");
      } else {
        showErrorAlert("Failed to process transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      onShowError("An error occurred while processing the transaction.");
    } finally {
      setLoading(false);
    }
  };

   const showSuccessAlert = (message: string) => {
    alert(message);
    onClose();
  };

  const showErrorAlert = (message: string) => {
    alert(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-6">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Details</h3>
              
              {/* Order Items */}
              <div className="space-y-2">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">▲</span>
                      <span>{item.product.name}</span>
                      <span className="text-gray-500">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold">IDR {item.product.selling_price}</span>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Sub total</span>
                  <span>IDR {orderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{orderData.taxRate}%</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>IDR {orderData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Money changes</span>
                  <span>{calculateChange() > 0 ? `+${calculateChange().toLocaleString()}` : calculateChange().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Voucher Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Voucher (Optional)</label>
              <Select onValueChange={(value) => setSelectedVoucher(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Voucher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-voucher">No Voucher</SelectItem>
                  {sortedVouchers.length > 0 ? (
                    sortedVouchers.map((voucher: Voucher) => (
                      <SelectItem key={voucher.code} value={voucher.code}>
                        {voucher.code} - {voucher.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-voucher-available">No Voucher Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column - Payment Input */}
          <div className="space-y-4">
            {/* Payment Method */}
            <div className="flex gap-2">
              {listPaymentMethod.map((method) => (
                <Button 
                variant={paymentMethod === "Cash" ? "default" : "outline"}
                onClick={() => handlePaymentMethodChange(method.name)}
                key={method.id}
                className={`flex-1 ${paymentMethod === method.name ? "bg-blue-500 text-white" : "bg-white text-black"}`}
              >
                  {method.name}
              </Button>
              ))}
              
            </div>

            {/* Payment Amount Input */}
            <div className="border rounded-lg p-4 min-h-[60px] flex items-center justify-center text-2xl font-mono">
              {inputValue || "0"}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickAmount(amount)}
                  className="py-3"
                >
                  {amount.toLocaleString()}
                </Button>
              ))}
            </div>

            {/* No Change Button */}
            <Button
              variant="outline"
              onClick={handleNoChange}
              className="w-full py-3"
            >
              No change
            </Button>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  onClick={() => handleNumberInput(num.toString())}
                  className="py-3"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handleNumberInput(".")}
                className="py-3"
              >
                .
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNumberInput("0")}
                className="py-3"
              >
                0
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNumberInput("backspace")}
                className="py-3"
              >
                ⌫
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={paidAmount < orderData.total}
            className="flex-1 bg-blue-500 text-white"
          >
            Pay it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsDialog;