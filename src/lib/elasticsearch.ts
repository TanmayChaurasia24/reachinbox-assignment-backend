import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: "http://localhost:9200",
});

// ping the cluster to check if it's running
esClient
  .ping()
  .then(() => {
    console.log("Connected to Elasticsearch cluster");
  })
  .catch((err: any) => {
    console.error("Elasticsearch cluster is down!", err);
  });
