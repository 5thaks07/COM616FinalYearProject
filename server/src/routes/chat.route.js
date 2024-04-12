import { Router } from "express";
import * as ChatController from "../controllers/chat.controller.js";    

const router = Router();

router.post("/create", ChatController.createChat);
router.get("/find/:userId", ChatController.findUserChats);
router.get("/find/:firstUserId/:secondUserId", ChatController.findChat);

export default router;
