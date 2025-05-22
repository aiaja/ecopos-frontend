import { Plus } from "lucide-react";

export function PlusIcon() {
  return (
    <div className="flex items-center justify-center w-4 h-4 rounded bg-foreground/50 hover:bg-primary">
      <Plus className="text-white" />
    </div>
  );
}