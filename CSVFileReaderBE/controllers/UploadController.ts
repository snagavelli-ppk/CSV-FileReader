import { Request, Response } from 'express';
import { createJob, saveData } from '../services/UploadService';

export const uploadData = async (req: Request, res: Response): Promise<void> => {
  try {
    const formData = req.body;

    const job = await createJob(formData.email, formData.fileName,);

    const data=await saveData(formData);
    res.json(data);
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


