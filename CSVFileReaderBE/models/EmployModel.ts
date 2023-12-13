import mongoose from 'mongoose';

export interface Employ {
  id: string;
  name: string;
  deptname: string;
  deptno: string;
  sitename: string;
  siteno: string;
}


const employSchema = new mongoose.Schema<Employ>({
  id: String,
  name: String,
  deptname: String,
  deptno: String,
  sitename: String,
  siteno: String,
});

export const EmployModel = mongoose.model<Employ>('Employ', employSchema);
