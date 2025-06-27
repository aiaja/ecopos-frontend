import { SellingsTable } from "@/components/sellling-histories/selling-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">Selling Histories</h1>
      <SellingsTable />
    </div>
  );
}
