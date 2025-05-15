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
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">Role</h1>
        <Button type="submit" className="w-32">
          New Role
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar */}
        <Search
          placeholder="Search"
          onSearch={(query) => setSearchQuery(query)} // Set query state
          className="max-w-sm"
        />  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRole.length > 0 ? (
              filteredRole.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button className="w-18">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No role found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
