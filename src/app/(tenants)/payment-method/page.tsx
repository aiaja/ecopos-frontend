import { PaymentMethodTable } from "@/components/payment-method/payment-method-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">Payment Methods</h1>
      <PaymentMethodTable />
        {/* <DetailView /> */}
    </div>
  );
}
