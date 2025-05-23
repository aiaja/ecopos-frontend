"use client";

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search } from "@/components/ui/search";
import React, { useState } from "react";

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

import { sellingHistories, SellingHistory } from "@/datas/sellingHistories";
import { SortButton } from "@/components/ui/sort";

export function SellingsTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredProducts = sellingHistories.filter((history) =>
    history.code.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    history.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    history.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
    history.customerNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortedProducts, setSortedProducts] = useState<SellingHistory[]>(filteredProducts);

  React.useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [searchQuery]);

  return (
    // TABLE
    <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <Table>
        {/* Search Bar Row */}
        <TableHeader className="w-full col-span-4">
          <TableRow>
            <TableHead colSpan={12} className="px-4 py-2">
              <Search
                placeholder="Search (ID/Name/Category/SKU)"
                onSearch={(value) => setSearchQuery(value)}
                className="max-w-sm"
              />
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Code
              <SortButton<SellingHistory>
                data={sortedProducts}
                sortKey="code"
                onSort={setSortedProducts}
              />
            </TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Customer Number</TableHead>
                <TableHead>Date</TableHead>
            <TableHead>Grand Total Price
              <SortButton<SellingHistory>
                data={sortedProducts}
                sortKey="grandTotalPrice"
                onSort={setSortedProducts}
              />
            </TableHead>
            <TableHead>Total Price
              <SortButton<SellingHistory>
                data={sortedProducts}
                sortKey="totalPrice"
                onSort={setSortedProducts}
              />
            </TableHead>
            <TableHead>Tax Price
              <SortButton<SellingHistory>
                data={sortedProducts}
                sortKey="taxPrice"
                onSort={setSortedProducts}
              />
            </TableHead>
            <TableHead>Total Cost
              <SortButton<SellingHistory>
                data={sortedProducts}
                sortKey="totalCost"
                onSort={setSortedProducts}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((history: SellingHistory) => (
            <TableRow key={history.code}>
              <TableCell>{history.code}</TableCell>
              <TableCell>{history.cashier}</TableCell>
              <TableCell>{history.member}</TableCell>
              <TableCell>{history.customerNumber}</TableCell>
              <TableCell>{history.date}</TableCell>
              <TableCell className="text-center">{history.grandTotalPrice}</TableCell>
              <TableCell className="text-center">{history.totalPrice}</TableCell>
              <TableCell className="text-center">{history.taxPrice}</TableCell>
              <TableCell className="text-center">{history.totalCost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
