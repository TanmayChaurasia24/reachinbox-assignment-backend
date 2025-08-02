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
    preview: "Hi, I wanted to follow up on our discussion about the new project proposal...",
    date: "2:45 PM",
    folder: "inbox",
    aiLabel: "Interested",
    labelColor: "bg-emerald-500",
    isRead: false,
    isStarred: true,
  },
  {
    id: "2",
    sender: "John Smith",
    senderEmail: "john@company.com",
    subject: "Project timeline update",
    preview: "The project is progressing well. Here's the latest update on our milestones...",
    date: "1:30 PM",
    folder: "inbox",
    aiLabel: "Important",
    labelColor: "bg-blue-500",
    isRead: true,
    isStarred: false,
  },
  {
    id: "3",
    sender: "Sarah Wilson",
    senderEmail: "sarah@startup.io",
    subject: "Partnership opportunity",
    preview: "I'd love to discuss a potential partnership between our companies...",
    date: "12:15 PM",
    folder: "inbox",
    aiLabel: "Business",
    labelColor: "bg-purple-500",
    isRead: false,
    isStarred: false,
  },
  {
    id: "4",
    sender: "LinkedIn",
    senderEmail: "noreply@linkedin.com",
    subject: "Your weekly network update",
    preview: "See who's been viewing your profile and connect with new people...",
    date: "11:00 AM",
    folder: "inbox",
    aiLabel: "Social",
    labelColor: "bg-cyan-500",
    isRead: true,
    isStarred: false,
  },
  {
    id: "5",
    sender: "Mike Johnson",
    senderEmail: "mike@agency.com",
    subject: "Design review feedback",
    preview: "The new designs look great! I have a few suggestions for improvements...",
    date: "10:30 AM",
    folder: "inbox",
    aiLabel: "Feedback",
    labelColor: "bg-orange-500",
    isRead: false,
    isStarred: true,
  },
  {
    id: "6",
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "Security alert: New sign-in",
    preview: "We detected a new sign-in to your GitHub account from a new device...",
    date: "9:45 AM",
    folder: "inbox",
    aiLabel: "Security",
    labelColor: "bg-red-500",
    isRead: true,
    isStarred: false,
  },
  {
    id: "7",
    sender: "Emma Davis",
    senderEmail: "emma@client.com",
    subject: "Invoice payment confirmation",
    preview: "Thank you for your recent invoice. Payment has been processed...",
    date: "Yesterday",
    folder: "inbox",
    aiLabel: "Finance",
    labelColor: "bg-green-500",
    isRead: true,
    isStarred: false,
  },
  {
    id: "8",
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "Q4 Campaign Results",
    preview: "Our Q4 marketing campaign exceeded expectations with a 25% increase...",
    date: "Yesterday",
    folder: "inbox",
    aiLabel: "Marketing",
    labelColor: "bg-pink-500",
    isRead: false,
    isStarred: false,
  },
  {
    id: "9",
    sender: "Newsletter Digest",
    senderEmail: "digest@newsletter.com",
    subject: "This week in tech",
    preview: "The latest technology news and trends you shouldn't miss...",
    date: "2 days ago",
    folder: "inbox",
    aiLabel: "Newsletter",
    labelColor: "bg-gray-500",
    isRead: true,
    isStarred: false,
  },
  {
    id: "10",
    sender: "Spam Account",
    senderEmail: "suspicious@fake.com",
    subject: "You've won $1000000!!!",
    preview: "Congratulations! You are our lucky winner. Click here to claim...",
    date: "3 days ago",
    folder: "spam",
    aiLabel: "Spam",
    labelColor: "bg-red-600",
    isRead: false,
    isStarred: false,
  },
  {
    id: "11",
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Team building event next week",
    preview: "Join us for a fun team building event next Friday at the park...",
    date: "3 days ago",
    folder: "inbox",
    aiLabel: "Internal",
    labelColor: "bg-indigo-500",
    isRead: true,
    isStarred: true,
  },
  {
    id: "12",
    sender: "Support Team",
    senderEmail: "support@service.com",
    subject: "Your ticket has been resolved",
    preview: "Good news! The issue you reported has been successfully resolved...",
    date: "1 week ago",
    folder: "inbox",
    aiLabel: "Support",
    labelColor: "bg-teal-500",
    isRead: true,
    isStarred: false,
  },
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
              <div className="p-3 lg:p-4 flex items-center gap-3 lg:gap-4">
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
                         "font-medium text-sm lg:text-base",
                         !email.isRead ? "text-foreground" : "text-muted-foreground"
                       )}>
                         {email.sender}
                       </span>
                       <span className="text-xs lg:text-sm text-muted-foreground truncate hidden sm:inline">
                         {email.senderEmail}
                       </span>
                    </div>
                     <span className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap ml-2 lg:ml-4">
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
                     <div className="flex items-center gap-1 lg:gap-2 ml-2 lg:ml-4">
                       <Badge 
                         variant="outline" 
                         className={cn(
                           "text-xs px-1.5 lg:px-2 py-0.5 text-white border-0",
                           email.labelColor
                         )}
                       >
                         {email.aiLabel}
                       </Badge>
                       <span className="text-xs text-muted-foreground hidden lg:inline">
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