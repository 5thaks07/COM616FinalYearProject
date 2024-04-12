import { Router } from "express";
import * as MessageController from "../controllers/message.controller.js";

const router = Router();

router.post("/create", MessageController.createMessage);
router.get("/get/:chatId", MessageController.getMessages);

export default router;
