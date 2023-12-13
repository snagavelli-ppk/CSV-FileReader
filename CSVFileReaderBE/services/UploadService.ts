import { EmployModel, Employ } from '../models/EmployModel';
import { DeptModel, Dept } from '../models/DeptModel';
import { SiteModel, Site } from '../models/SiteModel';
import { JobModel, Job } from '../models/JobModel';


export interface FormData {
    email: string;
    fileName: string;
    fileData: Employ[] | Dept[] | Site[];
  }

  export const createJob = async (email: string, filename: string): Promise<Job> => {
    try {
      const data = new JobModel({ email, filename, status: 'pending' });
      await data.save();
      return Promise.resolve(data); 
    } catch (error) {
      console.error(`Error creating job for ${filename}:`, error);
      return Promise.reject(error); 
    }
  };

export const saveData = async (formData : FormData): Promise<void> => {
  try {
    for (const record of formData.fileData) {
      if ('deptname' in record && 'deptno' in record) {
        const deptExists = await DeptModel.findOne({
          deptname: record.deptname,
          deptno: record.deptno,
        });

        if (!deptExists) {
          await DeptModel.insertMany([{
            deptname: record.deptname,
            deptno: record.deptno,
          }]);
        }
      }

      if ('sitename' in record && 'siteno' in record) {
        const siteExists = await SiteModel.findOne({
          sitename: record.sitename,
          siteno: record.siteno,
        });

        if (!siteExists) {
          await SiteModel.insertMany([{
            sitename: record.sitename,
            siteno: record.siteno,
          }]);
        }
      }
    }
    switch (formData.fileName) {
      case 'employees.csv':
        EmployModel.insertMany(formData.fileData);
        break;
      case 'depts.csv':
        DeptModel.insertMany(formData.fileData);
        break;
      case 'sites.csv':
        SiteModel.insertMany(formData.fileData);
        break;
      default:
        throw new Error('Invalid file name');
    }
      const data=await JobModel.updateOne({ email : formData.email, filename : formData.fileName}, { status: 'success' });
    } catch (error) {
      console.error(`Error saving data for ${formData.fileName}:`, error);
      await JobModel.updateOne({ email : formData.email, filename: formData.fileName }, { status: 'failed' });
    }
  };
