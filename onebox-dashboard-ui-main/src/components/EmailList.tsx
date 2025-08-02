import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Star, StarOff } from "lucide-react";
import { emailAPI } from "@/services/api";

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

interface EmailListProps {
  selectedEmails: string[];
  onEmailSelect: (emailId: string) => void;
  onEmailClick: (email: Email) => void;
  onToggleStar: (emailId: string) => void;
}

const sampleEmails: any = [];

export function EmailList({ 
  selectedEmails, 
  onEmailSelect, 
  onEmailClick,
  onToggleStar 
}: EmailListProps) {
  const [emails, setemails] = useState<any[]>([]);

  const handleCheckboxChange = (emailId: string, checked: boolean) => {
    onEmailSelect(emailId);
  };

  useEffect(() => {
    const fetchAllEmails = async () => {
      const allemails = await emailAPI.getAll();

      console.log("all emails fetched: ", allemails);

      setemails(allemails);
      
    }

    fetchAllEmails();
  }, [])

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {emails.map((email) => {
          const isSelected = selectedEmails.includes(email.id);
          
          return (
            <div
              key={email.id}
              className={cn(
                "border-b border-border hover:bg-card-hover transition-colors cursor-pointer",
                !email.isRead && "bg-card",
                isSelected && "bg-secondary"
              )}
              onClick={() => onEmailClick(email)}
            >
              <div className="p-4 flex items-center gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleCheckboxChange(email.id, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Star */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto w-auto hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id);
                  }}
                >
                  {email.isStarred ? (
                    <Star className="w-4 h-4 text-warning fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>

                {/* Email Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "font-medium",
                        !email.isRead ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {email.from}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        {email.senderEmail}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {email.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={cn(
                      "text-sm truncate",
                      !email.isRead ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {email.subject}
                    </h3>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-2 py-0.5 text-white border-0",
                          email.labelColor
                        )}
                      >
                        {"ailabel"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {email.folder}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}