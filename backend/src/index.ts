import express from "express";
import dotenv from "dotenv";
import fetchEmails from "./routes/fetchEmails.route.ts"
dotenv.config();

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("server working!");
});

app.use("/api/emails", fetchEmails);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});