import { VouchersForm } from "@/components/voucher/voucher-form";

export default function EditVoucherPage({ params }: { params: { voucherId: string } }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <VouchersForm mode="edit" voucherId={params.voucherId} />
    </div>
  );
}