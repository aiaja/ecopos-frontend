"use client";

import { Search } from "@/components/ui/search";
import React, { useState } from "react";
import { PaymentMethod, paymentMethods } from "@/datas/paymentMethod";

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

import { SquarePen, Trash2 } from "lucide-react";

export function PaymentMethodTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filtered = paymentMethods.filter(
    (paymentMethods) =>
      paymentMethods.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      paymentMethods.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // TABLE
    <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <Table>
        {/* Search Bar Row */}
        <TableHeader className="w-full col-span-4">
          <TableRow>
            <TableHead colSpan={2} className="px-4 py-4">
              <Search
                placeholder="Search (ID/Name)"
                onSearch={(value) => setSearchQuery(value)}
                className="max-w-sm"
              />
            </TableHead>
            <TableHead >
              <div className="justify-end flex">
                <button className="flex gap-2 justify-center items-center bg-primary hover:bg-primary/80 p-2 text-light rounded-md">
                  Add Payment Method
                  <SquarePen className="w-4 h-4" />
                </button>
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((paymentMethod: PaymentMethod) => (
            <TableRow key={paymentMethod.id}>
              <TableCell>{paymentMethod.id}</TableCell>
              <TableCell>{paymentMethod.name}</TableCell>
              <TableCell className="text-center flex gap-2 justify-center">
                <button className="flex gap-2 justify-center items-center bg-primary hover:bg-primary/80 p-2 text-light rounded-md">
                  Edit
                  <SquarePen className="w-4 h-4" />
                </button>
                <button className="flex gap-2 justify-center items-center bg-red-500 hover:bg-red-400 p-2 text-light rounded-md">
                  Delete
                  <Trash2 className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
