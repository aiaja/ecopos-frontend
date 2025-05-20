"use client";

import { Search } from "@/components/ui/search";
import React, { useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";

import { permissionsWeb, permissionsMobile, Permission } from "../datas/permissions";

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

  return (
    <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      {/* Navbar */}
      <div className="flex gap-4 border-b pb-2">
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
          {filteredPermissions.length > 0 ? (
            filteredPermissions.map((permission: Permission, index: number) => (
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
    </div>
  );
}