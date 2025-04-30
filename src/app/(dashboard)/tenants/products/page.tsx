import { Product, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Product[]> {
  // Fetch data from your API here.
    return [
      {
          id: 123,
          category: "Snacks", 
          name: "Chocolate Bar",
          sku: "BAR-SNA-0001",
          stock: 10,
          unit: 1,
          initialPrice: 10000,
          sellingPrice: 15000, 
          netProfit: 5000,
          type: "Food",
          nonStock: "No"
      },
      // ...
    ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
