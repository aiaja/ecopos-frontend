// Lokasi: D:\Coolyeah\Bengkod\ecopos\ecopos-frontend\src\components\users\role\role-table.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Role } from "@/datas/roles";

// Import komponen UI dari shadcn
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SortButton } from "@/components/ui/sort";

// Tentukan tipe untuk props yang diterima komponen ini
interface RolesTableProps {
  roles: Role[];
  onDelete: (id: number) => void;
}

// Gunakan "export function" (Named Export)
export function RolesTable({ roles, onDelete }: RolesTableProps) {
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useEffect ini akan mengatur data yang ditampilkan berdasarkan filter dan data asli dari props
  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayRoles(filtered);
    setCurrentPage(1); // Selalu kembali ke halaman 1 setiap kali filter berubah
  }, [roles, searchQuery]);

  // Logika untuk memotong data sesuai halaman yang aktif
  const totalPages = Math.ceil(displayRoles.length / itemsPerPage);
  const paginatedRoles = displayRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Button asChild className="w-32">
          <Link href="/user-management/role/new">New Role</Link>
        </Button>
      </div>

      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Search
          placeholder="Search (Role Name)"
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>
                Role Name
                <SortButton<Role>
                  data={displayRoles}
                  sortKey="name"
                  onSort={setDisplayRoles}
                />
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button asChild type="button" className="w-18">
                        <Link href={`/user-management/role/${role.id}/edit`}>Edit</Link>
                      </Button>
                      <Button className="w-18 bg-red-500 hover:bg-red-500/90" onClick={() => onDelete(role.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No roles found for "{searchQuery}".
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