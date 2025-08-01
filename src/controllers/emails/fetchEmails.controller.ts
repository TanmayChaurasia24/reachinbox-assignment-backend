import type { Request, Response } from "express";
import { ImapFlow } from "imapflow";

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

    // fetch latest message source
    // client.mailbox includes information about currently selected mailbox
    // "exists" value is also the largest sequence number available in the mailbox
    let message = await client.fetchOne(client.mailbox.exists, {
      source: true,
    });
    console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode.
    for await (let message of client.fetch("1:*", { envelope: true })) {
      console.log(`${message.uid}: ${message.envelope.subject}`);
    }

    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();

    // log out and close connection
    await client.logout();

    return res.status(200).json({
      title: "Success",
      description: "Emails fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      title: "Internal Server Error",
      description: "Failed to fetch the request",
      error: error,
    });
  }
};
