import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCode, Clock, Eye, Lock } from "lucide-react";
import { toast } from "sonner";

interface PasteFormProps {
  onSubmit: (data: PasteData) => Promise<string>;
  isAuthenticated?: boolean;
}

export interface PasteData {
  title: string;
  content: string;
  expiresIn: string;
  maxViews: string;
  isPrivate: boolean;
}

const PasteForm = ({ onSubmit, isAuthenticated = false }: PasteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState("never");
  const [maxViews, setMaxViews] = useState("unlimited");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Paste content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const pasteUrl = await onSubmit({
        title: title.trim() || "Untitled",
        content,
        expiresIn,
        maxViews,
        isPrivate,
      });
      
      toast.success("Paste created successfully!", {
        description: "Your paste URL has been copied to clipboard.",
      });
      
      // Copy to clipboard
      await navigator.clipboard.writeText(pasteUrl);
      
      // Reset form
      setTitle("");
      setContent("");
      setExpiresIn("never");
      setMaxViews("unlimited");
      setIsPrivate(false);
    } catch (error) {
      toast.error("Failed to create paste", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileCode className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">New Paste</h2>
            <p className="text-sm text-muted-foreground">Create a new code snippet or text paste</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            placeholder="My awesome code snippet..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary/50 border-border focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            placeholder="Paste your code or text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="paste-editor min-h-[300px] resize-y"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Expiration
            </Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="10m">10 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Max Views
            </Label>
            <Select value={maxViews} onValueChange={setMaxViews}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select max views" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Unlimited</SelectItem>
                <SelectItem value="1">Burn after reading (1)</SelectItem>
                <SelectItem value="10">10 Views</SelectItem>
                <SelectItem value="50">50 Views</SelectItem>
                <SelectItem value="100">100 Views</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Visibility
            </Label>
            <Select 
              value={isPrivate ? "private" : "public"} 
              onValueChange={(v) => setIsPrivate(v === "private")}
              disabled={!isAuthenticated}
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private" disabled={!isAuthenticated}>
                  Private {!isAuthenticated && "(Sign in required)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
        <FileCode className="h-5 w-5" />
        Create Paste
      </Button>
    </form>
  );
};

export default PasteForm;
