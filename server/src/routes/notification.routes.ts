import { Router } from "express";
import { protect } from "../middleware/auth.middleware";

import {
  getMyNotifications,
  readNotification,
  readAllNotifications,
  createTestNotification,
} from "../controllers/notification.controller";

const router = Router();

router.get(
  "/",
  protect,
  getMyNotifications
);

router.post(
  "/test",
  protect,
  createTestNotification
);

router.patch(
  "/read-all",
  protect,
  readAllNotifications
);

router.patch(
  "/:id/read",
  protect,
  readNotification
);

export default router;