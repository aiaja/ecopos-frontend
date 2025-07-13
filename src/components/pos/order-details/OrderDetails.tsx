"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartCards from "./CartCards";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { CartItem } from "@/datas/orderDetails";
import OpenBillsDialog from "@/components/open-bills/open-bills-dialog";
import { OpenBills } from "@/datas/openBills";
import TransactionsDialog from "../transaction-dialog";
import { Transaction } from "@/datas/transaction";
import { Voucher } from "@/datas/voucher";
import { PaymentMethodService } from "@/services/payment-method";
import { PaymentMethod } from "@/datas/paymentMethod";
import SuccessDialog from "../success-dialog";
import ErrorDialog from "../error-dialog";


interface OrderDetailsProps {
  orders?: any[];
  mode: "create" | "update";
  selectedOpenBill: (OpenBills & { id: string }) | null;
  transaction: Transaction | null;
  cartItem: CartItem[];
  orderDetails: any[];
  vouchers: Voucher[];
  loading: boolean;
  onSubmitOpenBills: (values: { customer_name: string }) => Promise<void>;
  onSubmitTransactions: (values: { payed_money: number }) => Promise<void>;
  onChartUpdate?: () => void;
  onShowSuccess?: (message: string) => void; // Callback for showing success messages
  onShowError?: (message: string) => void; // Callback for showing error messages
  paymentMethods?: PaymentMethod[]; // List of payment methods
}

// Memoized OrderDetails component
export const OrderDetails = memo(function OrderDetails({
  orders,
  mode,
  selectedOpenBill,
  transaction,
  cartItem,
  orderDetails,
  vouchers,
  loading,
  onSubmitOpenBills,
  onSubmitTransactions,
  onChartUpdate = () => {},
  onShowSuccess = (message: string) => {
    console.log("Success:", message);
  }, // Default success handler
  onShowError = (message: string) => {
    console.error("Error:", message);
  }, // Default error handler
  paymentMethods = [], // Default to an empty array if not provided

  
}: OrderDetailsProps) {
  const [isOpenBillsDialogOpen, setOpenBillsDialogOpen] = useState(false);
  const [isTransactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(true);

  // Memoized calculations
  const calculations = useMemo(() => {
    const itemsToCalculate = mode === "create" ? cartItem : orderDetails;
    
    const SubTotal = itemsToCalculate.reduce(
      (sum: number, item: any) =>
        sum +
        (item.product && item.quantity
          ? Number(item.product.selling_price) * item.quantity
          : Number(item.product?.selling_price) || 0),
      0
    );

    const Tax = SubTotal * 0.11;
    const Total = SubTotal + Tax;

    return { SubTotal, Tax, Total };
  }, [cartItem, orderDetails, mode]);

  const displayItems = useMemo(() => {
    return mode === "create" ? cartItem : orderDetails;
  }, [mode, cartItem, orderDetails]);

  const handleOpenBillsClick = useCallback(() => {
    setOpenBillsDialogOpen(true);
  }, []);

  const handleTransactionsClick = useCallback(() => {
    setTransactionsDialogOpen(true);
  }, []);

  const handleOpenBillsClose = useCallback(() => {
    setOpenBillsDialogOpen(false);
  }, []);

  const handleTransactionsClose = useCallback(() => {
    setTransactionsDialogOpen(false);
  }, []);

  const handleCartUpdate = useCallback(() => {
    onChartUpdate();
    console.log("Cart updated");
  }, [onChartUpdate]);

  const onShowSuccessTransaction = useCallback((message: string) => {
    setTransactionsDialogOpen(false);
    setIsSuccessDialogOpen(true);
  }, [onShowSuccess]);

  const onShowErrorTransaction = useCallback((message: string) => {
    setTransactionsDialogOpen(false);
    setIsErrorDialogOpen(true);
  }, [onShowError]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4">
      {/* Display cart items or OpenBill details based on the mode */}
      <CartCards 
        cartItems={displayItems} 
        onChartUpdate={handleCartUpdate} 
        onShowSuccess={onShowSuccess} 
        onShowError={onShowError} 
      />

      <Card>
        <CardContent>
          <div className="flex justify-between">
            <p>Sub Total</p>
            <p>{calculations.SubTotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>{calculations.Tax}</p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>{calculations.Total}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-between gap-4">
        <Button
          className="flex-1"
          onClick={handleOpenBillsClick}
        >
          {mode === "create" ? "Create Open Bill" : "Update Open Bill"}
        </Button>
        <OpenBillsDialog
          isOpen={isOpenBillsDialogOpen}
          onClose={handleOpenBillsClose}
          openBill={selectedOpenBill}
          onSubmit={onSubmitOpenBills}
          mode={mode}
        />
        <Button
          className="flex-1"
          onClick={handleTransactionsClick}
        >
          Proceed to Payment
        </Button>
      </div>
      <TransactionsDialog
        isOpen={isTransactionsDialogOpen}
        onClose={handleTransactionsClose}
        transaction={transaction}
        onSubmit={onSubmitTransactions}
        mode={mode}
        vouchers={vouchers}
        orderData={{
          items: displayItems,
          subtotal: calculations.SubTotal,
          tax: calculations.Tax,
          taxRate: 0.11, // Assuming a fixed tax rate of 11%
          total: calculations.Total,
        }}
        listPaymentMethod={paymentMethods}
        cartItems={displayItems}
        outletTax={0.11} // Assuming a fixed outlet tax rate of 11%
        setCartItems={handleCartUpdate} // Callback to update cart items
        fetchCartItems={handleCartUpdate} // Callback to fetch cart items
        onShowSuccess={ onShowSuccessTransaction}
        onShowError={ onShowErrorTransaction}

      />
      {/* Success/Error Dialogs */}
      {isSuccessDialogOpen && (
        <SuccessDialog
          isOpen={isSuccessDialogOpen}
          onClose={() => setIsSuccessDialogOpen(false)}
          onPrint={() => {
            console.log("Print action triggered");
            setIsSuccessDialogOpen(false);
          }}
        />
      )}
      {isErrorDialogOpen && (
        <ErrorDialog
          isOpen={isErrorDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          onRetry={() => {
            console.log("Retry action triggered");
            setIsErrorDialogOpen(false);
          }}
          errorMessage="An error occurred while processing your request."
        />
      )}
    </div>
  );
});

export const OrderDetailsWithCustomComparison = memo(function OrderDetails(props: OrderDetailsProps) {
  // Component implementation same as above
  return <OrderDetails {...props} />;
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.mode === nextProps.mode &&
    prevProps.loading === nextProps.loading &&
    prevProps.cartItem === nextProps.cartItem &&
    prevProps.orderDetails === nextProps.orderDetails &&
    prevProps.vouchers === nextProps.vouchers &&
    prevProps.selectedOpenBill === nextProps.selectedOpenBill &&
    prevProps.transaction === nextProps.transaction
  );
});