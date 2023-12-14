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
    const existingDeptData: Record<string, Dept> = {};
    const existingSiteData: Record<string, Site> = {};
    const existingEmployData: Record<string, Employ> = {};

    (await DeptModel.find({})).forEach((dept) => {
      existingDeptData[dept.deptno] = dept;
    });

    (await SiteModel.find({})).forEach((site) => {
      existingSiteData[site.siteno] = site;
    });

    (await EmployModel.find({})).forEach((employ) => {
      existingEmployData[employ.id] = employ;
    });

    const deptsToInsert: Dept[] = [];
    const sitesToInsert: Site[] = [];
    const employsToInsert: Employ[] = [];
    const insertedData: { id: string; record: Employ | Dept | Site }[] = [];

    for (const record of formData.fileData) {
      if ("deptname" in record && "deptno" in record) {
        if (!existingDeptData[record.deptno]) {
          deptsToInsert.push(record);
          insertedData.push({
            id: record.deptno,
            record: record,
          });
        }
      }

      if ("sitename" in record && "siteno" in record) {
        if (!existingSiteData[record.siteno]) {
          sitesToInsert.push(record);
          insertedData.push({
            id: record.siteno,
            record: record,
          });
        }
      }

      if ("id" in record) {
        if (!existingEmployData[record.id]) {
          employsToInsert.push(record);
          insertedData.push({
            id: record.id,
            record: record,
          });
        }
      }
    }

    if (deptsToInsert.length > 0) {
      await DeptModel.create(deptsToInsert);
    }

    if (sitesToInsert.length > 0) {
      await SiteModel.create(sitesToInsert);
    }

    if (employsToInsert.length > 0) {
      await EmployModel.create(employsToInsert);
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
