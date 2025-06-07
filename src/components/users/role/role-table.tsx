"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";

import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
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

import users, { User } from "../../../datas/users";

export function RoleTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedUsers, setSortedUsers] = useState<User[]>(users);

  const filteredRole = users.filter(user => 
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRole.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRole.slice(startIndex, endIndex);
  
  useEffect(() => {
    setSortedUsers(filteredRole);
  }
  , [searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Button asChild type="button" className="w-32">
          <Link href="/user-management/role/new">New Role</Link>
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar */}
        <Search
          placeholder="Search"
          onSearch={(query) => setSearchQuery(query)} // Set query state
          className="max-w-sm"
        />  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRole.length > 0 ? (
              filteredRole.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button className="w-18">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No role found.
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}