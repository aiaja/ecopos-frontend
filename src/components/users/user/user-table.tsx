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

  // Untuk memfilter data kapanpun data utama atau query berubah
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayUsers(filtered);
  }, [users, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (sortedData: User[]) => {
    setDisplayUsers(sortedData);
    setCurrentPage(1);
  };

  // Logika Pagination
  const totalPages = Math.ceil(displayUsers.length / itemsPerPage);
  const paginatedUsers = displayUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/user-management/user/new">New User</Link>
        </Button>
      </div>

      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="py-6 space-y-4">
          <Search
            placeholder="Search (Username / Email)"
            onSearch={setSearchQuery}
            className="max-w-md"
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-10 font-bold">
                    Username
                    <SortButton<User> 
                      data={displayUsers} 
                      sortKey="username" 
                      onSort={handleSort} 
                    />
                  </TableHead>

                  <TableHead className="text-center font-bold">
                    Email
                    <SortButton<User> 
                      data={displayUsers} 
                      sortKey="email" 
                      onSort={handleSort} 
                    />
                  </TableHead>

                  <TableHead className="text-center font-bold">
                    Roles
                  </TableHead>

                  <TableHead className="text-center font-bold">
                    Outlet
                  </TableHead>

                  <TableHead className="text-center font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="pl-10 font-bold text-gray-900">
                        {user.username}
                      </TableCell>

                      <TableCell className="text-gray-700">
                        {user.email}
                      </TableCell>

                      <TableCell className="text-gray-700">
                        {user.roles.length > 0
                          ? user.roles.map(role => role.name).join(', ')
                          : <span className="text-xs text-muted-foreground">No Roles</span>
                        }
                      </TableCell>

                      <TableCell className="text-gray-700">
                        {user.outlet?.outlet_name || 'N/A'}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            asChild 
                            size="sm" 
                            type="button"
                            className="text-xs px-3 w-15"
                          >
                            <Link href={`/user-management/user/${user.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            className="text-xs px-3 w-15 bg-red-500 hover:bg-red-500/90 cursor-pointer"
                            onClick={() => onDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                      No users found for "{searchQuery}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}