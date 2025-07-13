"use client";

import { OrderDetails } from "@/components/pos/order-details/OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockOrders } from "@/datas/mockProducts";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/datas/productCards";
import { ProductCardsService } from "@/services/pos/productCards";
import { ProductCards } from "@/components/pos/product-details/ProductCards";
import { useSearchParams } from "next/navigation"; // To access query parameters (such as OpenBill ID)
import { OpenBillsService } from "@/services/openBills"; // Service to fetch OpenBill data
import { useRouter } from "next/navigation";
import { CartItem } from "@/datas/orderDetails";
import { Voucher } from "@/datas/voucher";
import { VoucherService } from "@/services/voucher";
import { CartService } from "@/services/pos/cart";
import { Transaction } from "@/datas/transaction";
import { TransactionService } from "@/services/transaction";
import { set } from "date-fns";
import { PaymentMethod } from "@/datas/paymentMethod";
import { PaymentMethodService } from "@/services/payment-method";

export default function Home() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const openBillId = searchParams.get("id");



  const [productCards, setProductCards] = useState<ProductCard[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [selectedOpenBill, setSelectedOpenBill] = useState<any | null>(null); // Store selected OpenBill if in update mode

  // OrderDetails specific states
  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState<boolean>(true);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]); // Store payment methods if needed


  // Memoized mode calculation
  const mode = useMemo(() => {
    return selectedOpenBill ? "update" : "create";
  }, [selectedOpenBill]);


  // Fetch functions
  const fetchProductCards = useCallback(async () => {
    try {
      const response = await ProductCardsService.getProductCards(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setProductCards(response as ProductCard[]);
      }
    } catch (error) {
      console.error("Error fetching product cards:", error);
    } finally {
      setInitialLoading(false); // Only set initial loading to false
    }
  }, []);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await VoucherService.getVouchers(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setVouchers(response as Voucher[]);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  }, []);

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await CartService.getCartItems(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setCartItem(response as CartItem[]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItem([]); // Reset cart items on error
    } finally {
      setOrderDetailsLoading(false);
    }
  }, []);

  const fetchOpenBillData = useCallback(async (id: string) => {
    try {
      const response = await OpenBillsService.getOpenBillById(
        localStorage.getItem("outlet_id") || "",
        id
      );
      setSelectedOpenBill(response);
      setOrderDetails(response.details ?? []);
    } catch (error) {
      console.error("Error fetching open bill data:", error);
    } finally {
      setOrderDetailsLoading(false);
    }
  }, []);

  const handleSubmitOpenBills = useCallback(async (values: { customer_name: string }) => {
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

    const submitOpenBills = {
      customer_name: values.customer_name,
      date: new Date().toISOString(),
      voucher_id: null,
      discout_price: 0,
      total_price: Total,
      total_qty: cartItem.reduce((sum, item) => sum + item.quantity, 0),
      products: cartItem.map((item) => ({
        product_id: item.product.id,
        qty: item.quantity,
      })),
    };

    try {
      if (mode === "create") {
        const response = await OpenBillsService.createOpenBills(
          localStorage.getItem("outlet_id") || "",
          submitOpenBills
        );
        if (response) {
          alert("Open Bill Created successfully");
          setCartItem([]);
          fetchCartItems();
        } else {
          alert("Failed to create Open Bill");
        }
      } else if (mode === "update" && selectedOpenBill) {
        const response = await OpenBillsService.updateOpenBills(
          localStorage.getItem("outlet_id") || "",
          selectedOpenBill.id,
          submitOpenBills
        );
        if (response) {
          alert("Open Bill Updated successfully");
          setCartItem([]);
          router.push("/pos");
        } else {
          alert("Failed to update Open Bill");
        }
      }
    } catch (error) {
      console.error("Error while creating or updating open bill:", error);
      alert("An error occurred while processing your request.");
    }
  }, [mode, cartItem, orderDetails, selectedOpenBill, router]);

  const handleSubmitTransactions = useCallback(async (values: { payed_money: number }) => {
    // Calculate totals
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

    const submitTransactions: Transaction = {
      date: new Date().toISOString(),
      note: "",
      voucher_id: null,
      discount_price: 0,
      payed_money: values.payed_money,
      money_changes: values.payed_money - Total,
      total_price: Total,
      total_cost: SubTotal,
      payment_method_id: "",
      tax: 0.11,
      tax_price: Tax,
      total_qty: cartItem.reduce((sum, item) => sum + item.quantity, 0),
      products: cartItem.map((item) => ({
        product_id: item.product.id,
        qty: item.quantity,
      })),
    };

    try {
      const response = await TransactionService.createTransaction(
        localStorage.getItem("outlet_id") || "",
        submitTransactions
      );
      if (response) {
        setCartItem([]);
        fetchCartItems();
      } else {
      }
    } catch (error) {
      console.error("Error while creating transaction:", error);
      alert("An error occurred while processing your request.");
    }
  }, [mode, cartItem, orderDetails, router]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await PaymentMethodService.getPaymentMethods(
        localStorage.getItem("outlet_id") || ""
      );
      if (response) {
        setPaymentMethods(response as PaymentMethod[]);
      } else {
        console.error("Failed to fetch payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchProductCards();
    fetchVouchers();
    fetchPaymentMethods();
  }, [fetchProductCards, fetchVouchers, fetchPaymentMethods]);

  useEffect(() => {
    if (openBillId) {
      fetchOpenBillData(openBillId);
    } else {
      setSelectedOpenBill(null);
      fetchCartItems();
    }
  }, [openBillId, fetchOpenBillData, fetchCartItems]);

  const handleCartUpdate = useCallback(() => {
    if (mode === "create") {
      fetchCartItems();
    } else if (mode === "update" && openBillId) {
      fetchOpenBillData(openBillId);
    }
  }, [mode, openBillId, fetchCartItems, fetchOpenBillData]);

  // Jika tidak menggunakan toast hook, bisa menggunakan alert
  const showSuccess = useCallback((message: string) => {
    alert(message);
  }, []);

  const showError = useCallback((message: string) => {
    alert(message);
  }, []);




  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="flex h-screen w-full">
      {/* Left Section: Product Cards */}
      <div className="w-3/5">
        <ProductCards
          productCards={productCards}
          mode={mode}
          id_openBill={openBillId}
          onCartUpdate={handleCartUpdate}
          onShowSuccess={showSuccess}
          onShowError={showError}
        />
      </div>

      {/* Right Section: Order Details */}
      <div className="w-2/5">
        <div className="p-5">
          <h2 className="text-xl font-bold">Order Details</h2>
        </div>
        <Separator />
        <ScrollArea className="p-2">
          <OrderDetails
            orders={mockOrders}
            mode={mode}
            selectedOpenBill={selectedOpenBill}
            transaction={null}
            cartItem={cartItem}
            orderDetails={orderDetails}
            vouchers={vouchers}
            loading={orderDetailsLoading}
            onSubmitOpenBills={handleSubmitOpenBills}
            onSubmitTransactions={handleSubmitTransactions}
            onChartUpdate={handleCartUpdate}
            onShowSuccess={showSuccess}
            onShowError={showError}
            paymentMethods={paymentMethods}
          />
        </ScrollArea>
      </div>
    </div>
  );
}