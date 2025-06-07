"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberDialog from "./MemberDialog";
import NoteDialog from "./NoteDialog";
import VoucherDialog from "./VoucherDialog";
import { PlusIcon } from "@/components/common/Plus";
import CartCards from "./CartCards";


import { CartService } from "@/services/pos/cart";
import { useEffect, useState } from "react";
import { CartItem } from "@/datas/orderDetails";
import { cartSchema } from "@/datas/orderDetails";


export function OrderDetails({ orders }: { orders: any[] }) {
  const [isMemberDialogOpen, setMemberDialogOpen] = useState(false);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);

  const [cartItem, setCartItem] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    const fetchCartItems = async () => {
      try {
        const response = await CartService.getCartItems(localStorage.getItem("outlet_id") || "");
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
    }
  
    useEffect(() => {
      fetchCartItems();
    }, []);
  
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

  return (
    <div className="flex flex-col gap-4">
      <CartCards cartItems={cartItem} />
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <p>Member</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMemberDialogOpen(true);
              }}
            >
            <PlusIcon />
              
            </a>
            <MemberDialog
              isOpen={isMemberDialogOpen}
              onClose={() => setMemberDialogOpen(false)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p>
            Note

            </p>
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
          <p>Sub Total</p>
          <p>Tax</p>
          <p>Total</p>
          <p>Money Changes</p>
        </CardContent>
      </Card>
      <Button className="w-full" variant="default">
        Proceed to Payment
      </Button>
    </div>
  );
}
