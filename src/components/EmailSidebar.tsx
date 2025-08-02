import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Inbox, Send, Plus, Settings, Mail } from "lucide-react";

interface EmailSidebarProps {
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onAddAccount: () => void;
  accounts: Array<{ email: string; password: string }>;
}

const folders = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "sent", label: "Sent", icon: Send, count: 45 },
];

export function EmailSidebar({
  selectedFolder,
  onFolderSelect,
  onAddAccount,
  accounts,
}: EmailSidebarProps) {
  const handleSwitchAccounts = (account: any) => {
    if(localStorage.getItem('currentGmailAccount')) {
      localStorage.removeItem('currentGmailAccount');
    }
    localStorage.setItem('currentGmailAccount', JSON.stringify([account.email, account.password]));
    window.location.reload();
    toast({
      title: account.email,
      description: `switched to ${account.email}`
    })
  };

  return (
    <div className="w-64 lg:w-72 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">
            Onebox
          </h1>
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

      {/* Accounts */}
      {accounts.length > 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium mb-2">Accounts</h3>
          <div className="space-y-1">
            {accounts.map((account, index) => (
              <div
                key={index}
                className="text-xs px-3 py-1 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSwitchAccounts(account)}
              >
                {account.email}
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
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
    </div>
  );
}
