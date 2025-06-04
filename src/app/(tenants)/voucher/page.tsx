import { VoucherTable } from "@/components/voucher/voucher-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">Reports Tabs</h1>
      <VoucherTable />
      {/* <DetailView /> */}
    </div>
  );
}
