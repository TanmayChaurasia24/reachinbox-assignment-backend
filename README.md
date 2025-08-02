# 📬 ReachInbox Onebox – Unified Email Workspace

A modern, AI-powered email Onebox built with cutting-edge tools to help users manage their inboxes efficiently — categorized, real-time synced, and automatable.

---

## 🚀 Features

- 📥 Unified inbox across multiple email accounts
- 🔍 Full-text search with Elasticsearch
- 🤖 AI-powered email classification:
  - Interested
  - Meeting Booked
  - Not Interested
  - Spam
  - Out of Office
- 🔁 Real-time IMAP syncing
- 🔔 Slack/webhook notification on new "Interested" emails
- 🔧 Admin dashboard and API routes

---

## 🛠️ Tech Stack

| Layer        | Tech                            |
|-------------|----------------------------------|
| Frontend     | React + TypeScript + Vite       |
| UI           | Tailwind CSS + shadcn-ui        |
| Backend      | Node.js + Express               |                |
| Search       | Elasticsearch                   |
| AI API       | CloudFlare Worker AI            |

---


### Option 2: Run Locally in Your IDE

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
