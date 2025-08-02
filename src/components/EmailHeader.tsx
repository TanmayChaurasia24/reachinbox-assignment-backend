@@ .. @@
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
-  Trash2
+  Trash2,
+  Menu
 } from "lucide-react";

 interface EmailHeaderProps {
   searchQuery: string;
   onSearchChange: (query: string) => void;
   selectedEmails: string[];
   onRefresh: () => void;
+  onMenuClick?: () => void;
+  isSyncing?: boolean;
+  connectedAccounts?: number;
 }

 export function EmailHeader({ 
   searchQuery, 
   onSearchChange, 
   selectedEmails,
-  onRefresh 
+  onRefresh,
+  onMenuClick,
+  isSyncing = false,
+  connectedAccounts = 0
 }: EmailHeaderProps) {
-  const connectedAccounts = 2;
-  const isSyncing = true;

   return (
-    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
+    <div className="h-14 sm:h-16 border-b border-border bg-background px-3 sm:px-6 flex items-center justify-between">
       {/* Left side - Actions */}
-      <div className="flex items-center gap-3">
+      <div className="flex items-center gap-2 sm:gap-3">
+        {/* Mobile menu button */}
+        {onMenuClick && (
+          <Button 
+            variant="ghost" 
+            size="sm" 
+            onClick={onMenuClick}
+            className="md:hidden p-2"
+          >
+            <Menu className="w-4 h-4" />
+          </Button>
+        )}
+        
         {selectedEmails.length > 0 ? (
           <>
-            <span className="text-sm text-muted-foreground">
+            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
               {selectedEmails.length} selected
             </span>
             <Button variant="outline" size="sm">
-              <Archive className="w-4 h-4 mr-2" />
-              Archive
+              <Archive className="w-4 h-4 sm:mr-2" />
+              <span className="hidden sm:inline">Archive</span>
             </Button>
             <Button variant="outline" size="sm">
-              <Trash2 className="w-4 h-4 mr-2" />
-              Delete
+              <Trash2 className="w-4 h-4 sm:mr-2" />
+              <span className="hidden sm:inline">Delete</span>
             </Button>
           </>
         ) : (
           <>
-            <Button variant="filter">
-              <Filter className="w-4 h-4 mr-2" />
-              All Accounts
+            <Button variant="filter" className="hidden sm:flex">
+              <Filter className="w-4 h-4 sm:mr-2" />
+              <span className="hidden sm:inline">All Accounts</span>
             </Button>
-            <Button variant="filter">
-              <Calendar className="w-4 h-4 mr-2" />
-              Last 7 days
+            <Button variant="filter" className="hidden sm:flex">
+              <Calendar className="w-4 h-4 sm:mr-2" />
+              <span className="hidden sm:inline">Last 7 days</span>
             </Button>
           </>
         )}
       </div>

       {/* Right side - Search and Status */}
-      <div className="flex items-center gap-4">
+      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
         {/* Search */}
-        <div className="relative w-80">
+        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input
-            placeholder="Search emails by subject, sender, or label..."
+            placeholder="Search emails..."
             value={searchQuery}
             onChange={(e) => onSearchChange(e.target.value)}
-            className="pl-10 bg-background border-border"
+            className="pl-10 bg-background border-border text-sm"
           />
         </div>

         {/* Status */}
-        <div className="flex items-center gap-3">
+        <div className="flex items-center gap-2 sm:gap-3">
           <Button 
             variant="ghost" 
             size="sm"
             onClick={onRefresh}
-            className="px-2"
+            className="p-2"
           >
             <RefreshCw className={cn(
               "w-4 h-4",
               isSyncing && "animate-spin"
             )} />
           </Button>
           
-          <div className="flex items-center gap-2 text-sm text-muted-foreground">
+          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
             <Circle className={cn(
               "w-2 h-2 fill-current",
-              isSyncing ? "text-success" : "text-muted-foreground"
+              connectedAccounts > 0 ? "text-success" : "text-muted-foreground"
             )} />
             <span>Connected accounts: {connectedAccounts}</span>
           </div>