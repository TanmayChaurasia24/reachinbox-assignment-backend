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

export function EmailDetail({ email, onClose }: EmailDetailProps) {
  const fullEmailContent = `Hi there!

I wanted to follow up on our meeting yesterday about the new project proposal. I've had some time to think about our discussion, and I'm really excited about the potential collaboration.

Here are a few key points I'd like to address:

1. Timeline: Based on our conversation, I believe we can deliver the initial phase within 6-8 weeks
2. Budget: The proposed budget aligns well with our capabilities and resources
3. Team: I'd like to introduce you to our technical lead, Sarah, who would be working closely on this project

I've attached a more detailed project timeline and some additional references from our previous work. Please take a look when you have a moment.

Would you be available for a follow-up call this Friday to discuss the next steps? I'm flexible with timing and can accommodate your schedule.

Looking forward to hearing from you!

Best regards,
${email.sender}`;

  return (
    <div className="w-full lg:w-96 h-screen bg-card border-l border-border flex flex-col">
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
            <span>{email.sender}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{email.senderEmail}</span>
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