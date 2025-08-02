import { type Request, type Response } from "express";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { indexEmails } from "../../services/indexEmail.ts";
import { esClient } from "../../lib/elasticsearch.ts";
import axios from "axios";

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const getDateOneWeekAgo = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
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

export const fetchEmails = async (req: Request, res: Response) => {
  const { email, password } = req.body.data;

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

    let lock = await client.getMailboxLock("INBOX");
    const sinceDate = getDateOneWeekAgo();
    const uids = await client.search({ since: sinceDate });
    const emails: any[] = [];

    for await (let message of client.fetch(uids, {
      envelope: true,
      source: true,
      internalDate: true,
    })) {
      const parsed: any = await simpleParser(message.source);
      const from = parsed.from?.value?.[0];

      const content = parsed.text || "";
      const internalDate = message.internalDate;

      let category = "";

      if (isToday(internalDate)) {
        try {
          const response: any = await axios.post(
            "http://localhost:3000/api/ai/filter/emails", 
            { email: content }
          );
          console.log("resposen ai is: ", response.data);
          
          category = response.data.parsedCategory.category;
        } catch (err: any) {
          console.warn("AI classification failed:", err.message);
        }
      }

      const emailData: any = {
        subject: message.envelope.subject,
        form_name: from.name,
        form_email: from.address,
        to: parsed.to?.text || "",
        date: internalDate,
        folder: "inbox",
        account: email,
        content,
        category, 
      };

      await indexEmails(emailData); 
      emails.push(emailData);
    }

    lock.release();
    await client.logout();

    return res.status(200).json({
      title: "Success",
      description: `Emails fetched and classified from "inbox"`,
      emails,
    });
  } catch (error: any) {
    return res.status(500).json({
      title: "Internal Server Error",
      description: "Failed to fetch emails",
      error: error.message || error,
    });
  }
};

export const getInboxEmails = async (req: Request, res: Response) => {
  const { account }: any = req.query; // e.g., user@gmail.com

  try {
    const result = await esClient.search({
      index: 'emails', 
      scroll: "1m",
      size: 1000, // number of emails to return
      body: {
        query: {
          bool: {
            must: [
              { match: { folder: 'inbox' } },
              ...(account ? [{ match: { account } }] : []),
            ],
          },
        },
        sort: [{ date: { order: 'desc' } }],
      },
    });

    const emails = result.hits.hits.map((hit: any) => hit._source);

    res.status(200).json({
      title: 'Success',
      description: 'Inbox emails fetched from database',
      emails,
    });
  } catch (error: any) {
    res.status(500).json({
      title: 'Internal Server Error',
      description: 'Failed to fetch inbox emails',
      error: error.message || error,
    });
  }
};

