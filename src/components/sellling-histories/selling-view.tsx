import { sellingHistories, SellingHistory } from "@/datas/sellingHistories";

export function DetailView() {
  return (
    <div className="flex flex-col gap-4 p-4">
    <h1 className="px-6 text-xl font-bold">
      View {sellingHistories[0]?.code}
    </h1>
    
      
    </div>
  );
}
