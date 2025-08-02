import type { Request, Response } from "express";
import axios from "axios";

export const EmailClassification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "email text not present or invalid",
      });
    }

    const prompt = `
You are an AI assistant that classifies emails into one of the following categories:

- Interested  
- Meeting Booked  
- Not Interested  
- Spam  
- Out of Office  

Your task is to analyze the email content and respond with the classification.

Only respond with a single-line JSON object in this exact format:
{ "category": "<one of the above categories>" }

For example:
{ "category": "Interested" }

Do not add any explanation, prefix, or suffix. Just return the JSON exactly as shown.

Email:
"${email}"

Your response:


`;

    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`;

    const headers = {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const data = {
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that classifies emails into one of the following: Interested, Meeting Booked, Not Interested, Spam, Out of Office.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const response = await axios.post(url, data, { headers });

    const raw = response.data?.result?.response?.trim();

    let parsedCategory;
    try {
      parsedCategory = JSON.parse(raw); 
    } catch (e) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw,
      });
    }

    return res.status(200).json({ parsedCategory });
  } catch (error: any) {
    console.error("Email classification error:", error);
    return res.status(500).json({
      message: "Error while classifying email",
      error: error.message || error,
    });
  }
};
