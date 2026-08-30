import Job from "../models/job.model";

interface CreateJobInput {
  title: string;
  company: string;
  description: string;
  location: string;
  salary: number;
  employmentType: "Full-Time" | "Part-Time" | "Internship" | "Remote";
  experience: string;
  skills: string[];
  recruiter: string;
}

export const createJob = async (data: CreateJobInput) => {
  const job = await Job.create(data);

  return job;
};

// Get jobs with search, filters and pagination
export const getAllJobs = async (query: any) => {
  const {
    keyword,
    location,
    employmentType,
    page = 1,
    limit = 10,
  } = query;

  const filter: any = {};

  // Search by title or company
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { company: { $regex: keyword, $options: "i" } },
    ];
  }

  // Filter by location
  if (location) {
    filter.location = location;
  }

  // Filter by employment type
  if (employmentType) {
    filter.employmentType = employmentType;
  }

  const jobs = await Job.find(filter)
    .populate("recruiter", "name email")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    total,
  };
};

export const getJobById = async (id: string) => {
  const job = await Job.findById(id).populate(
    "recruiter",
    "name email"
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

export const updateJob = async (
  id: string,
  data: Partial<CreateJobInput>
) => {
  const job = await Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

export const deleteJob = async (id: string) => {
  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    throw new Error("Job not found");
  }

  return {
    message: "Job deleted successfully",
  };
};
