"use client";

import { Search } from "@/components/ui/search";
import React, { useState } from "react";
import { PaymentMethod } from "@/datas/paymentMethod";

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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { SortButton } from "../ui/sort";
import DeleteDialog from "./payment-method-delete";
import { SquarePen, Trash2 } from "lucide-react";
import { deletePaymentMethod } from "@/services/payment-method";

export function PaymentMethodTable({
  paymentMethods,
}: {
  paymentMethods?: PaymentMethod[];
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPaymentMethods = paymentMethods
    ? paymentMethods.filter((paymentMethod: PaymentMethod) => {
        const query = searchQuery.toLowerCase();
        return (
          paymentMethod.name.toLowerCase().includes(query) ||
          paymentMethod.id.toString().includes(query)
        );
      })
    : [];

  const [sortedPaymentMethods, setSortedPaymentMethods] = useState<
    PaymentMethod[]
  >(filteredPaymentMethods);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedPaymentMethods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedPaymentMethods.slice(startIndex, endIndex);

  useEffect(() => {
    setSortedPaymentMethods(filteredPaymentMethods);
  }, [searchQuery]);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });

  const handleDeletePaymentMethod = async (id: string) => {
    try {
            const outletId = localStorage.getItem("outlet_id") || "";
            await deletePaymentMethod(outletId, id);
            alert("Payment method deleted successfully"); 
            console.log(`Deleting payment method with ID: ${id}`);
            setSortedPaymentMethods((prev) =>
              prev.filter((pm) => pm.id !== id)
            );
        } catch (error) {
            console.error("Error deleting payment method:", error);
            alert("An error occurred while deleting the payment method.");
        }
    setDeleteDialog({ open: false });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Payment Methods</h1>

        <Button asChild type="button">
          <Link href="/payment-method/new">New Payment Method</Link>
        </Button>
      </div>
      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (ID/Payment Method Name)"
          onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                ID
                <SortButton<PaymentMethod>
                  data={sortedPaymentMethods}
                  sortKey="id"
                  onSort={setSortedPaymentMethods}
                />
              </TableHead>
              <TableHead>
                Payment Method Name
                <SortButton<PaymentMethod>
                  data={sortedPaymentMethods}
                  sortKey="name"
                  onSort={setSortedPaymentMethods}
                />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPaymentMethods.length > 0 ? (
              sortedPaymentMethods.map((paymentMethod: PaymentMethod) => (
                <TableRow key={paymentMethod.id}>
                  <TableCell>{paymentMethod.id}</TableCell>
                  <TableCell>{paymentMethod.name}</TableCell>
                  <TableCell className="text-center">
                    <Button asChild type="button" className="w-18">
                      <Link href={`/payment-method/${paymentMethod.id}/edit`}>
                        Edit
                        <SquarePen className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          id: paymentMethod.id,
                          name: paymentMethod.name,
                        })
                      }
                      className="cursor-pointer"
                    >
                      Delete
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <DeleteDialog
                      isOpen={deleteDialog.open && deleteDialog.id === paymentMethod.id}
                      onClose={() => setDeleteDialog({ open: false })}
                      onConfirm={async () => {
                        if (deleteDialog.id)
                          await handleDeletePaymentMethod(deleteDialog.id);
                      }}
                      itemName={paymentMethod.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No payment method found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
