import { Router } from "express";
import { fetchEmails } from "../controllers/emails/fetchEmails.controller.ts";

const router = Router();

router.post("/fetch-emails", fetchEmails);

export default router;