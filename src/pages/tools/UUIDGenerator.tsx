
import { useState } from "react";
import { Key, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const UUIDGenerator = () => {
  const [uuid, setUuid] = useState("");
  const [version, setVersion] = useState("4");
  const [quantity, setQuantity] = useState("1");

  const generateUUID = () => {
    const count = parseInt(quantity);
    const uuids = [];
    
    for (let i = 0; i < count; i++) {
      // Generate UUID v4
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      uuids.push(uuid);
    }
    
    setUuid(uuids.join('\n'));
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''} successfully!`);
  };

  const copyToClipboard = () => {
    if (!uuid) {
      toast.error("No UUID to copy");
      return;
    }
    
    navigator.clipboard.writeText(uuid);
    toast.success("UUID copied to clipboard!");
  };

  const features = [
    "Generate UUID v4 (random)",
    "Bulk UUID generation",
    "RFC 4122 compliant",
    "Copy to clipboard",
    "High entropy random generation"
  ];

  return (
    <ToolTemplate
      title="UUID Generator"
      description="Generate unique identifiers (UUIDs) in various formats"
      icon={Key}
      features={features}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>UUID Version</Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Version 4 (Random)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 UUID</SelectItem>
                <SelectItem value="5">5 UUIDs</SelectItem>
                <SelectItem value="10">10 UUIDs</SelectItem>
                <SelectItem value="25">25 UUIDs</SelectItem>
                <SelectItem value="50">50 UUIDs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateUUID} className="w-full" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate UUID
        </Button>

        {uuid && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated UUID(s)</Label>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <textarea
              value={uuid}
              readOnly
              className="w-full p-3 border rounded-md bg-gray-50 font-mono text-sm min-h-[100px]"
            />
          </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default UUIDGenerator;
