import type { Request, Response } from "express";
import { esClient } from "../../lib/elasticsearch.ts";
import type { match } from "assert";
import { sendSlackNotification } from "../../utils/slackNotifier.ts";

export const getInterestedInboxEmails = async (req: Request, res: Response) => {
  const { account }: any = req.body;

  try {
    const result = await esClient.search({
      index: "emails",
      scroll: "1m",
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              { match: { folder: "inbox" } },
              { match: { category: "Interested"} },
              ...(account ? [{ match: { account } }] : []),
            ],
          },
        },
        sort: [{ date: { order: "desc" } }],
      },
    });

    const emails = result.hits.hits.map((hit: any) => hit._source);

    // 🔔 Send Slack notification if interested emails are found
    if (emails.length > 0) {
      for (const email of emails) {
        await sendSlackNotification({
          subject: email.subject,
          from_name: email.from_name,
          from_email: email.from_email,
          content: email.content,
        });
      }
    }

    res.status(200).json({
      title: "Success",
      description: `Interested emails fetched from inbox`,
      emails,
    });
  } catch (error: any) {
    res.status(500).json({
      title: "Internal Server Error",
      description: "Failed to fetch interested emails",
      error: error.message || error,
    });
  }
};
