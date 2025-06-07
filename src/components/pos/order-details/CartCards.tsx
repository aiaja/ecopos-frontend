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

export default function CartCards( {cartItems}: { cartItems?: CartItem[] }) {
  

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
                      defaultValue={item.quantity}
                      />
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {item.product && item.quantity
                        ? Number(item.product.selling_price) * item.quantity
                        : item.product?.selling_price}
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
