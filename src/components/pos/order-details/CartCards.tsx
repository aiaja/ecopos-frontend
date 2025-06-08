import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { CartService } from "@/services/pos/cart";
import { useEffect, useState } from "react";
import { CartItem } from "@/datas/orderDetails";
import { cartSchema } from "@/datas/orderDetails";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function CartCards( {cartItems}: { cartItems?: CartItem[] }) {

  const updateCartItem = async (item: CartItem) => {
    try {
      const response = await CartService.updateCartItem(
        localStorage.getItem("outlet_id") || "",
        item.id,
        { quantity: item.quantity }
      );
      if (response) {
        console.log("Cart item updated successfully");
      } else {
        console.error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const [deleteDialog, setDeleteDialog] = useState<{
      open: boolean;
      id?: string;
      name?: string;
    }>({ open: false });
  
    const handleDeleteCartItems = async (id: string) => {
      try {
        const outletId = localStorage.getItem("outlet_id") || "";
        await CartService.deleteCartItem(outletId,id);
        alert("Cart item deleted successfully");
        console.log(`Deleting cart item with ID: ${id}`);
      } catch (error) {
        console.error("Error deleting cart item:", error);
        alert("An error occurred while deleting the cart item.");
      }
    };

    const handleClearCart = async () => {
      try {
        const outletId = localStorage.getItem("outlet_id") || "";
        await CartService.clearCart(outletId);
        alert("Cart cleared successfully");
        console.log("Clearing cart");
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("An error occurred while clearing the cart.");
      }
    };

  return (
    <div>
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="border-b-2 pb-3">Current Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
               <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                   <Button
                        variant="destructive"
                        onClick={async () => {
                          await handleClearCart();
                          window.location.reload();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-gray-500">{item.product?.name}</TableCell>
                    <TableCell className="text-gray-500">
                      <Input
                      placeholder="1"
                      className="w-12"
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      onChange={async (e) => {
                        const newQuantity = Number(e.target.value);
                        if (newQuantity > 0 && newQuantity !== item.quantity) {
                        await updateCartItem({ ...item, quantity: newQuantity });
                        window.location.reload();
                        }
                      }}
                      />
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {item.product && item.quantity
                        ? Number(item.product.selling_price) * item.quantity
                        : item.product?.selling_price}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        className="hover:bg-red-500 hover:text-white"
                        onClick={async () => {
                          await handleDeleteCartItems(item.id);
                          window.location.reload();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-gray-500">No items</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
