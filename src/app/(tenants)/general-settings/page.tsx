import { SettingForm } from "@/components/general-settings/settings-form";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="px-6 text-xl font-bold">General Settings</h1>
      <SettingForm />
    </div>
  );
}
