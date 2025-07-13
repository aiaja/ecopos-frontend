"use client";

import React, { useState, useEffect } from 'react';
import { DashboardService } from '@/services/dashboard';
import { TransactionHistoryService } from '@/services/sellingHistories';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export function SellingsTable() {
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  // Fetch Best Selling Products
  const fetchBestSellingProducts = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || '';
      const productsData = await DashboardService.getBestSellingProducts(outletId);
      setBestSellingProducts(productsData);
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Transaction History
  const fetchTransactionHistory = async () => {
    try {
      const outletId = localStorage.getItem("outlet_id") || '';
      const historyData = await TransactionHistoryService.getTransactionHistory(outletId);
      setTransactionHistory(historyData);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Initialize fetching data on component mount
  useEffect(() => {
    fetchBestSellingProducts();
    fetchTransactionHistory();
  }, []);

  return (
    <div className="m-6 px-4 bg-primary-foreground text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      
      {/* Best Selling Products Table */}
      <div>
        <h3 className="text-xl font-bold mb-4">Best Selling Products</h3>
        {loadingProducts ? (
          <div className="flex justify-center items-center">Loading Best Selling Products...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestSellingProducts.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.stock}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.product.selling_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Transaction History Table */}
      <div>
        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
        {loadingHistory ? (
          <div className="flex justify-center items-center">Loading Transaction History...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Date</TableHead>
                {/* <TableHead>Payment Method</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{parseInt(item.price) * parseInt(item.qty)}</TableCell>
                  <TableCell>{new Date(item.transaction.date).toLocaleString()}</TableCell>
                  {/* <TableCell>{item.transaction.payment_method_id}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Optionally: A button to trigger manual refresh */}
      <Button onClick={() => {
        setLoadingProducts(true);
        setLoadingHistory(true);
        fetchBestSellingProducts();
        fetchTransactionHistory();
      }}>
        Refresh Data
      </Button>
    </div>
  );
}