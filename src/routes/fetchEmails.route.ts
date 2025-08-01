import { Router } from "express";
import { fetchEmails } from "../controllers/emails/fetchEmails.controller.ts";
import { searchEmails } from "../controllers/emails/searchEmails.controller.ts";

const router = Router();

router.post("/fetch-emails", fetchEmails);
router.get('/search', searchEmails);

export default router;