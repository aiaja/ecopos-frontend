'use client';

import { ReportsTabs } from "@/components/reports/reports-tabs";
import ReportsView from "@/components/reports/reports-view";
import { useState } from "react";
import { ReportsData } from "@/datas/reports";
import { ReportService } from "@/services/reports";

export default function Home() {
  const [reportData, setReportData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    console.log("Generating report from", startDate, "to", endDate);
    // Call the service to generate the report
    try {
      const response = await ReportService.generateReportSellings({
        start_date: startDate,
        end_date: endDate,
      })
      if (response) {
        setReportData(response);
      } else {
        console.error("Failed to generate report");
      }
      console.log("Report generated successfully:", response);
    } catch (error) {
      console.error("Error generating report:", error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }

  const handlePrintReport = () => {

  }

  const handleDownloadReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    const response = await ReportService.exportsReportSellings({
      start_date: startDate,
      end_date: endDate,
    });
    if (response) {
      console.log("Report downloaded successfully");
    } else {
      console.error("Failed to download report");
    }
    setLoading(false);
  }

  const handleTabChange = (value: string) => {
    // Logic to handle tab change
    console.log("Tab changed to", value);

  }

  const handleDateChange = (startDate: string, endDate: string) => {
    // Logic to handle date change
    console.log("Date range changed to", startDate, "to", endDate);
  }




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
        onGenerateReport={handleGenerateReport}
        onPrintReport={handlePrintReport}
        onDownloadReport={handleDownloadReport}
        type="Selling"
      />
      <ReportsView reportData={reportData} />
    </div>
  );
}