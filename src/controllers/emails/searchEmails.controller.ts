import type { Request, Response } from 'express';
import { esClient } from '../../lib/elasticsearch.ts';

export const searchEmails = async (req: Request, res: Response) => {
    const queryText = req.query.query as string;
  
    try {
      const result = await esClient.search({
        index: 'emails',
        query: {
          bool: {
            should: [
              { wildcard: { from: `*${queryText.toLowerCase()}*` } },
              { wildcard: { to: `*${queryText.toLowerCase()}*` } },
              { wildcard: { subject: `*${queryText.toLowerCase()}*` } }
            ]
          }
        }
      });
  
      return res.status(200).json({
        emails: result.hits.hits.map((hit) => hit._source),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Search failed',
        error,
      });
    }
  };
  
