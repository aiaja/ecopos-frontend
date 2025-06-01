"use client";

import React, { useState, useEffect } from "react";

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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { permissionsWeb, permissionsMobile, Permission } from "../../../datas/permissions";

export function PermissionTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "web" | "mobile">("all");

  // Filter data based on active tab
  const getFilteredPermissions = () => {
    let data: Permission[] = [];
    if (activeTab === "web") {
      data = permissionsWeb;
    } else if (activeTab === "mobile") {
      data = permissionsMobile;
    } else {
      data = [...permissionsWeb, ...permissionsMobile];
    }

    return data.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.guardName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPermissions = getFilteredPermissions();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);


  return (
    <div className="">
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Permission</h1>
      </div>
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Navbar */}
        <div className="flex gap-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === "all" ? "text-primary border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "web" ? "text-primary border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("web")}
          >
            Web
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "mobile" ? "text-primary border-b-2 border-primary" : ""}`}
            onClick={() => setActiveTab("mobile")}
          >
            Mobile app
          </button>
        </div>

        {/* Search Bar */}
        <div className="text-right">
          <Search
            placeholder="Search (Name/Guard Name)"
            onSearch={(value) => setSearchQuery(value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Guard Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPermissions.length > 0 ? (
              paginatedPermissions.map((permission: Permission, index: number) => (
                <TableRow key={`${permission.guardName}-${permission.id}-${index}`}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.guardName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No permissions found.
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