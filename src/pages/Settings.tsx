import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings2,
  Link2,
  Key,
  Download,
  Copy,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function Settings() {
  const [wpUrl, setWpUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockKey = `iv_${Math.random().toString(36).slice(2, 10)}_${Math.random().toString(36).slice(2, 14)}`;
      setApiKey(mockKey);
      setIsGenerating(false);
      toast.success("API key generated");
    }, 800);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  };

  const handleTestConnection = () => {
    if (!wpUrl.trim() || !apiKey) {
      toast.error("Enter your WordPress URL and generate an API key first");
      return;
    }
    toast.info("Connection test is not available in prototype mode");
  };

  const handleConnect = () => {
    if (!wpUrl.trim() || !apiKey) {
      toast.error("Complete all steps before connecting");
      return;
    }
    setIsConnected(true);
    toast.success("WordPress connected (prototype)");
  };

  const handleDownloadPlugin = () => {
    toast.info("Plugin download is not available in prototype mode");
  };

  const steps = [
    { label: "Enter WordPress URL", done: !!wpUrl.trim() },
    { label: "Generate API key", done: !!apiKey },
    { label: "Download & install plugin", done: false },
    { label: "Test connection", done: isConnected },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure integrations and app settings</p>
      </div>

      {/* WordPress Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">WordPress Integration</CardTitle>
                <CardDescription>Connect your WordPress site to sync and publish images</CardDescription>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Not connected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Setup progress */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Setup progress</p>
            <div className="flex gap-3 flex-wrap">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {step.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  <span className={step.done ? "text-foreground" : ""}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Step 1: WordPress URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Link2 className="h-3.5 w-3.5" />
              WordPress Site URL
            </Label>
            <Input
              placeholder="https://your-site.com"
              value={wpUrl}
              onChange={(e) => setWpUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The URL of your WordPress site where the ImageVault plugin will be installed.
            </p>
          </div>

          <Separator />

          {/* Step 2: API Key */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Key className="h-3.5 w-3.5" />
              API Key
            </Label>
            <p className="text-xs text-muted-foreground">
              Generate a unique API key to authenticate the connection between ImageVault and your WordPress site.
              You'll paste this key into the plugin settings in WordPress.
            </p>
            {apiKey ? (
              <div className="flex gap-2">
                <Input value={apiKey} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopyKey}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleGenerateKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={handleGenerateKey} disabled={isGenerating}>
                {isGenerating ? (
                  <><RefreshCw className="h-4 w-4 mr-1.5 animate-spin" /> Generating...</>
                ) : (
                  <><Key className="h-4 w-4 mr-1.5" /> Generate API Key</>
                )}
              </Button>
            )}
          </div>

          <Separator />

          {/* Step 3: Download Plugin */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-sm">
              <Download className="h-3.5 w-3.5" />
              WordPress Plugin
            </Label>
            <p className="text-xs text-muted-foreground">
              Download and install the ImageVault plugin on your WordPress site. The plugin handles image syncing,
              metadata mapping, and publishing from ImageVault to your media library.
            </p>
            <Button variant="outline" onClick={handleDownloadPlugin}>
              <Download className="h-4 w-4 mr-1.5" /> Download imagevault-connector.zip
            </Button>

            <div className="rounded-md border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Installation instructions
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Log in to your WordPress admin panel</li>
                <li>Go to <span className="font-medium text-foreground">Plugins → Add New → Upload Plugin</span></li>
                <li>Upload the <span className="font-mono text-foreground">imagevault-connector.zip</span> file</li>
                <li>Activate the plugin</li>
                <li>Navigate to <span className="font-medium text-foreground">Settings → ImageVault</span></li>
                <li>Paste your API key and save</li>
              </ol>
            </div>
          </div>

          <Separator />

          {/* Step 4: Connect */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleTestConnection} disabled={!wpUrl.trim() || !apiKey}>
              <ExternalLink className="h-4 w-4 mr-1.5" /> Test Connection
            </Button>
            <Button onClick={handleConnect} disabled={!wpUrl.trim() || !apiKey || isConnected}>
              {isConnected ? (
                <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Connected</>
              ) : (
                <><Link2 className="h-4 w-4 mr-1.5" /> Connect</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
