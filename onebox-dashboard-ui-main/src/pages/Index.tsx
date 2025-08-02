import { useState } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailHeader } from "@/components/EmailHeader";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { AddAccountModal } from "@/components/AddAccountModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

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

  const handleRefresh = () => {
    toast({
      title: "Syncing emails",
      description: "Fetching latest emails from all connected accounts...",
    });
  };

  const handleAddAccount = (accountData: any) => {
    toast({
      title: "Account added successfully",
      description: `Connected to ${accountData.email}`,
    });
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile/Tablet: Hidden sidebar, show toggle */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        selectedEmail ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
      )}>
        <EmailSidebar
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onAddAccount={() => setIsAddAccountModalOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <EmailHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedEmails={selectedEmails}
          onRefresh={handleRefresh}
        />

        {/* Email List & Detail - Responsive Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List - Hidden on mobile when email is selected */}
          <div className={cn(
            "flex-1 lg:flex-none lg:w-96 xl:w-1/2 transition-all duration-300",
            selectedEmail ? "hidden lg:block" : "block"
          )}>
            <EmailList
              selectedEmails={selectedEmails}
              onEmailSelect={handleEmailSelect}
              onEmailClick={handleEmailClick}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Email Detail - Full width on mobile, side panel on desktop */}
          {selectedEmail && (
            <div className={cn(
              "flex-1 lg:flex-none lg:w-96 xl:w-1/2",
              "absolute inset-0 lg:relative lg:inset-auto z-40 lg:z-auto"
            )}>
              <EmailDetail
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
};

export default Index;
