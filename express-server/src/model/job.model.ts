import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  index,
  DocumentType,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export enum JobType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
}

export enum ExperienceLevel {
  ENTRY_LEVEL = "entry-level",
  MID_LEVEL = "mid-level",
  SENIOR = "senior",
  EXECUTIVE = "executive",
}

@index({ title: "text", description: "text" })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Job {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  company!: string;

  @prop({ required: true })
  location!: string;

  @prop({ required: true })
  description!: string;

  @prop({ type: () => [String], default: [] })
  requirements!: string[];

  @prop({ type: () => [String], default: [] })
  skills!: string[];

  @prop({ 
    type: String, 
    enum: Object.values(JobType),
    required: true 
  })
  jobType!: JobType;

  @prop({ 
    type: String, 
    enum: Object.values(ExperienceLevel),
    required: true 
  })
  experienceLevel!: ExperienceLevel;

  @prop({ required: true })
  salaryMin!: number;

  @prop({ required: true })
  salaryMax!: number;

  @prop()
  salaryCurrency?: string;

  @prop({ default: true })
  isActive!: boolean;

  @prop({ ref: () => User, required: true })
  postedBy!: Ref<User>;

  @prop({ type: Date })
  applicationDeadline?: Date;

  @prop({ type: () => [String], default: [] })
  categories!: string[];

  @prop({ default: 0 })
  views!: number;

  @prop({ default: 0 })
  applicationsCount!: number;

  @prop()
  remote?: boolean;

  @prop({ type: () => [String], default: [] })
  benefits!: string[];
}

const JobModel = getModelForClass(Job);

export default JobModel;

