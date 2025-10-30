import { Request, Response } from "express";
import {
  CreateJobInput,
  UpdateJobInput,
  GetJobInput,
  DeleteJobInput,
  GetJobsInput,
} from "../schema/job.schema";
import {
  createJob,
  findJobById,
  updateJobById,
  deleteJobById,
  findJobs,
  incrementJobViews,
  incrementApplicationsCount,
  findJobsByUserId,
} from "../service/job.service";
import log from "../utils/logger";

export async function createJobHandler(
  req: Request<{}, {}, CreateJobInput>,
  res: Response
) {
  const body = req.body;
  const userId = res.locals.user._id;

  try {
    const job = await createJob(body, userId);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: e.message,
    });
  }
}

export async function getJobHandler(
  req: Request<GetJobInput>,
  res: Response
) {
  const { jobId } = req.params;

  try {
    const job = await findJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment views
    await incrementJobViews(jobId);

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: e.message,
    });
  }
}

export async function updateJobHandler(
  req: Request<UpdateJobInput["params"], {}, UpdateJobInput["body"]>,
  res: Response
) {
  const { jobId } = req.params;
  const body = req.body;
  const userId = res.locals.user._id;

  try {
    // First check if job exists and user owns it
    const existingJob = await findJobById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is the owner
    if (existingJob.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this job",
      });
    }

    const job = await updateJobById(jobId, body);

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: e.message,
    });
  }
}

export async function deleteJobHandler(
  req: Request<DeleteJobInput>,
  res: Response
) {
  const { jobId } = req.params;
  const userId = res.locals.user._id;

  try {
    // First check if job exists and user owns it
    const existingJob = await findJobById(jobId);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is the owner
    if (existingJob.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this job",
      });
    }

    await deleteJobById(jobId);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: e.message,
    });
  }
}

export async function getJobsHandler(
  req: Request<{}, {}, {}, GetJobsInput>,
  res: Response
) {
  try {
    const [jobs, total] = await findJobs(req.query);

    return res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: parseInt(req.query.page || "1"),
          limit: parseInt(req.query.limit || "10"),
          totalPages: Math.ceil(total / parseInt(req.query.limit || "10")),
        },
      },
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: e.message,
    });
  }
}

export async function getMyJobsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  try {
    const jobs = await findJobsByUserId(userId);

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
      error: e.message,
    });
  }
}

export async function applyToJobHandler(
  req: Request<GetJobInput>,
  res: Response
) {
  const { jobId } = req.params;

  try {
    const job = await findJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // Increment applications count
    await incrementApplicationsCount(jobId);

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: e.message,
    });
  }
}

