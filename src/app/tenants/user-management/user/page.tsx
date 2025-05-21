import { UsersTable } from "@/components/user-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <UsersTable />
    </div>
  );
}
