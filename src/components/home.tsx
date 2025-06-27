"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableCell, TableCaption, TableHead } from "@/components/ui/table";
import { DashboardService } from "@/services/dashboard";
import { TodaySell, TodayIncome, BestSellingProduct } from "@/datas/dashboard";
import { useState, useEffect } from "react";

export function DashboardCards() {
  const [todaySell, setTodaySell] = useState<TodaySell[]>([]);
  const [todayIncome, setTodayIncome] = useState<TodayIncome[]>([]);
    const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Today Sells
  const fetchTodaySells = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const sellData = await DashboardService.getTodaySells(outletId);
      setTodaySell([sellData]);
      console.log("selldata", sellData)
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // Fetch Today Incomes
  const fetchTodayIncomes = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const incomeData = await DashboardService.getTodayIncomes(outletId);
      setTodayIncome([incomeData]);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

   const fetchBestSellingProducts = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || "";
      const products = await DashboardService.getBestSellingProducts(outletId);
      setBestSellingProducts(products);
    } catch (error) {
      console.error("Error fetching best selling products:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTodaySells(), fetchTodayIncomes(), fetchBestSellingProducts()]);
      setLoading(false);
    };
    fetchData();
  }, []); // Runs once after the component mounts

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Calculate Total Revenue and Sales
  const totalRevenue = todayIncome.reduce((acc, income) => acc + income.income, 0);
  const totalSales = todaySell.reduce((acc, sale) => acc + sale.sale, 0);

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="relative">
            <CardTitle className="text-center text-xl font-semibold tabular-nums">
              <div className="border-b-2 pb-2">
              <h1>TODAY INCOME</h1>
              </div>
              <div className="pt-2">
              Rp {totalRevenue}
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="relative">
            <CardTitle className="text-center text-xl font-semibold tabular-nums">
              <div className="border-b-2 pb-2">
              <h1>Sales Today</h1>
              </div>
              <div className="pt-2">
              {totalSales}
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* TABLE */}
      <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xl pb-2">TODAY BEST SELLING PRODUCTS</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Quantity Sold</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestSellingProducts.map((item) => (
            <TableRow key={item.product.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.product.stock}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell className="text-right">
                {item.product.selling_price} {item.product.unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
