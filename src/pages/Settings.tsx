import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tag, Settings2, Users } from "lucide-react";
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

      <Accordion type="multiple" className="space-y-3">
        <AccordionItem value="tags" className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold leading-none tracking-tight">Tag Manager</p>
                <p className="text-sm text-muted-foreground mt-1">Search, rename and delete tags across all images</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <TagManager />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="wordpress" className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold leading-none tracking-tight">WordPress Integration</p>
                <p className="text-sm text-muted-foreground mt-1">Connect your WordPress site to sync and publish images</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <WordPressIntegration />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="users" className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold leading-none tracking-tight">User Management</p>
                <p className="text-sm text-muted-foreground mt-1">Invite team members and manage their access levels</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <UserManagement />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
