import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "../date-picker";
import { Printer, Download } from "lucide-react";
import React from "react";

export function SettingsTabs() {
  return (
    <Card>
          <CardContent className="space-y-2">
              <div className="">
                <Label className="pb-2">
                  Outlet Name
                </Label>
                <Input></Input>
              </div>
              <div className="">
                <Label className="pb-2">
                  Address
                </Label>
                <Textarea></Textarea>
              </div>
              <div className="">
                <Label className="pb-2">
                  Phone Number
                </Label>
                <Input></Input>
              </div>
              <div className="">
                <Label className="pb-2">
                  Tax
                </Label>
                <Input></Input>
              </div>
              <div className="flex gap-4">
                <Button>Save</Button>
              </div>
          </CardContent>
        </Card>
  );
}
