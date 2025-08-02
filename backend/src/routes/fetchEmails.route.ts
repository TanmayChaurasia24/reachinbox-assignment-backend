import { Router } from "express";
import { fetchEmails, getInboxEmails } from "../controllers/emails/fetchEmails.controller.ts";
import { getAllEmails, searchEmails } from "../controllers/emails/searchEmails.controller.ts";
import { deleteAllEmails } from "../controllers/emails/deleteEmails.controller.ts";
import { fetchSentEmails, getSentEmails } from "../controllers/emails/fetchSentEmails.controller.ts";

const router = Router();

router.post("/fetch-emails", fetchEmails);
router.post("/fetch-sentemails", fetchSentEmails);
router.get('/search', searchEmails);
router.post('/all/inbox', getInboxEmails);
router.post('/all/sent', getSentEmails);
router.get('/allemails', getAllEmails);
router.delete('/delete/all', deleteAllEmails);

export default router;