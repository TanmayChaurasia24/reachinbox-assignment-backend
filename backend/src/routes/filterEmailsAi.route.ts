import { Router } from "express";
import { EmailClassification } from "../controllers/ai/filterEmails.controller.ts";

const router = Router();

router.post("/filter/emails", EmailClassification)

export default router;