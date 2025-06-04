import { ReportCards } from "@/components/sellling-histories/selling-report";
import { SellingsTable } from "@/components/sellling-histories/selling-table";
import { DetailView } from "@/components/sellling-histories/selling-view";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">Selling Histories</h1>
      <ReportCards />
      <SellingsTable />
        {/* <DetailView /> */}
    </div>
  );
}
