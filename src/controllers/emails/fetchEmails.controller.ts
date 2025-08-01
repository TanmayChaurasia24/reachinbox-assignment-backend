import type { Request, Response } from "express";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";


const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

// function to fetch emails from the inbox
export const fetchEmails = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const client: any = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    // Wait until client connects and authorizes
    await client.connect();
    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock("INBOX");

    const today = getTodayDate();

    // Search for all messages from today
    const uids = await client.search({
      since: today,
    });


    const emails: any[] = [];

    // fetch latest message source
    // client.mailbox includes information about currently selected mailbox
    // "exists" value is also the largest sequence number available in the mailbox
    // let message = await client.fetchOne(client.mailbox.exists, {
    //   source: true,
    // });
    // console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode.
    for await (let message of client.fetch(uids, {
      envelope: true,
      source: true,
      internalDate: true,
    })) {
      const parsed: any = await simpleParser(message.source);

      emails.push({
        subject: message.envelope.subject,
        from: parsed.from?.text || "",
        to: parsed.to?.text || "",
        date: message.internalDate,
        // content: parsed.text || parsed.html || "",
      });
    }

    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();

    // log out and close connection
    await client.logout();

    return res.status(200).json({
      title: "Success",
      description: "Emails fetched successfully",
      emails: emails,
    });
  } catch (error: any) {
    return res.status(500).json({
      title: "Internal Server Error",
      description: "Failed to fetch the request",
      error: error,
    });
  }
};
