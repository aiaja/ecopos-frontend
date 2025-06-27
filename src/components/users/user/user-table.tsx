"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { SortButton } from "@/components/ui/sort";

import { 
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
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

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortedUsers, setSortedUsers] = useState<User[]>(users);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setSortedUsers(filteredUsers);
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">User</h1>
        <Button asChild type="button" className="w-32">
          <Link href="/user-management/user/new">New User</Link>
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (Name/Email)"
           onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Username
                <SortButton<User>
                  data={sortedUsers}
                  sortKey="name"
                  onSort={setSortedUsers}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              {/* <TableHead>Phone</TableHead> */}
              {/* <TableHead>Address</TableHead> */}
              <TableHead className="text-center">Role</TableHead>
              {/* <TableHead className="text-center">Is Owner</TableHead> */}
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {/* <TableCell>{user.phone}</TableCell> */}
                  {/* <TableCell>{user.address}</TableCell> */}
                  <TableCell className="text-center">{user.role}</TableCell>
                  {/* <TableCell className="text-center">{user.isOwner ? "YES" : "NO"}</TableCell> */}
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button asChild type="button" className="w-18">
                      <Link href={`/user-management/user/${user.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                      <Button className="w-18 bg-red-500 hover:bg-red-500/90">
                        Delete 
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No user found.
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