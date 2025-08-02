@@ .. @@
 import { useState } from "react";
+import { useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Checkbox } from "@/components/ui/checkbox";
 import { cn } from "@/lib/utils";
 import { Star, StarOff } from "lucide-react";
+import { Email } from "@/services/emailService";

-interface Email {
-  id: string;
-  sender: string;
-  senderEmail: string;
-  subject: string;
-  preview: string;
-  date: string;
-  folder: string;
-  aiLabel: string;
-  labelColor: string;
-  isRead: boolean;
-  isStarred: boolean;
-}

 interface EmailListProps {
+  emails: Email[];
+  loading: boolean;
   selectedEmails: string[];
   onEmailSelect: (emailId: string) => void;
-  onEmailClick: (email: Email) => void;
+  onEmailClick: (email: any) => void;
   onToggleStar: (emailId: string) => void;
+  searchQuery: string;
 }

-const sampleEmails: Email[] = [
-  {
-    id: "1",
-    sender: "Jane Doe",
-    senderEmail: "jane@example.com",
-    subject: "Follow up on our meeting",
-    preview: "Hi there! I wanted to follow up on our meeting yesterday about the new project proposal...",
-    date: "2h ago",
-    folder: "Inbox",
-    aiLabel: "Interested",
-    labelColor: "bg-success",
-    isRead: false,
-    isStarred: true
-  },
-  {
-    id: "2",
-    sender: "Marketing Team",
-    senderEmail: "marketing@company.com",
-    subject: "Weekly Newsletter - Product Updates",
-    preview: "Check out our latest product updates and feature releases this week...",
-    date: "4h ago",
-    folder: "Inbox",
-    aiLabel: "Newsletter",
-    labelColor: "bg-accent",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "3",
-    sender: "Sarah Wilson",
-    senderEmail: "sarah.wilson@client.com",
-    subject: "Project proposal review",
-    preview: "Thank you for sending the proposal. I've reviewed it with my team and we have some feedback...",
-    date: "1d ago",
-    folder: "Inbox",
-    aiLabel: "Important",
-    labelColor: "bg-warning",
-    isRead: false,
-    isStarred: false
-  },
-  {
-    id: "4",
-    sender: "No Reply",
-    senderEmail: "noreply@spam.com",
-    subject: "Congratulations! You've won $1000",
-    preview: "Click here to claim your prize! Limited time offer...",
-    date: "2d ago",
-    folder: "Spam",
-    aiLabel: "Spam",
-    labelColor: "bg-destructive",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "5",
-    sender: "Alex Chen",
-    senderEmail: "alex@partner.com",
-    subject: "Partnership opportunity",
-    preview: "I hope this email finds you well. I'm reaching out regarding a potential partnership...",
-    date: "3d ago",
-    folder: "Inbox",
-    aiLabel: "Opportunity",
-    labelColor: "bg-primary",
-    isRead: true,
-    isStarred: true
-  },
-  {
-    id: "6",
-    sender: "GitHub",
-    senderEmail: "noreply@github.com",
-    subject: "Security alert: New sign-in",
-    preview: "We noticed a new sign-in to your GitHub account from a new device...",
-    date: "1w ago",
-    folder: "Inbox",
-    aiLabel: "Security",
-    labelColor: "bg-warning",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "7",
-    sender: "David Kumar",
-    senderEmail: "david.kumar@techcorp.com",
-    subject: "Interview feedback and next steps",
-    preview: "Thank you for taking the time to interview with our team yesterday...",
-    date: "1w ago",
-    folder: "Inbox",
-    aiLabel: "Important",
-    labelColor: "bg-warning",
-    isRead: false,
-    isStarred: true
-  },
-  {
-    id: "8",
-    sender: "LinkedIn",
-    senderEmail: "messages-noreply@linkedin.com",
-    subject: "You have 3 new connection requests",
-    preview: "John Smith, Maria Garcia, and Robert Johnson would like to connect with you...",
-    date: "2w ago",
-    folder: "Inbox",
-    aiLabel: "Social",
-    labelColor: "bg-accent",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "9",
-    sender: "Emma Thompson",
-    senderEmail: "emma@designstudio.co",
-    subject: "Design review completed",
-    preview: "I've finished reviewing the latest design mockups and have some suggestions...",
-    date: "2w ago",
-    folder: "Sent",
-    aiLabel: "Work",
-    labelColor: "bg-primary",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "10",
-    sender: "Customer Support",
-    senderEmail: "support@onlinestore.com",
-    subject: "Order confirmation #12345",
-    preview: "Thank you for your order! Your items will be shipped within 2-3 business days...",
-    date: "3w ago",
-    folder: "Archive",
-    aiLabel: "Purchase",
-    labelColor: "bg-success",
-    isRead: true,
-    isStarred: false
-  },
-  {
-    id: "11",
-    sender: "Michael Roberts",
-    senderEmail: "mike.roberts@venture.capital",
-    subject: "Investment opportunity discussion",
-    preview: "I came across your startup and I'm interested in learning more about your funding needs...",
-    date: "3w ago",
-    folder: "Inbox",
-    aiLabel: "Opportunity",
-    labelColor: "bg-primary",
-    isRead: false,
-    isStarred: true
-  },
-  {
-    id: "12",
-    sender: "Slack",
-    senderEmail: "feedback@slack.com",
-    subject: "Your workspace analytics report",
-    preview: "Here's your team's productivity summary for this month...",
-    date: "1mo ago",
-    folder: "Archive",
-    aiLabel: "Analytics",
-    labelColor: "bg-accent",
-    isRead: true,
-    isStarred: false
-  }
-];

