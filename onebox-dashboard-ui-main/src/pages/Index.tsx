import { useState } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailHeader } from "@/components/EmailHeader";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { AddAccountModal } from "@/components/AddAccountModal";
import { useToast } from "@/hooks/use-toast";

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
      {/* Sidebar */}
      <EmailSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onAddAccount={() => setIsAddAccountModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <EmailHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedEmails={selectedEmails}
          onRefresh={handleRefresh}
        />

        {/* Email List */}
        <div className="flex-1 flex overflow-hidden">
          <EmailList
            selectedEmails={selectedEmails}
            onEmailSelect={handleEmailSelect}
            onEmailClick={handleEmailClick}
            onToggleStar={handleToggleStar}
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
      />
    </div>
  );
};

export default Index;
