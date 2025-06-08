"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NoteDialog from "./NoteDialog";
import VoucherDialog from "./VoucherDialog";
import { PlusIcon } from "@/components/common/Plus";
import CartCards from "./CartCards";

import { CartService } from "@/services/pos/cart";
import { useEffect, useState } from "react";
import { CartItem } from "@/datas/orderDetails";

export function OrderDetails({ orders }: { orders: any[] }) {
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);

  const [cartItem, setCartItem] = useState<CartItem[]>([]);
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
            <p>
              {SubTotal}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>
              {SubTotal * 0.11}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Discount</p>
            <p>
              0
            </p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>
              {SubTotal + SubTotal * 0.11}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-row justify-between gap-4">
        <Button className="flex-1" variant="default">
          Open Bills
        </Button>
        <Button className="flex-1" variant="default">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
