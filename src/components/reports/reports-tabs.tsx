'use client';

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
import { Printer, Download } from "lucide-react";
import React from "react";
import DatePicker from "./date-picker";

interface ReportTabsProps {
  onGenerateReport: (startDate: string, endDate: string) => void;
  onPrintReport: () => void;
  onDownloadReport: (startDate: string, endDate: string) => void;
  type: "Selling" | "Cashier";
}

export function ReportsTabs({
  onGenerateReport,
  onPrintReport,
  onDownloadReport,
  type,
}: ReportTabsProps) {

  const [selectedTab, setSelectedTab] = React.useState("Selling");
  const [dateRange, setDateRange] = React.useState({
    startDate: "",
    endDate: "",
  });

  const handleGenerate = () => {
    const { startDate, endDate } = dateRange;
    onGenerateReport(startDate, endDate);
  };

  const handlePrint = () => {
    onPrintReport();
  };

  const handleDownload = () => {
    onDownloadReport(dateRange.startDate, dateRange.endDate);
  };

  const handleStartDateChange = (date: string) => {
    setDateRange((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date: string) => {
    setDateRange((prev) => ({ ...prev, endDate: date }));
  }


  return (
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Label htmlFor="date" className="pb-2">
                  Pick Date Range
                </Label>
                <div className="flex gap-2">
                  <DatePicker onChange={handleStartDateChange} placeholder="Start Date" value={dateRange.startDate} />
                  <DatePicker onChange={handleEndDateChange} placeholder="End Date" value={dateRange.endDate} />
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleGenerate}>
                  Generate
                </Button>
                <Button>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
  );
}