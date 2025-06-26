"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NoteDialog from "./NoteDialog";
import VoucherDialog from "./VoucherDialog";
import { PlusIcon } from "@/components/common/Plus";
import CartCards from "./CartCards";
import { CartService } from "@/services/pos/cart";
import { useEffect, useState } from "react";
import { CartItem } from "@/datas/orderDetails";
import OpenBillsDialog from "@/components/open-bills/open-bills-dialog";
import { OpenBills } from "@/datas/openBills";
import { useRouter } from "next/navigation";
import { OpenBillsService } from "@/services/openBills";
import TransactionsDialog from "../transaction-dialog";
import { TransactionService } from "@/services/transaction";
import { Transaction } from "@/datas/transaction";

interface OrderDetailsProps {
  orders?: any[]; // list of orders (OpenBills products)
  mode: "create" | "update"; // mode for the operation (create or update)
  selectedOpenBill: OpenBills | null; // selected open bill if updating
  transaction: Transaction | null;
}

export function OrderDetails({
  orders,
  mode,
  selectedOpenBill,
  transaction
}: OrderDetailsProps) {
  const router = useRouter();

  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [isOpenBillsDialogOpen, setOpenBillsDialogOpen] = useState(false);
  const [isTransactionsDialogOpen, setTransactionsDialogOpen] = useState(false);

  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCartItems = async () => {
    try {
      const response = await CartService.getCartItems(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setCartItem(response as CartItem[]);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenBillData = async (id: string) => {
    try {
      const response = await OpenBillsService.getOpenBillById(
        localStorage.getItem("outlet_id") || "",
        id
      );
      setOrderDetails(response.details ?? []);
    } catch (error) {
      console.error("Error fetching open bill data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "create") {
      fetchCartItems();
    } else if (mode === "update" && selectedOpenBill) {
      fetchOpenBillData(selectedOpenBill.id); // Fetch OpenBill details for update mode
    }
  }, [mode, selectedOpenBill]); // Re-run when mode or selectedOpenBill changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate totals based on the mode
  const itemsToCalculate = mode === "create" ? cartItem : orderDetails;
  console.log("items", itemsToCalculate);
  const SubTotal = itemsToCalculate.reduce(
    (sum: number, item: any) =>
      sum +
      (item.product && item.quantity
        ? Number(item.product.selling_price) * item.quantity
        : Number(item.product?.selling_price) || 0),
    0
  );

  console.log("SubTotal", SubTotal);

  const Tax = SubTotal * 0.11;
  const Total = SubTotal + Tax;

  const handleSubmitOpenBills = async (values: { customer_name: string }) => {
    const submitOpenBills = {
      customer_name: values.customer_name,
      date: new Date().toISOString(),
      voucher_id: null,
      discout_price: 0, // Assuming no discount for now
      total_price: Total,
      total_qty: cartItem.reduce((sum, item) => sum + item.quantity, 0),
      products: cartItem.map((item) => ({
        product_id: item.product.id,
        qty: item.quantity,
      })),
    };

    try {
      if (mode === "create") {
        const response = await OpenBillsService.createOpenBills(
          localStorage.getItem("outlet_id") || "",
          submitOpenBills
        );
        if (response) {
          alert("Open Bill Created successfully");
          setCartItem([]);
          router.refresh();
        } else {
          alert("Failed to create Open Bill");
        }
      } else if (mode === "update" && selectedOpenBill) {
        const response = await OpenBillsService.updateOpenBills(
          localStorage.getItem("outlet_id") || "",
          selectedOpenBill.id,
          submitOpenBills
        );
        if (response) {
          alert("Open Bill Updated successfully");
          setCartItem([]);
          router.push("/pos");
        } else {
          alert("Failed to update Open Bill");
        }
      }
    } catch (error) {
      console.error("Error while creating or updating open bill:", error);
      alert("An error occurred while processing your request.");
    }
  };

  const handleSubmitTransactions = async (values: { payed_money: number }) => {
    const submitTransactions: Transaction = {
      date: new Date().toISOString(),
      note: "",
      voucher_id: null,
      discount_price: 0,
      payed_money: values.payed_money,
      money_changes: values.payed_money - Total,
      total_price: Total,
      total_cost: SubTotal,
      payment_method_id: "", // You should fetch or set this based on available payment methods
      tax: 0.11, // Assuming a fixed tax rate
      tax_price: Tax,
      total_qty: cartItem.reduce((sum, item) => sum + item.quantity, 0),
      products: cartItem.map((item) => ({
        product_id: item.product.id,
        qty: item.quantity,
      })),
    };

    try {
      const response = await TransactionService.createTransaction(
        localStorage.getItem("outlet_id") || "",
        submitTransactions
      );
      if (response) {
        alert("Transaction Created successfully");
        setCartItem([]);
        router.refresh();
      } else {
        alert("Failed to create transaction");
      }
    } catch (error) {
      console.error("Error while creating transaction:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Display cart items or OpenBill details based on the mode */}
      {mode === "create" ? (
        <CartCards cartItems={cartItem} />
      ) : (
        <CartCards cartItems={orderDetails} />
      )}

      <p>{mode}</p>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <p>Note</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setNoteDialogOpen(true);
              }}
            >
              <PlusIcon />
            </a>
            <NoteDialog
              isOpen={isNoteDialogOpen}
              onClose={() => setNoteDialogOpen(false)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p>Voucher</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setVoucherDialogOpen(true);
              }}
            >
              <PlusIcon />
            </a>
            <VoucherDialog
              isOpen={isVoucherDialogOpen}
              onClose={() => setVoucherDialogOpen(false)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex justify-between">
            <p>Sub Total</p>
            <p>{SubTotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>{Tax}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount</p>
            <p>0</p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>{Total}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-between gap-4">
        <Button
          className="flex-1"
          onClick={() => {
            setOpenBillsDialogOpen(true);
          }}
        >
          {mode === "create" ? "Create Open Bill" : "Update Open Bill"}
        </Button>
        <OpenBillsDialog
          isOpen={isOpenBillsDialogOpen}
          onClose={() => setOpenBillsDialogOpen(false)}
          openBill={selectedOpenBill}
          onSubmit={handleSubmitOpenBills}
          mode={mode}
        />
        <Button
          className="flex-1"
          onClick={() => {
            setTransactionsDialogOpen(true);
          }}
        >
          Proceed to Payment
        </Button>
        <TransactionsDialog
          isOpen={isTransactionsDialogOpen}
          onClose={() => setTransactionsDialogOpen(false)}
          transaction={transaction}
          onSubmit={handleSubmitTransactions}
          mode={mode}
        />
      </div>
    </div>
  );
}