+// Helper function to extract sender name from email
+const extractSenderName = (from: string): string => {
+  const match = from.match(/^(.+?)\s*<.*>$/);
+  return match ? match[1].trim().replace(/"/g, '') : from.split('@')[0];
+};
+
+// Helper function to extract email address
+const extractEmail = (from: string): string => {
+  const match = from.match(/<(.+?)>/);
+  return match ? match[1] : from;
+};
+
+// Helper function to format date
+const formatDate = (dateString: string): string => {
+  const date = new Date(dateString);
+  const now = new Date();
+  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
+  
+  if (diffInHours < 1) return 'Just now';
+  if (diffInHours < 24) return `${diffInHours}h ago`;
+  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
+  if (diffInHours < 720) return `${Math.floor(diffInHours / 168)}w ago`;
+  return `${Math.floor(diffInHours / 720)}mo ago`;
+};
+
+// Helper function to get AI label and color
+const getAILabel = (subject: string, content: string) => {
+  const text = (subject + ' ' + content).toLowerCase();
+  
+  if (text.includes('spam') || text.includes('prize') || text.includes('winner')) {
+    return { label: 'Spam', color: 'bg-destructive' };
+  }
+  if (text.includes('meeting') || text.includes('interview') || text.includes('important')) {
+    return { label: 'Important', color: 'bg-warning' };
+  }
+  if (text.includes('newsletter') || text.includes('update') || text.includes('news')) {
+    return { label: 'Newsletter', color: 'bg-accent' };
+  }
+  if (text.includes('opportunity') || text.includes('partnership') || text.includes('investment')) {
+    return { label: 'Opportunity', color: 'bg-primary' };
+  }
+  if (text.includes('security') || text.includes('alert') || text.includes('login')) {
+    return { label: 'Security', color: 'bg-warning' };
+  }
+  if (text.includes('order') || text.includes('purchase') || text.includes('payment')) {
+    return { label: 'Purchase', color: 'bg-success' };
+  }
+  if (text.includes('social') || text.includes('connect') || text.includes('follow')) {
+    return { label: 'Social', color: 'bg-accent' };
+  }
+  
+  return { label: 'General', color: 'bg-secondary' };
+};

 export function EmailList({ 
+  emails,
+  loading,
   selectedEmails, 
   onEmailSelect, 
   onEmailClick,
-  onToggleStar 
+  onToggleStar,
+  searchQuery
 }: EmailListProps) {
   const handleCheckboxChange = (emailId: string, checked: boolean) => {
     onEmailSelect(emailId);
   };

+  if (loading) {
+    return (
+      <div className="flex-1 overflow-hidden">
+        <div className="h-full flex items-center justify-center">
+          <div className="text-center">
+            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
+            <p className="text-muted-foreground">Loading emails...</p>
+          </div>
+        </div>
+      </div>
+    );
+  }
+
+  if (emails.length === 0) {
+    return (
+      <div className="flex-1 overflow-hidden">
+        <div className="h-full flex items-center justify-center">
+          <div className="text-center">
+            <p className="text-muted-foreground mb-2">No emails found</p>
+            {searchQuery && (
+              <p className="text-sm text-muted-foreground">
+                Try adjusting your search query
+              </p>
+            )}
+          </div>
+        </div>
+      </div>
+    );
+  }

   return (
     <div className="flex-1 overflow-hidden">
       <div className="h-full overflow-y-auto">
-        {sampleEmails.map((email) => {
-          const isSelected = selectedEmails.includes(email.id);
+        {emails.map((email, index) => {
+          const emailId = email.id || `email-${index}`;
+          const isSelected = selectedEmails.includes(emailId);
+          const senderName = extractSenderName(email.from);
+          const senderEmail = extractEmail(email.from);
+          const formattedDate = formatDate(email.date);
+          const aiLabel = getAILabel(email.subject, email.content);
+          const preview = email.content.substring(0, 150) + (email.content.length > 150 ? '...' : '');
           
           return (
             <div
-              key={email.id}
+              key={emailId}
               className={cn(
-                "border-b border-border hover:bg-card-hover transition-colors cursor-pointer",
-                !email.isRead && "bg-card",
+                "border-b border-border hover:bg-card-hover transition-colors cursor-pointer bg-card",
                 isSelected && "bg-secondary"
               )}
-              onClick={() => onEmailClick(email)}
+              onClick={() => onEmailClick({
+                id: emailId,
+                sender: senderName,
+                senderEmail: senderEmail,
+                subject: email.subject,
+                preview: preview,
+                date: formattedDate,
+                folder: email.folder,
+                aiLabel: aiLabel.label,
+                labelColor: aiLabel.color,
+                isRead: true,
+                isStarred: false,
+                content: email.content
+              })}
             >
-              <div className="p-4 flex items-center gap-4">
+              <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
                 {/* Checkbox */}
                 <Checkbox
                   checked={isSelected}
-                  onCheckedChange={(checked) => handleCheckboxChange(email.id, !!checked)}
+                  onCheckedChange={(checked) => handleCheckboxChange(emailId, !!checked)}
                   onClick={(e) => e.stopPropagation()}
+                  className="hidden sm:flex"
                 />

                 {/* Star */}
                 <Button
                   variant="ghost"
                   size="sm"
-                  className="p-0 h-auto w-auto hover:bg-transparent"
+                  className="p-0 h-auto w-auto hover:bg-transparent hidden sm:flex"
                   onClick={(e) => {
                     e.stopPropagation();
-                    onToggleStar(email.id);
+                    onToggleStar(emailId);
                   }}
                 >
-                  {email.isStarred ? (
-                    <Star className="w-4 h-4 text-warning fill-current" />
-                  ) : (
-                    <StarOff className="w-4 h-4 text-muted-foreground" />
-                  )}
+                  <StarOff className="w-4 h-4 text-muted-foreground" />
                 </Button>

                 {/* Email Content */}
                 <div className="flex-1 min-w-0">
-                  <div className="flex items-center justify-between mb-1">
-                    <div className="flex items-center gap-3">
+                  <div className="flex items-start sm:items-center justify-between mb-1 flex-col sm:flex-row gap-1 sm:gap-3">
+                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                       <span className={cn(
-                        "font-medium",
-                        !email.isRead ? "text-foreground" : "text-muted-foreground"
+                        "font-medium text-foreground truncate"
                       )}>
-                        {email.sender}
+                        {senderName}
                       </span>
-                      <span className="text-sm text-muted-foreground truncate">
-                        {email.senderEmail}
+                      <span className="text-sm text-muted-foreground truncate hidden sm:inline">
+                        {senderEmail}
                       </span>
                     </div>
-                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
-                      {email.date}
+                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
+                      {formattedDate}
                     </span>
                   </div>
                   
-                  <div className="flex items-center justify-between mb-2">
+                  <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-1 sm:gap-2">
                     <h3 className={cn(
-                      "text-sm truncate",
-                      !email.isRead ? "font-medium text-foreground" : "text-muted-foreground"
+                      "text-sm font-medium text-foreground truncate flex-1 min-w-0"
                     )}>
                       {email.subject}
                     </h3>
-                    <div className="flex items-center gap-2 ml-4">
+                    <div className="flex items-center gap-2 flex-shrink-0">
                       <Badge 
                         variant="outline" 
                         className={cn(
-                          "text-xs px-2 py-0.5 text-white border-0",
-                          email.labelColor
+                          "text-xs px-2 py-0.5 text-white border-0",
+                          aiLabel.color
                         )}
                       >
-                        {email.aiLabel}
+                        {aiLabel.label}
                       </Badge>
-                      <span className="text-xs text-muted-foreground">
+                      <span className="text-xs text-muted-foreground hidden sm:inline">
                         {email.folder}
                       </span>
                     </div>
                   </div>
                   
-                  <p className="text-sm text-muted-foreground truncate">
-                    {email.preview}
+                  <p className="text-sm text-muted-foreground line-clamp-2 sm:truncate">
+                    {preview}
                   </p>
+                  
+                  {/* Mobile-only info */}
+                  <div className="flex items-center justify-between mt-2 sm:hidden">
+                    <span className="text-xs text-muted-foreground">
+                      {email.folder}
+                    </span>
+                    <div className="flex items-center gap-2">
+                      <Checkbox
+                        checked={isSelected}
+                        onCheckedChange={(checked) => handleCheckboxChange(emailId, !!checked)}
+                        onClick={(e) => e.stopPropagation()}
+                      />
+                      <Button
+                        variant="ghost"
+                        size="sm"
+                        className="p-0 h-auto w-auto hover:bg-transparent"
+                        onClick={(e) => {
+                          e.stopPropagation();
+                          onToggleStar(emailId);
+                        }}
+                      >
+                        <StarOff className="w-4 h-4 text-muted-foreground" />
+                      </Button>
+                    </div>
+                  </div>
                 </div>
               </div>
             </div>