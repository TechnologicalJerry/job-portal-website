import { object, string, TypeOf, number, array, boolean, z } from "zod";

const JobTypeEnum = z.enum(["full-time", "part-time", "contract", "internship", "freelance"]);
const ExperienceLevelEnum = z.enum(["entry-level", "mid-level", "senior", "executive"]);

export const createJobSchema = object({
  body: object({
    title: string().min(1, "Job title is required"),
    company: string().min(1, "Company name is required"),
    location: string().min(1, "Location is required"),
    description: string().min(10, "Description must be at least 10 characters"),
    requirements: array(string()).optional(),
    skills: array(string()).optional(),
    jobType: JobTypeEnum,
    experienceLevel: ExperienceLevelEnum,
    salaryMin: number().positive("Minimum salary must be positive"),
    salaryMax: number().positive("Maximum salary must be positive"),
    salaryCurrency: string().optional(),
    applicationDeadline: string().optional(),
    categories: array(string()).optional(),
    remote: boolean().optional(),
    benefits: array(string()).optional(),
  }).refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"],
  }),
});

export const updateJobSchema = object({
  params: object({
    jobId: string(),
  }),
  body: object({
    title: string().optional(),
    company: string().optional(),
    location: string().optional(),
    description: string().optional(),
    requirements: array(string()).optional(),
    skills: array(string()).optional(),
    jobType: JobTypeEnum.optional(),
    experienceLevel: ExperienceLevelEnum.optional(),
    salaryMin: number().optional(),
    salaryMax: number().optional(),
    salaryCurrency: string().optional(),
    applicationDeadline: string().optional(),
    categories: array(string()).optional(),
    isActive: boolean().optional(),
    remote: boolean().optional(),
    benefits: array(string()).optional(),
  }),
});

export const getJobSchema = object({
  params: object({
    jobId: string(),
  }),
});

export const deleteJobSchema = object({
  params: object({
    jobId: string(),
  }),
});

export const getJobsSchema = object({
  query: object({
    page: string().optional(),
    limit: string().optional(),
    search: string().optional(),
    jobType: string().optional(),
    experienceLevel: string().optional(),
    location: string().optional(),
    minSalary: string().optional(),
    maxSalary: string().optional(),
    remote: string().optional(),
    isActive: string().optional(),
  }),
});

export type CreateJobInput = TypeOf<typeof createJobSchema>["body"];
export type UpdateJobInput = TypeOf<typeof updateJobSchema>;
export type GetJobInput = TypeOf<typeof getJobSchema>["params"];
export type DeleteJobInput = TypeOf<typeof deleteJobSchema>["params"];
export type GetJobsInput = TypeOf<typeof getJobsSchema>["query"];

