import express from "express";
import {
  createJobHandler,
  getJobHandler,
  updateJobHandler,
  deleteJobHandler,
  getJobsHandler,
  getMyJobsHandler,
  applyToJobHandler,
} from "../controller/job.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createJobSchema,
  updateJobSchema,
  getJobSchema,
  deleteJobSchema,
  getJobsSchema,
} from "../schema/job.schema";

const router = express.Router();

// Public routes
router.get("/", validateResource(getJobsSchema), getJobsHandler);
router.get("/:jobId", validateResource(getJobSchema), getJobHandler);

// Protected routes - require authentication
router.post("/", requireUser, validateResource(createJobSchema), createJobHandler);
router.put("/:jobId", requireUser, validateResource(updateJobSchema), updateJobHandler);
router.delete("/:jobId", requireUser, validateResource(deleteJobSchema), deleteJobHandler);

// Get jobs posted by current user
router.get("/my/jobs", requireUser, getMyJobsHandler);

// Apply to a job
router.post("/:jobId/apply", requireUser, validateResource(getJobSchema), applyToJobHandler);

export default router;

