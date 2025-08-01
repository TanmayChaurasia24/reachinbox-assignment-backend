import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Star, StarOff } from "lucide-react";

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

const sampleEmails: Email[] = [
  {
    id: "1",
    sender: "Jane Doe",
    senderEmail: "jane@example.com",
    subject: "Follow up on our meeting",
    preview: "Hi there! I wanted to follow up on our meeting yesterday about the new project proposal...",
    date: "2h ago",
    folder: "Inbox",
    aiLabel: "Interested",
    labelColor: "bg-success",
    isRead: false,
    isStarred: true
  },
  {
    id: "2",
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "Weekly Newsletter - Product Updates",
    preview: "Check out our latest product updates and feature releases this week...",
    date: "4h ago",
    folder: "Inbox",
    aiLabel: "Newsletter",
    labelColor: "bg-accent",
    isRead: true,
    isStarred: false
  },
  {
    id: "3",
    sender: "Sarah Wilson",
    senderEmail: "sarah.wilson@client.com",
    subject: "Project proposal review",
    preview: "Thank you for sending the proposal. I've reviewed it with my team and we have some feedback...",
    date: "1d ago",
    folder: "Inbox",
    aiLabel: "Important",
    labelColor: "bg-warning",
    isRead: false,
    isStarred: false
  },
  {
    id: "4",
    sender: "No Reply",
    senderEmail: "noreply@spam.com",
    subject: "Congratulations! You've won $1000",
    preview: "Click here to claim your prize! Limited time offer...",
    date: "2d ago",
    folder: "Spam",
    aiLabel: "Spam",
    labelColor: "bg-destructive",
    isRead: true,
    isStarred: false
  },
  {
    id: "5",
    sender: "Alex Chen",
    senderEmail: "alex@partner.com",
    subject: "Partnership opportunity",
    preview: "I hope this email finds you well. I'm reaching out regarding a potential partnership...",
    date: "3d ago",
    folder: "Inbox",
    aiLabel: "Opportunity",
    labelColor: "bg-primary",
    isRead: true,
    isStarred: true
  },
  {
    id: "6",
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "Security alert: New sign-in",
    preview: "We noticed a new sign-in to your GitHub account from a new device...",
    date: "1w ago",
    folder: "Inbox",
    aiLabel: "Security",
    labelColor: "bg-warning",
    isRead: true,
    isStarred: false
  },
  {
    id: "7",
    sender: "David Kumar",
    senderEmail: "david.kumar@techcorp.com",
    subject: "Interview feedback and next steps",
    preview: "Thank you for taking the time to interview with our team yesterday...",
    date: "1w ago",
    folder: "Inbox",
    aiLabel: "Important",
    labelColor: "bg-warning",
    isRead: false,
    isStarred: true
  },
  {
    id: "8",
    sender: "LinkedIn",
    senderEmail: "messages-noreply@linkedin.com",
    subject: "You have 3 new connection requests",
    preview: "John Smith, Maria Garcia, and Robert Johnson would like to connect with you...",
    date: "2w ago",
    folder: "Inbox",
    aiLabel: "Social",
    labelColor: "bg-accent",
    isRead: true,
    isStarred: false
  },
  {
    id: "9",
    sender: "Emma Thompson",
    senderEmail: "emma@designstudio.co",
    subject: "Design review completed",
    preview: "I've finished reviewing the latest design mockups and have some suggestions...",
    date: "2w ago",
    folder: "Sent",
    aiLabel: "Work",
    labelColor: "bg-primary",
    isRead: true,
    isStarred: false
  },
  {
    id: "10",
    sender: "Customer Support",
    senderEmail: "support@onlinestore.com",
    subject: "Order confirmation #12345",
    preview: "Thank you for your order! Your items will be shipped within 2-3 business days...",
    date: "3w ago",
    folder: "Archive",
    aiLabel: "Purchase",
    labelColor: "bg-success",
    isRead: true,
    isStarred: false
  },
  {
    id: "11",
    sender: "Michael Roberts",
    senderEmail: "mike.roberts@venture.capital",
    subject: "Investment opportunity discussion",
    preview: "I came across your startup and I'm interested in learning more about your funding needs...",
    date: "3w ago",
    folder: "Inbox",
    aiLabel: "Opportunity",
    labelColor: "bg-primary",
    isRead: false,
    isStarred: true
  },
  {
    id: "12",
    sender: "Slack",
    senderEmail: "feedback@slack.com",
    subject: "Your workspace analytics report",
    preview: "Here's your team's productivity summary for this month...",
    date: "1mo ago",
    folder: "Archive",
    aiLabel: "Analytics",
    labelColor: "bg-accent",
    isRead: true,
    isStarred: false
  }
];

export function EmailList({ 
  selectedEmails, 
  onEmailSelect, 
  onEmailClick,
  onToggleStar 
}: EmailListProps) {
  const handleCheckboxChange = (emailId: string, checked: boolean) => {
    onEmailSelect(emailId);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {sampleEmails.map((email) => {
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
                        {email.sender}
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
                        {email.aiLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {email.folder}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {email.preview}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}