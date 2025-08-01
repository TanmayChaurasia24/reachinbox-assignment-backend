// src/services/indexEmail.ts
import { esClient } from '../lib/elasticsearch.ts';

interface EmailData {
  subject: string;
  from: string;
  to: string;
  date: Date;
}

export const indexEmails = async (emailData: EmailData) => {
  try {
    const indexName = 'emails';

    const exists = await esClient.indices.exists({ index: indexName });
    console.log("exists: ", exists);
    
    if (!exists) {
      const temp = await esClient.indices.create({
        index: indexName,
        body: {
            //@ts-ignore
          mappings: {
            properties: {
              subject: { type: 'text' },
              from: { type: 'keyword' },
              to: { type: 'keyword' },
              date: { type: 'date' },
            },
          },
        },
      });

      console.log(temp);
      
    }

    const temp2 = await esClient.index({
      index: indexName,
      document: emailData,
    });
    console.log(temp2);
    
  } catch (error) {
    console.error('Failed to index email:', error);
  }
};
