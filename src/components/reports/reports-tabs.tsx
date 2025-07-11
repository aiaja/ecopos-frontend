'use client';

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Download } from "lucide-react";
import DatePicker from "./date-picker";
import { Card, CardContent } from "../ui/card";

interface ReportsTabsProps {
  selectedTab: "Selling" | "Cashier";
  onTabChange: (tab: "Selling" | "Cashier") => void;
  dateRange: { startDate: string; endDate: string };
  onDateChange: (startDate: string, endDate: string) => void;
  onGenerateReport: () => void;
  onPrintReport: () => void;
  onDownloadReport: () => void;
}

export function ReportsTabs({
  selectedTab,
  onTabChange,
  dateRange,
  onDateChange,
  onGenerateReport,
  onPrintReport,
  onDownloadReport,
}: ReportsTabsProps) {
  const handleTabValueChange = (value: string) => {
    onTabChange(value as "Selling" | "Cashier");
  };

  const handleStartDateChange = (date: string) => {
    onDateChange(date, dateRange.endDate);
  };

  const handleEndDateChange = (date: string) => {
    onDateChange(dateRange.startDate, date);
  };

  return (
    <Tabs value={selectedTab} onValueChange={handleTabValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Selling">Selling Report</TabsTrigger>
        <TabsTrigger value="Cashier">Cashier Report</TabsTrigger>
      </TabsList>
      <TabsContent value={selectedTab}>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <div className="space-y-1">
                <div className="pb-2">Pick Date Range</div>
                <div className="flex gap-2">
                  <DatePicker onChange={handleStartDateChange} placeholder="Start Date" value={dateRange.startDate} />
                  <DatePicker onChange={handleEndDateChange} placeholder="End Date" value={dateRange.endDate} />
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={onGenerateReport}>Generate</Button>
                <Button onClick={onPrintReport}>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button onClick={onDownloadReport}>
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