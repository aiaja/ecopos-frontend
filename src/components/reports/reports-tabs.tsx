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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "../date-picker";
import { Printer, Download } from "lucide-react";
import React from "react";

export function ReportsTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Selling">Selling Report</TabsTrigger>
        <TabsTrigger value="Cashier">Cashier Report</TabsTrigger>
      </TabsList>
      <TabsContent value="Selling">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Label htmlFor="date" className="pb-2">
                  Pick Date Range
                </Label>
                <DatePickerWithRange></DatePickerWithRange>
              </div>
              <div className="flex gap-4">
                <Button>Generate</Button>
                <Button>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="Cashier">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Label htmlFor="date" className="pb-2">
                  Pick Date Range
                </Label>
                <DatePickerWithRange></DatePickerWithRange>
              </div>
              <div className="flex gap-4">
                <Button>Generate</Button>
                <Button>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
    </Tabs>
  );
}
