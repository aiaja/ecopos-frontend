import { ProductList } from "@/components/pos/ProductList";
import { OrderDetails } from "@/components/pos/OrderDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/datas/mockProducts";
import { mockOrders } from "@/datas/mockProducts"; 
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Left Section: Product List */}
      <div className="flex-1 border-r">
      <div className="p-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <Input placeholder="Search products..." className="pl-10" />
        </div>
      </div>
      <Separator/>
        <ScrollArea className="p-4">
          <ProductList products={mockProducts} />
        </ScrollArea>
      </div>

      {/* Right Section: Order Details */}
      <div className="w-[400px]">
        <div className="p-5">
          <h2 className="text-xl font-bold">Order Details</h2>
        </div>
        <Separator />
        <ScrollArea className="p-4">
          <OrderDetails orders={mockOrders} />
        </ScrollArea>
      </div>
    </div>
  );
}