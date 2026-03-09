import WordPressIntegration from "@/components/settings/WordPressIntegration";
import UserManagement from "@/components/settings/UserManagement";
import TagManager from "@/components/settings/TagManager";

export default function Settings() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure integrations and app settings</p>
      </div>

      <TagManager />
      <WordPressIntegration />
      <UserManagement />
    </div>
  );
}
