import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CSVReaderWrapper from "./CSVReaderWrapper";
import { Employee, Depts, Sites, FormData } from "./interfaces";
import { mapCSVToEmployee, mapCSVToDepts, mapCSVToSites } from "./csvMapping";
import { submitFormData } from "./apiCalls";

const { Option } = Select;

const AntForm: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [employData, setEmployData] = useState<Employee[]>([]);
  const [deptsData, setDeptsData] = useState<Depts[]>([]);
  const [sitesData, setSitesData] = useState<Sites[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    form.validateFields(["email"]);
  };

  const handleFileSelectChange = (value: string) => {
    setSelectedFileName(value === "undefined" ? undefined : value);
    setFileError("");
  };

  const isValidCSV = (data: any[], expectedHeaders: string[]): boolean => {
    if (data.length === 0) {
      return false;
    }

    const headers = data[0];
    return expectedHeaders.every((header, index) => headers[index] === header);
  };

  const handleCSVRead = (data: any[]) => {
    const formattedData = mapCSVToEmployee(data);
    setEmployData(formattedData);

    if (
      selectedFileName === "employees.csv" &&
      !isValidCSV(data, [
        "id",
        "name",
        "deptname",
        "deptno",
        "sitename",
        "siteno",
      ])
    ) {
      setFileError("Invalid CSV file for Employees.");
    } else {
      setFileError("");
    }
  };

  const handleDeptsCSVRead = (data: any[]) => {
    const formattedData = mapCSVToDepts(data);
    setDeptsData(formattedData);

    if (
      selectedFileName === "depts.csv" &&
      !isValidCSV(data, ["deptname", "deptno"])
    ) {
      setFileError("Invalid CSV file for Depts.");
    } else {
      setFileError("");
    }
  };

  const handleSitesCSVRead = (data: any[]) => {
    const formattedData = mapCSVToSites(data);
    setSitesData(formattedData);

    if (
      selectedFileName === "sites.csv" &&
      !isValidCSV(data, ["sitename", "siteno"])
    ) {
      setFileError("Invalid CSV file for Sites.");
    } else {
      setFileError("");
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch (errorInfo) {
      console.error('Validation failed:', errorInfo);
      return;
    }

    if (!email) {
      setEmailError("Email is required.");
      return;
    } else {
      setEmailError(validateEmail(email));
    }

    if (!selectedFileName) {
      setFileError("File is required.");
      return;
    } else if (fileError) {
      return;
    } else {
      setFileError("");
    }

    if (selectedFileName === "employees.csv" && employData.length === 0) {
      setFileError("Please select a valid Employees CSV file.");
      return;
    }

    try {
      const formData: FormData = {
        email,
        fileName: selectedFileName || "", // Handle undefined case here
        fileData: [],
      };
      switch (selectedFileName) {
        case "employees.csv":
          formData.fileData = employData;
          break;
        case "depts.csv":
          formData.fileData = deptsData;
          break;
        case "sites.csv":
          formData.fileData = sitesData;
          break;
        default:
          break;
      }

      const res = await submitFormData(formData);
      console.log(res);
      message.success("Form submitted successfully!");
      form.resetFields();
      setEmail("");
      setSelectedFileName(undefined);
      setEmployData([]);
      setDeptsData([]);
      setSitesData([]);
    } catch (error) {
      console.error("Error submitting Data:", error);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (!email || emailError || !selectedFileName || fileError) {
      return true;
    }

    if (
      selectedFileName === "employees.csv" &&
      (employData.length === 0 || fileError)
    ) {
      return true;
    }

    return false;
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Invalid email format";
  };

  return (
    <div style={{ padding: "20px" }}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input type="email" value={email} onChange={handleEmailChange} />
        </Form.Item>
        <Form.Item
          label="Select CSV File"
          rules={[{ required: true, message: "Please select a CSV file" }]}
        >
          <Select value={selectedFileName} onChange={handleFileSelectChange}>
            <Option value="" disabled>
              Select CSV File
            </Option>
            <Option value="employees.csv">Employees CSV</Option>
            <Option value="depts.csv">Depts CSV</Option>
            <Option value="sites.csv">Sites CSV</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={`Upload ${selectedFileName} CSV File`}
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          extra={`Please upload a ${selectedFileName} CSV file`}
        >
          {selectedFileName && (
            <CSVReaderWrapper
              onFileLoaded={(data: any[]) => {
                if (selectedFileName === "employees.csv") {
                  handleCSVRead(data);
                } else if (selectedFileName === "depts.csv") {
                  handleDeptsCSVRead(data);
                } else if (selectedFileName === "sites.csv") {
                  handleSitesCSVRead(data);
                }
              }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            Submit <UploadOutlined />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AntForm;
