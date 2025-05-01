"use client";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import React, { useState } from "react";

import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./ui/table";

import users, { User } from "../datas/users";

export function RoleTable() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered user roles based on search query
  const filteredRole = users.filter(user => 
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      <div className="text-right">
        <Button type="submit">
          New Role
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Table>
          {/* Search Bar Row */}
          <TableHeader className="w-full col-span-7">
            <TableRow>
              <TableHead colSpan={6} className="px-4 py-2">
                <Search
                  placeholder="Search"
                  onSearch={(query) => setSearchQuery(query)} // Set query state
                  className="max-w-sm"
                />
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRole.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-x-2 justify-center">
                    <Button>
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
