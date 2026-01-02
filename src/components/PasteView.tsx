import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, Eye, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export interface Paste {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  expiresAt?: Date;
  maxViews?: number;
  currentViews: number;
  isOwner?: boolean;
}

interface PasteViewProps {
  paste: Paste;
  onDelete?: (id: string) => Promise<void>;
  isExpired?: boolean;
}

const PasteView = ({ paste, onDelete, isExpired = false }: PasteViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      toast.success("Content copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(paste.id);
      toast.success("Paste deleted successfully");
    } catch (error) {
      toast.error("Failed to delete paste");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isExpired) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
          <Clock className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Paste Expired</h2>
        <p className="text-muted-foreground">
          This paste has expired and is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-border/50">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate">{paste.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDistanceToNow(paste.createdAt, { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {paste.currentViews} view{paste.currentViews !== 1 ? 's' : ''}
                {paste.maxViews && ` / ${paste.maxViews}`}
              </span>
              {paste.expiresAt && (
                <span className="text-primary">
                  Expires {formatDistanceToNow(paste.expiresAt, { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <ExternalLink className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            {paste.isOwner && onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <pre className="paste-editor p-4 overflow-x-auto whitespace-pre-wrap break-words">
            <code>{paste.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PasteView;
