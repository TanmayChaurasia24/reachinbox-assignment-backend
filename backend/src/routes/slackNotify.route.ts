import { Router } from "express";
import { getInterestedInboxEmails } from "../controllers/slackNotification/slackNotify.controller.ts";

const router = Router();

router.post("/notify", getInterestedInboxEmails)

export default router;