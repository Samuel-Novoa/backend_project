
import { Router } from "express";
import * as simulatorController from "../../controllers/simulator";

const router = Router();

router.post("/", simulatorController.getResultsData);
router.post("/results", simulatorController.getResults);
router.post("/reportsssss", simulatorController.getDataById);
router.get("/allreports/:id", simulatorController.getReportsByUserId);


export default router;
