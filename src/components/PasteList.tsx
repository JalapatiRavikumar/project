import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileCode, Eye, Clock, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface PasteListItem {
  id: string;
  title: string;
  createdAt: Date;
  expiresAt?: Date;
  currentViews: number;
  maxViews?: number;
  contentPreview: string;
}

interface PasteListProps {
  pastes: PasteListItem[];
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const PasteList = ({ pastes, onDelete, isLoading = false }: PasteListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-5 bg-secondary rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-secondary rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pastes.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
          <FileCode className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No pastes yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first paste to get started
        </p>
        <Button asChild>
          <Link to="/">Create New Paste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pastes.map((paste) => (
        <div 
          key={paste.id} 
          className="glass-card p-4 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link 
                to={`/paste/${paste.id}`}
                className="text-lg font-semibold hover:text-primary transition-colors truncate block"
              >
                {paste.title}
              </Link>
              <p className="text-sm text-muted-foreground font-mono mt-1 truncate">
                {paste.contentPreview}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(paste.createdAt, { addSuffix: true })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
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
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/paste/${paste.id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(paste.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasteList;
