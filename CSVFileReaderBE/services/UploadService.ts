import { EmployModel, Employ } from "../models/EmployModel";
import { DeptModel, Dept } from "../models/DeptModel";
import { SiteModel, Site } from "../models/SiteModel";
import { JobModel, Job } from "../models/JobModel";

export interface FormData {
  email: string;
  fileName: string;
  fileData: Employ[] | Dept[] | Site[];
}

interface SaveDataResponse {
  success: boolean;
  message: string;
  data?: { id: string; record: Employ | Dept | Site }[];
}

export const createJob = async (
  email: string,
  filename: string
): Promise<Job> => {
  try {
    const data = new JobModel({ email, filename, status: "pending" });
    await data.save();
    return Promise.resolve(data);
  } catch (error) {
    console.error(`Error creating job for ${filename}:`, error);
    return Promise.reject({
      success: false,
      message: `Failed to create a job for ${filename}`,
    });
  }
};

export const saveData = async (
  formData: FormData
): Promise<SaveDataResponse> => {
  try {
    const existingDeptData = await DeptModel.find({});
    const existingSiteData = await SiteModel.find({});
    const existingEmployData = await EmployModel.find({});

    const deptsToInsert: Dept[] = [];
    const sitesToInsert: Site[] = [];
    const employsToInsert: Employ[] = [];
    const insertedData: { id: string; record: Employ | Dept | Site }[] = [];

    for (const record of formData.fileData) {
      if ("deptname" in record && "deptno" in record) {
        const deptExists = existingDeptData.find(
          (dept) =>
            dept.deptname === record.deptname && dept.deptno === record.deptno
        );

        if (!deptExists) {
          const insertedDept = await DeptModel.insertMany([
            {
              deptname: record.deptname,
              deptno: record.deptno,
            },
          ]);
          insertedData.push({
            id: insertedDept[0]._id.toString(),
            record: record,
          });
        }
      }

      if ("sitename" in record && "siteno" in record) {
        const siteExists = existingSiteData.find(
          (site) =>
            site.sitename === record.sitename && site.siteno === record.siteno
        );

        if (!siteExists) {
          const insertedSite = await SiteModel.insertMany([
            {
              sitename: record.sitename,
              siteno: record.siteno,
            },
          ]);
          insertedData.push({
            id: insertedSite[0]._id.toString(),
            record: record,
          });
        }
      }

      if ("id" in record) {
        const employExists = existingEmployData.find(
          (employ) => employ.id === record.id
        );

        if (!employExists) {
          const insertedEmploy = await EmployModel.insertMany([
            {
              id: record.id,
              name: record.name,
              deptname: record.deptname,
              deptno: record.deptno,
              sitename: record.sitename,
              siteno: record.siteno,
            },
          ]);
          insertedData.push({
            id: insertedEmploy[0]._id.toString(),
            record: record,
          });
        }
      }
    }

    if (deptsToInsert.length > 0) {
      await DeptModel.insertMany(deptsToInsert);
    }

    if (sitesToInsert.length > 0) {
      await SiteModel.insertMany(sitesToInsert);
    }

    if (employsToInsert.length > 0) {
      await EmployModel.insertMany(employsToInsert);
    }

    await JobModel.updateOne(
      { email: formData.email, filename: formData.fileName },
      { status: "success" }
    );

    return {
      success: true,
      message: `Data saved successfully for ${formData.fileName}`,
      data: insertedData,
    };
  } catch (error) {
    console.error(`Error saving data for ${formData.fileName}:`, error);
    await JobModel.updateOne(
      { email: formData.email, filename: formData.fileName },
      { status: "failed" }
    );

    return {
      success: false,
      message: `Failed to save data for ${formData.fileName}`,
    };
  }
};
