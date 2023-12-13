import mongoose from 'mongoose';

export interface Job { 
  email: string;
  filename: string;
  status: 'pending' | 'success' | 'failed';
}


const jobSchema = new mongoose.Schema<Job>({
  email: String,
  filename: String,
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
});

export const JobModel = mongoose.model<Job>('Job', jobSchema);
