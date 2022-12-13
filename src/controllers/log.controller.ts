import { Router } from "express";
import { LogService } from "../services/log.service";

const router = Router();
const logService = new LogService();

router.get("/extract", async (req, res) => {
  try {
    const logs = await logService.getLogs();
    return res.status(200).send(logs);
  } catch (e) {
    return res.status(500).send(e);
  }
});
