export interface Employee {
    id: string;
    name: string;
    deptname: string;
    deptno: string;
    sitename: string;
    siteno: string;
  }
  
  export interface Depts {
    deptname: string;
    deptno: string;
  }
  
  export interface Sites {
    sitename: string;
    siteno: string;
  }
  
  export interface FormData {
    email: string;
    fileName: string;
    fileData: Employee[] | Depts[] | Sites[];
  }
  