import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function ProductList({ products }: { products: any[] }) {
  return (
    <div className="gap-4 flex flex-col">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={product.image} alt={product.name} className="object-cover pb-6" />
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-primary/75 font-bold">IDR {product.price}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
