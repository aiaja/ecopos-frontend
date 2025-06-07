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

export default function CartCards() {
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
              <TableRow>
                <TableCell className="text-gray-500">No items</TableCell>
                <TableCell className="text-gray-500">
                  <Input placeholder="1" className="w-12" />
                </TableCell>
                <TableCell className="text-gray-500">10000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
