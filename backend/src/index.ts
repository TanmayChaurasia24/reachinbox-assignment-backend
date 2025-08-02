import express from "express";
import dotenv from "dotenv";
import fetchEmails from "./routes/fetchEmails.route.ts";
import filterEmail from "./routes/filterEmailsAi.route.ts"
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  })
);

app.get("/", (req, res) => {
  res.send("server working!");
});

app.use("/api/emails", fetchEmails);
app.use("/api/ai", filterEmail);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
