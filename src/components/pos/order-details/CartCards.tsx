import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React, { useCallback } from "react";

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
import { OpenBillsService } from "@/services/openBills";
import { OpenBills } from "@/datas/openBills";
import { on } from "events";

interface CartCardsProps {
  cartItems?: CartItem[];
  onChartUpdate?: () => void; // Callback to update cart
  openBills?: OpenBills[];
  onShowSuccess?: (message: string) => void; // Callback for showing success messages
  onShowError?: (message: string) => void; // Callback for showing error messages
}

export default function CartCards({
  cartItems = [],
  onChartUpdate,
  openBills = [],
  onShowSuccess,
  onShowError,
}: CartCardsProps) {

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [loadingDeleteItemId, setLoadingDeleteItemId] = useState<string | null>(null);
  
  const updateCartItem = async (item: CartItem) => {
    try {
      const response = await CartService.updateCartItem(
        localStorage.getItem("outlet_id") || "",
        item.id,
        { quantity: item.quantity }
      );
      console.log("Response from updateCartItem:", response);
      if (response) {
        onShowSuccess?.("Cart item updated successfully");
        onChartUpdate?.(); 
      } else {
        console.error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      onShowError?.("An error occurred while updating the cart item.");
    }finally {
      setLoadingItemId(null);
    }
  };

  const updateOpenBills = async (item: OpenBills) => {
    try {

      const updatedDetails = item.details?.map(detail => ({
      id: detail.id,
      code: detail.code,
      open_bill_id: detail.open_bill_id,
      product_id: detail.product_id,
      price: detail.price,
      cost: detail.cost,
      qty: detail.qty,  // Menjaga nilai qty
      product: detail.product, // Menyertakan informasi produk yang terkait
    })) || [];

      const response = await OpenBillsService.updateOpenBills(
        localStorage.getItem("outlet_id") || "",
        item.id,
        { details: updatedDetails }
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

  const handleUpdateItem = async (item: CartItem | OpenBills) => {
    if (mode === 'create') {
      if ('quantity' in item) {
        await updateCartItem(item as CartItem);
      }
    } else if (mode === 'update') {
      if ('details' in item) {
        await updateOpenBills(item as OpenBills);
      }
    }
  };

  const handleChangeQuantity = useCallback(
    async (item: CartItem, newQuantity: number) => {
      if (newQuantity > 0 && newQuantity !== item.quantity) {
        setLoadingItemId(item.id);
        handleUpdateItem({ ...item, quantity: newQuantity });
      } 
    },[handleUpdateItem]);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const handleDeleteCartItems = async (id: string) => {
    try {
      setLoadingDeleteItemId(id);
      const outletId = localStorage.getItem("outlet_id") || "";
      await CartService.deleteCartItem(outletId, id);
      onShowSuccess?.("Cart item deleted successfully");
      onChartUpdate?.(); // Trigger parent to refetch cart data
    } catch (error) {
      console.error("Error deleting cart item:", error);
      onShowError?.("An error occurred while deleting the cart item.");
    } finally {
      setLoadingDeleteItemId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      await CartService.clearCart(outletId);
      onShowSuccess?.("Cart cleared successfully");
      onChartUpdate?.(); // Trigger parent to refetch cart data
    } catch (error) {
      onShowError?.("An error occurred while clearing the cart.");
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
                  loadingDeleteItemId === item.id ? (
                    <TableRow key={item.id}>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        Deleting...
                      </TableCell>
                    </TableRow>
                  ) : (
                  loadingItemId === item.id ? (
                    <TableRow key={item.id}>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        Updating...
                      </TableCell>
                    </TableRow>
                  ) : (
                  <TableRow key={item.id}>
                    <TableCell className="text-gray-500">
                      {item.product?.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <Input
                        placeholder="1"
                        className="w-12"
                        type="number"
                        min={1}
                        value={item.quantity || item.qty}
                        onChange={(e) => {
                          setLoadingItemId(item.id);
                          const newQuantity = Number(e.target.value);
                          if (
                            newQuantity > 0 &&
                            newQuantity !== item.quantity
                          ) {
                            handleChangeQuantity(item, newQuantity);
                          }
                          setLoadingItemId(null);
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
                        onClick={() => {
                          handleDeleteCartItems(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  )
                )))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-gray-500">
                    No items
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
