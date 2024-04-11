import { Router } from "express";
import * as rolesController from "../../controllers/roles";

const router = Router();
router.get(
  "/",
  //[authToken.verifyToken],
  rolesController.getData
);

router.get("/:id", rolesController.getDataById);

router.post("/", rolesController.postData);

router.put("/:id", rolesController.updateDataById);


export default router;
