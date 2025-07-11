'use client';

import { ReportsTabs } from "@/components/reports/reports-tabs";
import ReportsView from "@/components/reports/reports-view";
import { useState } from "react";
import { ReportsData } from "@/datas/reports";
import { ReportService } from "@/services/reports";

export default function Home() {
  const [reportData, setReportData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"Selling" | "Cashier">("Selling");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const handleTabChange = (tab: "Selling" | "Cashier") => {
    setSelectedTab(tab);
    setReportData(null); // Clear previous data when switching tabs
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let response: ReportsData | null = null;
      if (selectedTab === "Selling") {
        response = await ReportService.generateReportSellings({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        });
      } else {
        response = await ReportService.generateReportCashier({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        });
      }
      setReportData(response);
    } catch (error) {
      console.error("Error generating report:", error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      if (selectedTab === "Selling") {
        await ReportService.exportsReportSellings({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        });
      } else {
        await ReportService.exportsReportCashier({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        });
      }
    } catch (error) {
      console.error("Failed to download report", error);
    }
    setLoading(false);
  };

  const handlePrintReport = () => {
    // Implement print logic if needed
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">Reports Tabs</h1>
      <ReportsTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        onGenerateReport={handleGenerateReport}
        onPrintReport={handlePrintReport}
        onDownloadReport={handleDownloadReport}
      />
      <ReportsView reportData={reportData} />
    </div>
  );
}