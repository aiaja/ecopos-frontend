import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ReportsData } from '@/datas/reports';

const formatCurrency = (amount: any) => {
  if (amount === null || amount === undefined) {
    return 'Rp 0';
  }
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[,]/g, '')) : amount;
    return numAmount.toLocaleString('id-ID');
  };

  const parseAmount = (amountStr: any) => {
    if (amountStr === null || amountStr === undefined) {
      return 0;
    }
    if (typeof amountStr === 'string') {
      return parseFloat(amountStr.replace(/[,]/g, ''));
    }
    return amountStr;
  };

  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

const ReportsView = ({ reportData }: { reportData: ReportsData | null }) => {
  if (!reportData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Laporan</h2>
          <p className="text-gray-600">Tidak ada data laporan yang tersedia.</p>
        </div>
        <Separator className="my-6" />
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-center">Tidak ada data laporan yang tersedia</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Silakan pilih periode yang berbeda atau pastikan data laporan telah dibuat.
          </CardContent>
        </Card>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////

  // Use discriminated union for type-safe rendering
  if (reportData.type === "Selling") {
    // Render Selling report table
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Laporan Penjualan</h1>
        <h2 className="text-xl text-blue-600 font-semibold">{reportData.header?.outlet_name}</h2>
        <p className="text-gray-600 mt-2">
          Periode: {formatDate(reportData.header?.start_date)} - {formatDate(reportData.header?.end_date)}
        </p>
      </div>

      {/* Grand Total Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-center text-lg">GRAND TOTAL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">BIAYA</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">DISCOUNT<br/>PER<br/>PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">DISCOUNT<br/>PER ITEM</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">PENJUALAN<br/>SETELAH<br/>DISCOUNT</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>KOTOR</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>BERSIH<br/>SEBELUM<br/>DISKON<br/>PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>BERSIH<br/>SETELAH<br/>DISKON<br/>PENJUALAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_cost)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_gross)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_discount)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_discount_per_item)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_net)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_gross_profit)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_net_profit_before_discount_selling)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_net_profit_after_discount_selling)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Laporan Penjualan</CardTitle>
          <div className="text-center text-sm text-gray-600">
            {reportData.header?.outlet_name}
          </div>
          <div className="text-center text-sm text-gray-600">
            Periode: {formatDate(reportData.header?.start_date)} - {formatDate(reportData.header?.end_date)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">SKU</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">PRODUCT<br/>NAME</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">HARGA</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">KUANTITAS</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">PENJUALAN</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">DISKON</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">NET<br/>SELLING</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">GROSS<br/>PROFIT</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">NET PROFIT</th>
                </tr>
              </thead>
              <tbody>
                {reportData.sellings?.map((selling, sellingIndex) => (
                  selling.transaction_details.map((detail, detailIndex) => {
                    const grossProfit = parseAmount(detail.price) - parseAmount(detail.cost);
                    const netProfit = grossProfit; // Assuming no additional deductions
                    
                    return (
                      <tr key={`${sellingIndex}-${detailIndex}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-blue-600">
                          {selling.code}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          Product {detail.product.name}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {formatCurrency(detail.price)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {detail.qty}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-red-600">
                          {formatCurrency(parseAmount(detail.price) * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          0
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                          {formatCurrency(parseAmount(detail.price) * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-green-600">
                          {formatCurrency(grossProfit * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-green-600">
                          {formatCurrency(netProfit * parseAmount(detail.qty))}
                        </td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-600">
                {reportData.header?.total_transactions}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
              <p className="text-2xl font-bold text-green-600">
                {reportData.footer?.total_qty}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(reportData.footer?.total_gross)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(reportData.footer?.total_net_profit_after_discount_selling)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.sellings?.map((selling, index) => (
              <div key={selling.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Transaksi {selling.code}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(selling.created_at)} • Metode: {selling.payment_method.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Catatan: {selling.note}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {selling.total_qty} item(s)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Harga</p>
                    <p className="font-semibold">{formatCurrency(selling.total_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Cost</p>
                    <p className="font-semibold">{formatCurrency(selling.total_cost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pajak ({selling.tax}%)</p>
                    <p className="font-semibold">{formatCurrency(selling.tax_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dibayar</p>
                    <p className="font-semibold">{formatCurrency(selling.payed_money)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  if (reportData.type === "Cashier") {
    // Render Cashier report table
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Laporan Penjualan</h1>
        <h2 className="text-xl text-blue-600 font-semibold">{reportData.header?.outlet_name}</h2>
        <p className="text-gray-600 mt-2">
          Periode: {formatDate(reportData.header?.start_date)} - {formatDate(reportData.header?.end_date)}
        </p>
      </div>

      {/* Grand Total Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-center text-lg">GRAND TOTAL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">BIAYA</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">DISCOUNT<br/>PER<br/>PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">DISCOUNT<br/>PER ITEM</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">PENJUALAN<br/>SETELAH<br/>DISCOUNT</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>KOTOR</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>BERSIH<br/>SEBELUM<br/>DISKON<br/>PENJUALAN</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-medium text-sm">KEUNTUNGAN<br/>BERSIH<br/>SETELAH<br/>DISKON<br/>PENJUALAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_cost)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_gross)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_discount)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_discount_per_item)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    {formatCurrency(reportData.footer?.total_net)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_gross_profit)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_net_profit_before_discount_selling)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                    {formatCurrency(reportData.footer?.total_net_profit_after_discount_selling)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Laporan Penjualan</CardTitle>
          <div className="text-center text-sm text-gray-600">
            {reportData.header?.outlet_name}
          </div>
          <div className="text-center text-sm text-gray-600">
            Periode: {formatDate(reportData.header?.start_date)} - {formatDate(reportData.header?.end_date)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">SKU</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-medium">PRODUCT<br/>NAME</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">HARGA</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">KUANTITAS</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">PENJUALAN</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">DISKON</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">NET<br/>SELLING</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">GROSS<br/>PROFIT</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-medium">NET PROFIT</th>
                </tr>
              </thead>
              <tbody>
                {reportData.cashier?.map((cashier, cashierIndex) => (
                  cashier.transaction_details.map((detail, detailIndex) => {
                    const grossProfit = parseAmount(detail.price) - parseAmount(detail.cost);
                    const netProfit = grossProfit; // Assuming no additional deductions
                    
                    return (
                      <tr key={`${cashierIndex}-${detailIndex}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-blue-600">
                          {cashier.code}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          Product {detail.product.name}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {formatCurrency(detail.price)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          {detail.qty}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-red-600">
                          {formatCurrency(parseAmount(detail.price) * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          0
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-blue-600">
                          {formatCurrency(parseAmount(detail.price) * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-green-600">
                          {formatCurrency(grossProfit * parseAmount(detail.qty))}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-green-600">
                          {formatCurrency(netProfit * parseAmount(detail.qty))}
                        </td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-600">
                {reportData.header?.total_transactions}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
              <p className="text-2xl font-bold text-green-600">
                {reportData.footer?.total_qty}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(reportData.footer?.total_gross)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(reportData.footer?.total_net_profit_after_discount_selling)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.cashier?.map((cashier, index) => (
              <div key={cashier.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Transaksi {cashier.code}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(cashier.created_at)} • Metode: {cashier.payment_method.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Catatan: {cashier.note}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {cashier.total_qty} item(s)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Harga</p>
                    <p className="font-semibold">{formatCurrency(cashier.total_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Cost</p>
                    <p className="font-semibold">{formatCurrency(cashier.total_cost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pajak ({cashier.tax}%)</p>
                    <p className="font-semibold">{formatCurrency(cashier.tax_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dibayar</p>
                    <p className="font-semibold">{formatCurrency(cashier.payed_money)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  return null;
};

export default ReportsView;
