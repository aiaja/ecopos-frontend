"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@/datas/users";

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

interface UsersTableProps {
  users: User[];
  onDelete: (userId: string) => void;
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
   const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useEffect untuk menangani filter dan sinkronisasi data dari props
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery]);

  // Logika Pagination
  const totalPages = Math.ceil(displayUsers.length / itemsPerPage);
  const paginatedUsers = displayUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          placeholder="Search (Username/Email)"
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Username
                <SortButton<User> data={displayUsers} sortKey="username" onSort={setDisplayUsers} />
              </TableHead>
              <TableHead>
                Email
                <SortButton<User> data={displayUsers} sortKey="email" onSort={setDisplayUsers} />
              </TableHead>
              <TableHead className="text-center">Roles</TableHead>
              <TableHead className="text-center">Outlet</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.length > 0
                      ? user.roles.map(role => role.name).join(', ')
                      : <span className="text-xs text-muted-foreground">No Roles</span>
                    }
                  </TableCell>
                  {/* Gunakan optional chaining (?.) untuk mengakses data outlet dengan aman */}
                  <TableCell>{user.outlet?.outlet_name || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button asChild type="button" className="w-18">
                        <Link href={`/user-management/user/${user.id}/edit`}>Edit</Link>
                      </Button>
                      <Button type="button" className="w-18 cursor-pointer" variant="destructive" onClick={() => onDelete(user.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No users found for "{searchQuery}".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}