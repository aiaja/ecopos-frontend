import { RoleTable } from "@/components/users/role/role-table";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <RoleTable />
    </div>
  );
}