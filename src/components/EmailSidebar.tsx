@@ .. @@
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 import { 
   Inbox, 
   Send, 
   Trash2, 
   Archive, 
   Star, 
   AlertTriangle,
   Plus,
   Settings,
-  Mail
+  Mail,
+  X
 } from "lucide-react";

 interface EmailSidebarProps {
   selectedFolder: string;
   onFolderSelect: (folder: string) => void;
   onAddAccount: () => void;
+  isOpen?: boolean;
+  onClose?: () => void;
+  emailCounts?: Record<string, number>;
 }

-const folders = [
-  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
-  { id: "sent", label: "Sent", icon: Send, count: 45 },
-  { id: "starred", label: "Starred", icon: Star, count: 3 },
-  { id: "spam", label: "Spam", icon: AlertTriangle, count: 2 },
-  { id: "archive", label: "Archive", icon: Archive, count: 128 },
-  { id: "trash", label: "Trash", icon: Trash2, count: 7 },
-];

-export function EmailSidebar({ selectedFolder, onFolderSelect, onAddAccount }: EmailSidebarProps) {
+export function EmailSidebar({ 
+  selectedFolder, 
+  onFolderSelect, 
+  onAddAccount, 
+  isOpen = true, 
+  onClose,
+  emailCounts = {}
+}: EmailSidebarProps) {
+  const folders = [
+    { id: "inbox", label: "Inbox", icon: Inbox, count: emailCounts.inbox || 0 },
+    { id: "sent", label: "Sent", icon: Send, count: emailCounts.sent || 0 },
+    { id: "starred", label: "Starred", icon: Star, count: emailCounts.starred || 0 },
+    { id: "spam", label: "Spam", icon: AlertTriangle, count: emailCounts.spam || 0 },
+    { id: "archive", label: "Archive", icon: Archive, count: emailCounts.archive || 0 },
+    { id: "trash", label: "Trash", icon: Trash2, count: emailCounts.trash || 0 },
+  ];
+
   return (
-    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
+    <>
+      {/* Mobile overlay */}
+      {isOpen && onClose && (
+        <div 
+          className="fixed inset-0 bg-black/50 z-40 md:hidden"
+          onClick={onClose}
+        />
+      )}
+      
+      {/* Sidebar */}
+      <div className={cn(
+        "w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out z-50",
+        "md:relative md:translate-x-0",
+        isOpen ? "translate-x-0" : "-translate-x-full",
+        "fixed md:static"
+      )}>
+        {/* Mobile close button */}
+        {onClose && (
+          <Button
+            variant="ghost"
+            size="sm"
+            onClick={onClose}
+            className="absolute top-4 right-4 md:hidden z-10"
+          >
+            <X className="w-4 h-4" />
+          </Button>
+        )}
+        
       {/* Header */}
       <div className="p-6 border-b border-border">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
             <Mail className="w-4 h-4 text-white" />
           </div>
           <h1 className="text-xl font-semibold text-foreground">Onebox</h1>
         </div>
         
         <Button 
           onClick={onAddAccount}
           className="w-full"
           variant="outline"
           size="sm"
         >
           <Plus className="w-4 h-4 mr-2" />
           Add Account
         </Button>
       </div>

       {/* Folders */}
       <div className="flex-1 p-4">
         <div className="space-y-1">
           {folders.map((folder) => {
             const Icon = folder.icon;
             const isSelected = selectedFolder === folder.id;
             
             return (
               <Button
                 key={folder.id}
                 variant="sidebar"
                 className={cn(
                   "justify-between px-3 py-2 h-10",
                   isSelected && "bg-secondary text-foreground font-medium"
                 )}
                 onClick={() => onFolderSelect(folder.id)}
               >
                 <div className="flex items-center gap-3">
                   <Icon className="w-4 h-4" />
                   <span className="text-sm">{folder.label}</span>
                 </div>
                 {folder.count > 0 && (
                   <span className={cn(
                     "text-xs px-2 py-0.5 rounded-full",
                     isSelected 
                       ? "bg-primary text-primary-foreground" 
                       : "bg-muted text-muted-foreground"
                   )}>
                     {folder.count}
                   </span>
                 )}
               </Button>
             );
           })}
         </div>
       </div>

       {/* Footer */}
       <div className="p-4 border-t border-border">
         <Button variant="ghost" size="sm" className="w-full justify-start px-3">
           <Settings className="w-4 h-4 mr-3" />
           Settings
         </Button>
       </div>
+      </div>
+    </>
   );
 }