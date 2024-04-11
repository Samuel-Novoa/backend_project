import { Router } from "express";
import * as usersController from "../../controllers/users";
import { authToken } from "../../middlewares";

const router = Router();

router.get(
  "/",
  usersController.getData
);

router.post(
  "/",
  //[authToken.verifyToken],
  usersController.postData
);


router.delete(
  "/:id",
  usersController.deleteUser
);


export default router;
