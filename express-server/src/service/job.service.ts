import JobModel, { Job } from "../model/job.model";
import { CreateJobInput, UpdateJobInput, GetJobsInput } from "../schema/job.schema";

export function createJob(input: CreateJobInput, userId: string) {
  return JobModel.create({ ...input, postedBy: userId });
}

export function findJobById(id: string) {
  return JobModel.findById(id).populate("postedBy", "firstName lastName email");
}

export function updateJobById(id: string, input: UpdateJobInput["body"]) {
  return JobModel.findByIdAndUpdate(
    id,
    { ...input },
    { new: true, runValidators: true }
  ).populate("postedBy", "firstName lastName email");
}

export function deleteJobById(id: string) {
  return JobModel.findByIdAndDelete(id);
}

export function findJobs(query: GetJobsInput) {
  const {
    page,
    limit = "10",
    search,
    jobType,
    experienceLevel,
    location,
    minSalary,
    maxSalary,
    remote,
    isActive,
  } = query;

  const pageNumber = parseInt(page || "1");
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Build query object
  const queryObject: any = {};

  if (search) {
    queryObject.$text = { $search: search };
  }

  if (jobType) {
    queryObject.jobType = jobType;
  }

  if (experienceLevel) {
    queryObject.experienceLevel = experienceLevel;
  }

  if (location) {
    queryObject.location = { $regex: location, $options: "i" };
  }

  if (minSalary || maxSalary) {
    queryObject.$and = [];
    if (minSalary) {
      queryObject.$and.push({ salaryMax: { $gte: parseInt(minSalary) } });
    }
    if (maxSalary) {
      queryObject.$and.push({ salaryMin: { $lte: parseInt(maxSalary) } });
    }
  }

  if (remote !== undefined) {
    queryObject.remote = remote === "true";
  }

  if (isActive !== undefined) {
    queryObject.isActive = isActive === "true";
  }

  // Get total count for pagination
  const totalPromise = JobModel.countDocuments(queryObject);

  // Get jobs with pagination and sorting
  const jobsPromise = JobModel.find(queryObject)
    .populate("postedBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  return Promise.all([jobsPromise, totalPromise]);
}

export function incrementJobViews(jobId: string) {
  return JobModel.findByIdAndUpdate(jobId, { $inc: { views: 1 } });
}

export function incrementApplicationsCount(jobId: string) {
  return JobModel.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });
}

export function findJobsByUserId(userId: string) {
  return JobModel.find({ postedBy: userId })
    .populate("postedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
}

