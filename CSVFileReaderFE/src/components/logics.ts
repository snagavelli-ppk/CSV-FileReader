import { Employee, Depts, Sites } from './interface';
export const mapCSVToEmployee = (data: any[]): Employee[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);
  
    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Employee] = row[index];
        return acc;
      }, {} as Employee)
    );
  };
  
  export const mapCSVToDepts = (data: any[]): Depts[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);
  
    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Depts] = row[index];
        return acc;
      }, {} as Depts)
    );
  };
  
  export const mapCSVToSites = (data: any[]): Sites[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);
  
    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Sites] = row[index];
        return acc;
      }, {} as Sites)
    );
  };
  