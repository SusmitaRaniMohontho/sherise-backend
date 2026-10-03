import express from "express";

import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ======================================================
// USER ROUTES
// ======================================================

// User appointment book করবে
router.post(
  "/",
  verifyToken,
  createAppointment
);

// User নিজের Accepted/Rejected appointments দেখবে
router.get(
  "/my",
  verifyToken,
  getMyAppointments
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Admin সব appointment request দেখবে
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAllAppointments
);

// Admin Accept / Reject করবে
router.put(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  updateAppointmentStatus
);


export default router;