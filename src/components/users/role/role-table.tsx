"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Role } from "@/datas/roles"

// Import komponen UI dari shadcn
import { Button } from "@/components/ui/button"
import { Search } from "@/components/ui/search"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { SortButton } from "@/components/ui/sort"

// Tentukan tipe untuk props yang diterima komponen ini
interface RolesTableProps {
  roles: Role[]
  onDelete: (id: number) => void
}

// Gunakan "export function" (Named Export)
export function RolesTable({ roles, onDelete }: RolesTableProps) {
  const [displayRoles, setDisplayRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Untuk memfilter data kapanpun data utama atau query berubah
  useEffect(() => {
    const filtered = roles.filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))

    setDisplayRoles(filtered)
  }, [roles, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSort = (sortedData: Role[]) => {
    setDisplayRoles(sortedData)
    setCurrentPage(1)
  }

  // Logika untuk memotong data sesuai halaman yang aktif
  const totalPages = Math.ceil(displayRoles.length / itemsPerPage)
  const paginatedRoles = displayRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div>
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Button asChild>
          <Link href="/user-management/role/new">New Role</Link>
        </Button>
      </div>

      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Search placeholder="Search (Role Name)" onSearch={setSearchQuery} className="max-w-sm" />

        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 pl-10">
                  ID
                  <SortButton<Role> data={displayRoles} sortKey="id" onSort={handleSort} />
                </TableHead>
                <TableHead className="w-auto pl-25">
                  Role Name
                  <SortButton<Role> data={displayRoles} sortKey="name" onSort={handleSort} />
                </TableHead>
                <TableHead className="w-48 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.length > 0 ? (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="w-20 font-mono text-sm pl-10">{role.id}</TableCell>
                    <TableCell className="w-auto font-medium pl-25">{role.name}</TableCell>
                    <TableCell className="w-48 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <Button 
                            asChild 
                            size="sm" 
                            type="button"
                            className="text-xs px-3 w-15"
                          >
                            <Link href={`/user-management/role/${role.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            className="text-xs px-3 w-15 bg-red-500 hover:bg-red-500/90 cursor-pointer"
                            onClick={() => onDelete(role.id)}
                          >
                            Delete
                          </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No roles found.
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
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(i + 1)
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
                    e.preventDefault()
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
