// File: src/components/users/permission/permission-table.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Permission } from "@/datas/permissions"; // Import tipe data

// Import komponen UI
import { Search } from "@/components/ui/search";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SortButton } from "@/components/ui/sort";

// Komponen ini sekarang menerima 'permissions' sebagai properti
export function PermissionTable({ permissions }: { permissions: Permission[] }) {
    const [displayPermissions, setDisplayPermissions] = useState<Permission[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Kita perbanyak item per halaman

    // useEffect untuk memfilter dan mengupdate data yang ditampilkan
    useEffect(() => {
        const filtered = permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            permission.guard_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayPermissions(filtered);
        setCurrentPage(1);
    }, [permissions, searchQuery]);

    // Logika Pagination
    const totalPages = Math.ceil(displayPermissions.length / itemsPerPage);
    const paginatedPermissions = displayPermissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex justify-between items-center mt-2 mx-6 mb-6">
                <h1 className="text-3xl font-bold">Permissions</h1>
            </div>
            <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                
                {/* HAPUS BAGIAN TAB DI SINI */}
                
                <Search
                    placeholder="Search (Name)"
                    onSearch={setSearchQuery}
                    className="max-w-sm"
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                ID
                                <SortButton<Permission>
                                    data={displayPermissions}
                                    sortKey="id"
                                    onSort={setDisplayPermissions}
                                />
                            </TableHead>
                            <TableHead>
                                Name
                                <SortButton<Permission>
                                    data={displayPermissions}
                                    sortKey="name"
                                    onSort={setDisplayPermissions}
                                />
                            </TableHead>
                            <TableHead>Guard Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPermissions.length > 0 ? (
                            paginatedPermissions.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell>{permission.id}</TableCell>
                                    <TableCell>{permission.name}</TableCell>
                                    <TableCell>
                                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                                            {permission.guard_name}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    No permissions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                
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