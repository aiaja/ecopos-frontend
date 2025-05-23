"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

import { Voucher, vouchers } from "@/datas/voucher";
import { SortButton } from "@/components/ui/sort";
import { SquarePen, Trash2 } from "lucide-react";

export function VoucherTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filtered = vouchers.filter(
    (vouchers) =>
      vouchers.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vouchers.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vouchers.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [sortedVouchers, setSortedVouchers] = useState<Voucher[]>(filtered);

  React.useEffect(() => {
    setSortedVouchers(filtered);
  }, [searchQuery]);

  return (
    // TABLE
    <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <Table>
        {/* Search Bar Row */}
        <TableHeader className="w-full col-span-6">
          <TableRow>
            <TableHead colSpan={5} className="px-4 py-2">
              <Search
                placeholder="Search (ID/Name/Category/SKU)"
                onSearch={(value) => setSearchQuery(value)}
                className="max-w-sm"
              />
            </TableHead>
            <TableHead>
              <div className="justify-end flex">
                <Button>Add New Vouchers</Button>
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>
              Id
              <SortButton<Voucher>
                data={sortedVouchers}
                sortKey="id"
                onSort={setSortedVouchers}
              />
            </TableHead>

            <TableHead>
              Name
              <SortButton<Voucher>
                data={sortedVouchers}
                sortKey="name"
                onSort={setSortedVouchers}
              />
            </TableHead>
            <TableHead>
              Code
              <SortButton<Voucher>
                data={sortedVouchers}
                sortKey="code"
                onSort={setSortedVouchers}
              />
            </TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVouchers.map((vouchers: Voucher) => (
            <TableRow key={vouchers.id}>
              <TableCell>{vouchers.id}</TableCell>
              <TableCell>{vouchers.name}</TableCell>
              <TableCell>{vouchers.code}</TableCell>
              <TableCell>{vouchers.startDate}</TableCell>
              <TableCell>{vouchers.expired}</TableCell>
              <div className="flex justify-center gap-2">
                <Button>
                  Edit
                  <SquarePen className="w-4 h-4" />
                </Button>
                <Button className="bg-red-500 hover:bg-red-500/90">
                  Delete
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
