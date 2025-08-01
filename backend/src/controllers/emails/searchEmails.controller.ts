import type { Request, Response } from "express";
import { esClient } from "../../lib/elasticsearch.ts";

export const searchEmails = async (req: Request, res: Response) => {
  const queryText = req.query.query as string;

  try {
    const result = await esClient.search({
      index: "emails",
      query: {
        bool: {
          should: [
            { wildcard: { from: `*${queryText.toLowerCase()}*` } },
            { wildcard: { to: `*${queryText.toLowerCase()}*` } },
            { wildcard: { subject: `*${queryText.toLowerCase()}*` } },
          ],
        },
      },
    });

    return res.status(200).json({
      emails: result.hits.hits.map((hit) => hit._source),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Search failed",
      error,
    });
  }
};

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const result: any = await esClient.search({
      index: "emails", // use your actual index name
      scroll: "1m", // enable scroll for large results
      size: 1000, // fetch 1000 per scroll window
      body: {
        query: {
          match_all: {},
        },
      },
    });

    //   console.log("the result is: ", result);

    const hits: any = result.hits.hits.map((hit: any) => hit._source);

    return res.status(200).json({
      title: "Success",
      emails: hits,
    });
  } catch (error: any) {
    return res.status(500).json({
      title: "Failed",
      error: error.message || error,
    });
  }
};
