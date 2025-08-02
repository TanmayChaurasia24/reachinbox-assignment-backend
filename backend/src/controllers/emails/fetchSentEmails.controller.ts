import { json, type Request, type Response } from "express";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { indexEmails } from "../../services/indexEmail.ts";

const getDateOneWeekAgo = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // go back 7 days
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  
const silentLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
};
export const fetchSentEmails = async (req: Request, res: Response) => {
  const { email, password} = req.body;

  const client: any = new ImapFlow({
    logger: silentLogger,
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    await client.connect();

    let lock = await client.getMailboxLock("[Gmail]/Sent Mail");
    const today = getDateOneWeekAgo();

    const uids = await client.search({ since: today });
    const emails: any[] = [];
    console.log("uuids: ", uids);
    

    for await (let message of client.fetch(uids, {
      envelope: true,
      source: true,
      internalDate: true,
    })) {
      const parsed: any = await simpleParser(message.source);
      const from = parsed.from?.value?.[0];

      const sentemailData: any = {
        subject: message.envelope.subject,
        from_name: email,
        from_email: email,
        to: parsed.to?.text || "",
        date: message.internalDate,
        folder: "sent",
        account: email,
        content: parsed.text || "",
      };

      await indexEmails(sentemailData);
      emails.push(sentemailData);
    }

    lock.release();
    await client.logout();

    return res.status(200).json({
      title: "Success",
      description: `Emails fetched from sent`,
      emails,
    });
  } catch (error: any) {
    return res.status(500).json({
      title: "Internal Server Error",
      description: "Failed to fetch emails from sent",
      error: error.message || error,
    });
  }
};
