import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Reply, 
  ReplyAll, 
  Forward, 
  Archive, 
  Trash2, 
  Star,
  Clock,
  User,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  date: string;
  folder: string;
  aiLabel: string;
  labelColor: string;
  isRead: boolean;
  isStarred: boolean;
}

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
}

export function EmailDetail({ email, onClose }: any) {
  const fullEmailContent = email.Content

  return (
    <div className="w-full h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base lg:text-lg font-semibold text-foreground">Email Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-2 py-0.5 text-white border-0",
              email.labelColor
            )}
          >
            {email.aiLabel}
          </Badge>
          <span className="text-xs text-muted-foreground">{email.folder}</span>
        </div>

        <h3 className="text-sm font-medium text-foreground mb-2">
          {email.subject}
        </h3>
        
        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{email.from}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{email.from}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{email.date}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <ReplyAll className="w-4 h-4 mr-2" />
            Reply All
          </Button>
          <Button variant="outline" size="sm">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="ghost" size="sm">
            <Star className={cn(
              "w-4 h-4",
              email.isStarred ? "text-warning fill-current" : "text-muted-foreground"
            )} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
          {fullEmailContent}
        </div>
      </div>
    </div>
  );
}