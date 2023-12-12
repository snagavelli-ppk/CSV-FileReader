import React from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  MenuItem,
  InputLabel,
  Input,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Select, SelectChangeEvent } from "@mui/material";
import CSVReaderWrapper from "./CSVReaderWrapper";
import { Employee, Depts, Sites } from "./interface";
import { mapCSVToEmployee, mapCSVToDepts, mapCSVToSites } from "./logics";

const Form = () => {
  const [email, setEmail] = React.useState<string>("");
  const [selectedFileName, setSelectedFileName] = React.useState<string>("");
  const [employData, setEmployData] = React.useState<Employee[]>([]);
  const [deptsData, setDeptsData] = React.useState<Depts[]>([]);
  const [sitesData, setSitesData] = React.useState<Sites[]>([]);
  const [emailError, setEmailError] = React.useState<string>("");
  const [fileError, setFileError] = React.useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleFileSelectChange = (e: SelectChangeEvent<string>) => {
    const selectedFileName = e.target.value as string;
    setSelectedFileName(selectedFileName);
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
    let valid = true;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      setEmailError(validateEmail(email));
    }

    if (!selectedFileName) {
      setFileError("File is required.");
      valid = false;
    } else if (fileError) {
      valid = false;
    } else {
      setFileError("");
    }

    if (selectedFileName === "employees.csv" && employData.length === 0) {
      setFileError("Please select a valid Employees CSV file.");
      valid = false;
    }

    if (valid) {
      console.log("Email:", email);
      console.log("Selected File:", selectedFileName);

      switch (selectedFileName) {
        case "employees.csv":
          console.log("Employees Data:", employData);
          break;
        case "depts.csv":
          console.log("Depts Data:", deptsData);
          break;
        case "sites.csv":
          console.log("Sites Data:", sitesData);
          break;
        default:
          break; 
      }

      

      setEmail("");
      setSelectedFileName("");
      setEmployData([]);
      setDeptsData([]);
      setSitesData([]);
    }
  };

  const getFileFormatInfo = (fileName: string): string => {
    switch (fileName) {
      case "employees.csv":
        return "Columns: id, name, deptname, deptno, sitename, siteno";
      case "depts.csv":
        return "Columns: deptname, deptno";
      case "sites.csv":
        return "Columns: sitename, siteno";
      default:
        return "";
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
    <>
      <div>
        <Container component="main">
          <Paper
            elevation={3}
            sx={{
              marginLeft: '550px',
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" style={{ backgroundColor: 'lightblue', padding: '20px', borderRadius: '5px' }}>
              React Email and CSV App
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              required
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="file-select">Select File</InputLabel>
              <Select
                label="Select File"
                value={selectedFileName}
                variant="outlined"
                onChange={handleFileSelectChange}
                input={<Input id="file-select" />}
                error={!!fileError}
              >
                <MenuItem value="employees.csv">Employees</MenuItem>
                <MenuItem value="depts.csv">Depts</MenuItem>
                <MenuItem value="sites.csv">Sites</MenuItem>
              </Select>
              {fileError && <FormHelperText error>{fileError}</FormHelperText>}
            </FormControl>
            {selectedFileName && (
              <div>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {getFileFormatInfo(selectedFileName)}
                </Typography>
                <CSVReaderWrapper
                  onFileLoaded={(data: any[]) => {
                    if (selectedFileName === 'employees.csv') {
                      handleCSVRead(data);
                    } else if (selectedFileName === 'depts.csv') {
                      handleDeptsCSVRead(data);
                    } else if (selectedFileName === 'sites.csv') {
                      handleSitesCSVRead(data);
                    }
                  }}
                />
              </div>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
              disabled={isSubmitDisabled()}
            >
              Submit
            </Button>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Form;
