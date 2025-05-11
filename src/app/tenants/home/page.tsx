import { SectionCards } from "@/components/home";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">DASHBOARD</h1>
      <SectionCards />
      
    </div>
  );
}
