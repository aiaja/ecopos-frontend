"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberDialog from "./MemberDialog";
import NoteDialog from "./NoteDialog";
import VoucherDialog from "./VoucherDialog";
import { PlusIcon } from "@/components/common/Plus";
import { useState } from "react";
import CartCards from "./CartCards";

export function OrderDetails({ orders }: { orders: any[] }) {
  const [isMemberDialogOpen, setMemberDialogOpen] = useState(false);
  const [isNoteDialogOpen, setNoteDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setVoucherDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <CartCards/>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <p>Member</p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMemberDialogOpen(true);
              }}
            >
            <PlusIcon />
              
            </a>
            <MemberDialog
              isOpen={isMemberDialogOpen}
              onClose={() => setMemberDialogOpen(false)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p>
            Note

            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setNoteDialogOpen(true);
              }}
            >
              <PlusIcon />
              </a>
              <NoteDialog
                isOpen={isNoteDialogOpen}
                onClose={() => setNoteDialogOpen(false)}
              />
          </div>
          <div className="flex items-center justify-between">
            <p>Voucher</p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setVoucherDialogOpen(true);
                }}
              >
                <PlusIcon />
              </a>
              <VoucherDialog
                isOpen={isVoucherDialogOpen}
                onClose={() => setVoucherDialogOpen(false)}
              />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>Sub Total</p>
          <p>Tax</p>
          <p>Total</p>
          <p>Money Changes</p>
        </CardContent>
      </Card>
      <Button className="w-full" variant="default">
        Proceed to Payment
      </Button>
    </div>
  );
}
