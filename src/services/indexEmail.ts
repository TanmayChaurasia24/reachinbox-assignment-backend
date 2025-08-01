// src/services/indexEmail.ts
import { esClient } from "../lib/elasticsearch.ts";

interface EmailData {
  subject: string;
  from: string;
  to: string;
  folder: string;
  account: string;
  date: Date;
  content: string;
}

export const indexEmails = async (emailData: EmailData) => {
  try {
    const indexName = "emails";

    const exists = await esClient.indices.exists({ index: indexName });

    if (!exists) {
      await esClient.indices.create({
        index: indexName,
        body: {
          //@ts-ignore
          mappings: {
            properties: {
              subject: { type: "text" },
              from: { type: "text" },
              to: { type: "keyword" },
              folder: { type: "keyword" },
              account: { type: "keyword" },
              date: { type: "date" },
              content: {type: "text"}
            },
          },
        },
      });
    }

    const temp2 = await esClient.index({
      index: indexName,
      document: emailData,
    });
  } catch (error) {
    console.error("Failed to index email:", error);
  }
};
