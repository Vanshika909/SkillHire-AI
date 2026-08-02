import { Request, Response } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../services/job.service";

export const create = async (req: any, res: Response) => {
  try {
    const job = await createJob({
      ...req.body,
      recruiter: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const { jobs, total } = await getAllJobs(req.query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const job = await getJobById(id);

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
     const id = String(req.params.id);
    const job = await updateJob(id, req.body);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
     const id = String(req.params.id);
    const result = await deleteJob(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};