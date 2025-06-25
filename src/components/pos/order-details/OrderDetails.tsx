// OrderDetails.tsx
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

interface OrderDetailsProps {
  orders?: any[]; // list of orders (OpenBills products)
  mode: "create" | "update"; // mode for the operation (create or update)
  selectedOpenBill: OpenBills | null; // selected open bill if updating
}

export function OrderDetails({
  orders,
  mode,
  selectedOpenBill,
}: OrderDetailsProps) {
  const router = useRouter();

  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [isOpenBillsDialogOpen, setOpenBillsDialogOpen] = useState(false);

  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCartItems = async () => {
    try {
      const response = await CartService.getCartItems(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setCartItem((response as CartItem[]));
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const SubTotal = cartItem.reduce(
    (sum: number, item: CartItem) =>
      sum +
      (item.product && item.quantity
        ? Number(item.product.selling_price) * item.quantity
        : Number(item.product?.selling_price) || 0),
    0
  );

  const Tax = SubTotal * 0.11;
  const Total = SubTotal + Tax;

  // Handle Open Bills submission
  const handleSubmitOpenBills = async (values: { customer_name: string }) => {
    const submitOpenBills = {
      id:
        mode === "update" && selectedOpenBill
          ? selectedOpenBill.id
          : new Date().toISOString(),
      code:
        mode === "update" && selectedOpenBill
          ? selectedOpenBill.code
          : new Date().getTime().toString(),
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

    // Send to the API or parent page
    try {
      if (mode === "create") {
        const response = await OpenBillsService.createOpenBills(
          localStorage.getItem("outlet_id") || "",
          submitOpenBills
        );
        if (response) {
          alert("Open Bill Created successfully");
          setCartItem([]);
          router.refresh(); // Refresh the page or navigate to the POS page
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
          router.push("/pos"); // Redirect to POS page after update
        } else {
          alert("Failed to update Open Bill");
        }
      }
    } catch (error) {
      console.error("Error while creating open bill:", error);
      alert("An error occurred while processing your request.");
    }
  };

  if (!orders) {
    return <p>No items</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <CartCards cartItems={cartItem} />
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
            setOpenBillsDialogOpen(true); // Open the dialog
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
        <Button className="flex-1" variant="default">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
