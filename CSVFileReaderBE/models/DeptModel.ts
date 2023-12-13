import mongoose from 'mongoose';

export interface Dept {
  deptname: string;
  deptno: string;
}

const deptSchema = new mongoose.Schema<Dept>({
  deptname: String,
  deptno: String,
});

export const DeptModel = mongoose.model<Dept>('Department', deptSchema);
