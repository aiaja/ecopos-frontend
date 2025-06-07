import { PaymentMethodForm } from "@/components/payment-method/payment-method-form";


export default function NewPaymentMethodPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <PaymentMethodForm />
    </div>
  );
}