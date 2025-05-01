"use client";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import React, { useState } from "react";

import { 
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";

import users, { User } from "../datas/users"; // Import data pengguna
import { SortButton } from "./ui/sort";

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [sortedUsers, setSortedUsers] = useState<User[]>(filteredUsers);

  React.useEffect(() => {
    setSortedUsers(filteredUsers);
  }, [searchQuery]);

  return (
    <div className="">
      <div className="text-right">
        <Button type="submit">
          New User
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
                  placeholder="Search (Name/Email)"
                  onSearch={(value) => setSearchQuery(value)}
                  className="max-w-sm"
                />
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Name
                <SortButton<User>
                  data={sortedUsers}
                  sortKey="name"
                  onSort={setSortedUsers}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Is Owner</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-center">{user.isOwner ? "YES" : "NO"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-x-2 justify-center">
                    <Button>
                      Edit
                    </Button>
                    <Button>
                      Delete 
                      {/* nanti ganti warna abu */}
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
