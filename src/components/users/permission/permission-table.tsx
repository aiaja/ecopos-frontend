"use client";

import { useState, useEffect, useMemo } from "react";
import type { Permission } from "@/datas/permissions";

import { Search } from "@/components/ui/search";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortButton } from "@/components/ui/sort";

export function PermissionTable({
  permissions,
  userPermissions,
}: {
  permissions: Permission[];
  userPermissions: Permission[];
}) {
  const [displayPermissions, setDisplayPermissions] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userPermissionIds = useMemo(() => {
    return new Set(userPermissions.map((p) => p.id));
  }, [userPermissions]);

  useEffect(() => {
    const filtered = permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.guard_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayPermissions(filtered);
    setCurrentPage(1);
  }, [permissions, searchQuery]);

  const totalPages = Math.ceil(displayPermissions.length / itemsPerPage);
  const paginatedPermissions = displayPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (sorted: Permission[]) => {
    setDisplayPermissions(sorted);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Permissions</h1>
      </div>

      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Search placeholder="Search (Name)" onSearch={setSearchQuery} className="max-w-sm" />

        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-28 text-center">Owned</TableHead>
                <TableHead className="pl-10 w-20">
                  ID
                  <SortButton<Permission>
                    data={displayPermissions}
                    sortKey="id"
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="pl-25 w-auto">
                  Name
                  <SortButton<Permission>
                    data={displayPermissions}
                    sortKey="name"
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="w-32">Guard Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPermissions.length > 0 ? (
                paginatedPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="w-28 text-center">
                      {userPermissionIds.has(permission.id) && (
                        <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
                          Yes
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="w-20 text-sm pl-10">{permission.id}</TableCell>
                    <TableCell className="w-auto font-medium pl-25">{permission.name}</TableCell>
                    <TableCell className="w-32 text-center">
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                        {permission.guard_name}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No permissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
