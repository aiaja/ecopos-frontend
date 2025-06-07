import { PaymentMethodForm } from "@/components/payment-method/payment-method-form";

export default function EditPaymentMethodPage({ params }: { params: { paymentMethodId: string } }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <PaymentMethodForm mode="edit" paymentMethodId={params.paymentMethodId} />
    </div>
  );
}