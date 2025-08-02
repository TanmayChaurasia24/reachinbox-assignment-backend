@@ .. @@
-import { useState } from "react";
+import { useState, useEffect, useCallback } from "react";
 import { EmailSidebar } from "@/components/EmailSidebar";
 import { EmailHeader } from "@/components/EmailHeader";
 import { EmailList } from "@/components/EmailList";
 import { EmailDetail } from "@/components/EmailDetail";
 import { AddAccountModal } from "@/components/AddAccountModal";
 import { useToast } from "@/hooks/use-toast";
+import { emailService, Email, FetchEmailsRequest } from "@/services/emailService";

 const Index = () => {
   const { toast } = useToast();
+  const [emails, setEmails] = useState<Email[]>([]);
+  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
+  const [loading, setLoading] = useState(false);
+  const [isSyncing, setIsSyncing] = useState(false);
   const [selectedFolder, setSelectedFolder] = useState("inbox");
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
   const [selectedEmail, setSelectedEmail] = useState<any>(null);
   const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
+  const [connectedAccounts, setConnectedAccounts] = useState(0);
+  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
+  const [emailCounts, setEmailCounts] = useState<Record<string, number>>({});

+  // Load emails on component mount
+  useEffect(() => {
+    loadAllEmails();
+  }, []);
+
+  // Filter emails based on search query and selected folder
+  useEffect(() => {
+    let filtered = emails;
+
+    // Filter by folder
+    if (selectedFolder !== "inbox") {
+      filtered = filtered.filter(email => 
+        email.folder.toLowerCase() === selectedFolder.toLowerCase()
+      );
+    }
+
+    // Filter by search query
+    if (searchQuery.trim()) {
+      const query = searchQuery.toLowerCase();
+      filtered = filtered.filter(email =>
+        email.subject.toLowerCase().includes(query) ||
+        email.from.toLowerCase().includes(query) ||
+        email.content.toLowerCase().includes(query)
+      );
+    }
+
+    setFilteredEmails(filtered);
+  }, [emails, selectedFolder, searchQuery]);
+
+  // Update email counts
+  useEffect(() => {
+    const counts: Record<string, number> = {
+      inbox: 0,
+      sent: 0,
+      starred: 0,
+      spam: 0,
+      archive: 0,
+      trash: 0,
+    };
+
+    emails.forEach(email => {
+      const folder = email.folder.toLowerCase();
+      if (counts.hasOwnProperty(folder)) {
+        counts[folder]++;
+      } else {
+        counts.inbox++; // Default to inbox if folder not recognized
+      }
+    });
+
+    setEmailCounts(counts);
+  }, [emails]);
+
+  const loadAllEmails = async () => {
+    setLoading(true);
+    try {
+      const response = await emailService.getAllEmails();
+      if (response.emails) {
+        setEmails(response.emails);
+        if (response.emails.length === 0) {
+          toast({
+            title: "No emails found",
+            description: "Connect an email account to start syncing emails",
+          });
+        }
+      }
+    } catch (error) {
+      console.error('Error loading emails:', error);
+      toast({
+        title: "Error",
+        description: "Failed to load emails. Please try again.",
+        variant: "destructive",
+      });
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const searchEmails = useCallback(async (query: string) => {
+    if (!query.trim()) {
+      return;
+    }
+
+    setIsSyncing(true);
+    try {
+      const response = await emailService.searchEmails(query);
+      if (response.emails) {
+        setFilteredEmails(response.emails);
+      }
+    } catch (error) {
+      console.error('Error searching emails:', error);
+      toast({
+        title: "Search failed",
+        description: "Failed to search emails. Please try again.",
+        variant: "destructive",
+      });
+    } finally {
+      setIsSyncing(false);
+    }
+  }, [toast]);
+
+  // Debounced search
+  useEffect(() => {
+    if (searchQuery.trim()) {
+      const timeoutId = setTimeout(() => {
+        searchEmails(searchQuery);
+      }, 500);
+
+      return () => clearTimeout(timeoutId);
+    }
+  }, [searchQuery, searchEmails]);

   const handleEmailSelect = (emailId: string) => {
     setSelectedEmails(prev => 
       prev.includes(emailId) 
         ? prev.filter(id => id !== emailId)
         : [...prev, emailId]
     );
   };

   const handleEmailClick = (email: any) => {
     setSelectedEmail(email);
   };

   const handleToggleStar = (emailId: string) => {
     toast({
       title: "Email starred",
       description: "Email has been added to your starred folder",
     });
   };

-  const handleRefresh = () => {
+  const handleRefresh = async () => {
+    setIsSyncing(true);
     toast({
       title: "Syncing emails",
       description: "Fetching latest emails from all connected accounts...",
     });
+    
+    try {
+      await loadAllEmails();
+      toast({
+        title: "Sync complete",
+        description: "Emails have been updated",
+      });
+    } catch (error) {
+      toast({
+        title: "Sync failed",
+        description: "Failed to sync emails. Please try again.",
+        variant: "destructive",
+      });
+    } finally {
+      setIsSyncing(false);
+    }
   };

-  const handleAddAccount = (accountData: any) => {
+  const handleAddAccount = (accountData: FetchEmailsRequest) => {
+    setConnectedAccounts(prev => prev + 1);
     toast({
       title: "Account added successfully",
       description: `Connected to ${accountData.email}`,
     });
   };

+  const handleEmailsFetched = () => {
+    loadAllEmails();
+  };
+
+  const handleFolderSelect = (folder: string) => {
+    setSelectedFolder(folder);
+    setIsSidebarOpen(false); // Close sidebar on mobile after selection
+  };
+
+  const handleSearchChange = (query: string) => {
+    setSearchQuery(query);
+  };

   return (
     <div className="h-screen bg-background flex overflow-hidden">
       {/* Sidebar */}
       <EmailSidebar
         selectedFolder={selectedFolder}
-        onFolderSelect={setSelectedFolder}
+        onFolderSelect={handleFolderSelect}
         onAddAccount={() => setIsAddAccountModalOpen(true)}
+        isOpen={isSidebarOpen}
+        onClose={() => setIsSidebarOpen(false)}
+        emailCounts={emailCounts}
       />

       {/* Main Content */}
       <div className="flex-1 flex flex-col min-w-0">
         {/* Header */}
         <EmailHeader
           searchQuery={searchQuery}
-          onSearchChange={setSearchQuery}
+          onSearchChange={handleSearchChange}
           selectedEmails={selectedEmails}
           onRefresh={handleRefresh}
+          onMenuClick={() => setIsSidebarOpen(true)}
+          isSyncing={isSyncing}
+          connectedAccounts={connectedAccounts}
         />

         {/* Email List */}
-        <div className="flex-1 flex overflow-hidden">
+        <div className="flex-1 flex overflow-hidden relative">
           <EmailList
+            emails={filteredEmails}
+            loading={loading}
             selectedEmails={selectedEmails}
             onEmailSelect={handleEmailSelect}
             onEmailClick={handleEmailClick}
             onToggleStar={handleToggleStar}
+            searchQuery={searchQuery}
           />

           {/* Email Detail (conditionally rendered) */}
           {selectedEmail && (
             <EmailDetail
               email={selectedEmail}
               onClose={() => setSelectedEmail(null)}
             />
           )}
         </div>
       </div>

       {/* Add Account Modal */}
       <AddAccountModal
         isOpen={isAddAccountModalOpen}
         onClose={() => setIsAddAccountModalOpen(false)}
         onAddAccount={handleAddAccount}
+        onEmailsFetched={handleEmailsFetched}
       />
     </div>
   );
 };

 export default Index;