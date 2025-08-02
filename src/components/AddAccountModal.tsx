@@ .. @@
 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Mail, Lock, Server } from "lucide-react";
+import { emailService, FetchEmailsRequest } from "@/services/emailService";
+import { useToast } from "@/hooks/use-toast";

 interface AddAccountModalProps {
   isOpen: boolean;
   onClose: () => void;
-  onAddAccount: (accountData: any) => void;
+  onAddAccount: (accountData: FetchEmailsRequest) => void;
+  onEmailsFetched?: () => void;
 }

-export function AddAccountModal({ isOpen, onClose, onAddAccount }: AddAccountModalProps) {
+export function AddAccountModal({ 
+  isOpen, 
+  onClose, 
+  onAddAccount, 
+  onEmailsFetched 
+}: AddAccountModalProps) {
+  const { toast } = useToast();
+  const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
     email: "",
     password: "",
-    imapServer: "",
-    imapPort: "993",
+    imapServer: "imap.gmail.com",
+    imapPort: "993",
   });

-  const handleSubmit = (e: React.FormEvent) => {
+  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
-    onAddAccount(formData);
-    setFormData({ email: "", password: "", imapServer: "", imapPort: "993" });
-    onClose();
+    
+    if (!formData.email || !formData.password) {
+      toast({
+        title: "Error",
+        description: "Please fill in all required fields",
+        variant: "destructive",
+      });
+      return;
+    }
+
+    setLoading(true);
+    
+    try {
+      const response = await emailService.fetchEmails({
+        email: formData.email,
+        password: formData.password,
+      });
+
+      if (response.title === "Success") {
+        toast({
+          title: "Success",
+          description: `Connected to ${formData.email} and fetched ${response.emails?.length || 0} emails`,
+        });
+        
+        onAddAccount(formData);
+        onEmailsFetched?.();
+        setFormData({ email: "", password: "", imapServer: "imap.gmail.com", imapPort: "993" });
+        onClose();
+      } else {
+        throw new Error(response.description || "Failed to fetch emails");
+      }
+    } catch (error: any) {
+      console.error('Error fetching emails:', error);
+      toast({
+        title: "Connection Failed",
+        description: error.message || "Failed to connect to email account. Please check your credentials.",
+        variant: "destructive",
+      });
+    } finally {
+      setLoading(false);
+    }
   };

   const handleInputChange = (field: string, value: string) => {
     setFormData(prev => ({ ...prev, [field]: value }));
   };

   return (
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Mail className="w-5 h-5 text-primary" />
             Add Email Account
           </DialogTitle>
           <DialogDescription>
-            Connect your IMAP email account to start syncing emails with Onebox.
+            Connect your Gmail account to start syncing emails with Onebox.
+            <br />
+            <strong>Note:</strong> For Gmail, use an App Password instead of your regular password.
           </DialogDescription>
         </DialogHeader>

         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="email">Email Address</Label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 id="email"
                 type="email"
                 placeholder="your.email@gmail.com"
                 value={formData.email}
                 onChange={(e) => handleInputChange("email", e.target.value)}
                 className="pl-10"
                 required
+                disabled={loading}
               />
             </div>
           </div>

           <div className="space-y-2">
-            <Label htmlFor="password">Password</Label>
+            <Label htmlFor="password">App Password</Label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 id="password"
                 type="password"
-                placeholder="Enter your password"
+                placeholder="Enter your app password"
                 value={formData.password}
                 onChange={(e) => handleInputChange("password", e.target.value)}
                 className="pl-10"
                 required
+                disabled={loading}
               />
             </div>
           </div>

-          <div className="space-y-2">
+          <div className="space-y-2 hidden">
             <Label htmlFor="imapServer">IMAP Server</Label>
             <div className="relative">
               <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 id="imapServer"
                 type="text"
                 placeholder="imap.gmail.com"
                 value={formData.imapServer}
                 onChange={(e) => handleInputChange("imapServer", e.target.value)}
                 className="pl-10"
-                required
+                disabled={loading}
               />
             </div>
           </div>

-          <div className="space-y-2">
+          <div className="space-y-2 hidden">
             <Label htmlFor="imapPort">IMAP Port</Label>
             <Input
               id="imapPort"
               type="number"
               placeholder="993"
               value={formData.imapPort}
               onChange={(e) => handleInputChange("imapPort", e.target.value)}
-              required
+              disabled={loading}
             />
           </div>

           <div className="flex gap-3 pt-4">
-            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
+            <Button 
+              type="button" 
+              variant="outline" 
+              onClick={onClose} 
+              className="flex-1"
+              disabled={loading}
+            >
               Cancel
             </Button>
-            <Button type="submit" className="flex-1">
-              Add Account
+            <Button type="submit" className="flex-1" disabled={loading}>
+              {loading ? "Connecting..." : "Add Account"}
             </Button>
           </div>
         </form>
       </DialogContent>
     </Dialog>
   );
 }