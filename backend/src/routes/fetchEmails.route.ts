import { Router } from "express";
import { fetchEmails } from "../controllers/emails/fetchEmails.controller.ts";
import { getAllEmails, searchEmails } from "../controllers/emails/searchEmails.controller.ts";
import { deleteAllEmails } from "../controllers/emails/deleteEmails.controller.ts";
import { fetchSentEmails } from "../controllers/emails/fetchSentEmails.controller.ts";

const router = Router();

router.post("/fetch-emails", fetchEmails);
router.post("/fetch-sentemails", fetchSentEmails);
router.get('/search', searchEmails);
router.get('/allemails', getAllEmails);
router.delete('/delete/all', deleteAllEmails);

export default router;