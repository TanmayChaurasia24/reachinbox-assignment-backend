import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Calendar,
  Circle,
  RefreshCw,
  Archive,
  Trash2
} from "lucide-react";

interface EmailHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEmails: string[];
  onRefresh: () => void;
}

export function EmailHeader({ 
  searchQuery, 
  onSearchChange, 
  selectedEmails,
  onRefresh 
}: EmailHeaderProps) {
  const connectedAccounts = 2;
  const isSyncing = true;

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      {/* Left side - Actions */}
      <div className="flex items-center gap-3">
        {selectedEmails.length > 0 ? (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedEmails.length} selected
            </span>
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button variant="filter">
              <Filter className="w-4 h-4 mr-2" />
              All Accounts
            </Button>
            <Button variant="filter">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 days
            </Button>
          </>
        )}
      </div>

      {/* Right side - Search and Status */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search emails by subject, sender, or label..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRefresh}
            className="px-2"
          >
            <RefreshCw className={cn(
              "w-4 h-4",
              isSyncing && "animate-spin"
            )} />
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className={cn(
              "w-2 h-2 fill-current",
              isSyncing ? "text-success" : "text-muted-foreground"
            )} />
            <span>Connected accounts: {connectedAccounts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}