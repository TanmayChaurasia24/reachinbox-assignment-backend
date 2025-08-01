import {esClient}  from '../../lib/elasticsearch.ts';
import type { Request, Response } from 'express';

export const deleteAllEmails = async (req: Request, res: Response) => {
  try {
    const response = await esClient.deleteByQuery({
      index: 'emails',
      body: {
        query: {
          match_all: {}
        }
      }
    });

    // console.log('Deleted:', response);
    return res.status(201).json({
        message: "deleted"
    })
  } catch (error) {
    console.error('Failed to delete all emails:', error);
  }
};
