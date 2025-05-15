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
      <div className="flex justify-between items-center mt-2 mx-6 mb-6">
        <h1 className="text-3xl font-bold">User</h1>
        <Button type="submit" className="w-32">
          New User
        </Button>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        {/* Search Bar Row */}
        <Search
          placeholder="Search (Name/Email)"
           onSearch={(value) => setSearchQuery(value)}
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
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
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Is Owner</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell className="text-center">{user.role}</TableCell>
                  <TableCell className="text-center">{user.isOwner ? "YES" : "NO"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center">
                      <Button className="w-18">
                        Edit
                      </Button>
                      <Button className="w-18">
                        Delete 
                        {/* nanti ganti warna abu */}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No user found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
