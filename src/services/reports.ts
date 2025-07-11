import { BASE_URL } from "./BASE_URL";
import axios from "axios";
import { Product } from "@/datas/products";
import { ReportRequest, ReportsDataSellings, ReportsDataCashier } from "@/datas/reports";

const generateReportSellings = async (ReportRequest: ReportRequest): Promise<ReportsDataSellings> => {
    const response = await axios.post(
        `${BASE_URL}/outlets/${localStorage.getItem("outlet_id")}/reports/sellings`, {
        "start_date": ReportRequest.start_date,
        "end_date": ReportRequest.end_date,
    },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },

        }
    );
    const data = await response.data.data;
    if (!data || !data.sellings) {
        throw new Error("Failed to generate report");
    }
    console.log("Report data:", data);
    return { ...data, type: "Selling"} as ReportsDataSellings;

}

const exportsReportSellings = async (ReportRequest: ReportRequest): Promise<Blob> => {
    const response = await axios.post(
        `${BASE_URL}/outlets/${localStorage.getItem("outlet_id")}/reports/sellings/export`, {
        "start_date": ReportRequest.start_date,
        "end_date": ReportRequest.end_date,
    },

        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: 'blob', // Set response type to blob for file download
        }
    );
    if (response.status !== 200) {
        throw new Error("Failed to export report");
    }
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_sellings_${ReportRequest.start_date}_${ReportRequest.end_date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return blob;
}

const generateReportCashier = async (ReportRequest: ReportRequest): Promise<ReportsDataCashier> => {
    const response = await axios.post(
        `${BASE_URL}/outlets/${localStorage.getItem("outlet_id")}/reports/cashier`, {
        "start_date": ReportRequest.start_date,
        "end_date": ReportRequest.end_date,
    },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },

        }
    );
    const data = await response.data.data;
    if (!data || !data.reports) {
        throw new Error("Failed to generate report");
    }
    console.log("Report data:", data);
    return {...data, type: "Cashier"} as ReportsDataCashier;

}

const exportsReportCashier = async (ReportRequest: ReportRequest): Promise<Blob> => {
    const response = await axios.post(
        `${BASE_URL}/outlets/${localStorage.getItem("outlet_id")}/reports/cashier/export`, {
        "start_date": ReportRequest.start_date,
        "end_date": ReportRequest.end_date,
    },

        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: 'blob', // Set response type to blob for file download
        }
    );
    if (response.status !== 200) {
        throw new Error("Failed to export report");
    }
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_cashier_${ReportRequest.start_date}_${ReportRequest.end_date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return blob;
}


export const ReportService = {
    generateReportSellings,
    exportsReportSellings,
    generateReportCashier,
    exportsReportCashier,
};